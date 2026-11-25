const encoder = new TextEncoder()

async function passwordKey(secret, id, password) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const hash = await crypto.subtle.sign('HMAC', key, encoder.encode(`${id}:${password}`))
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('')
}

function validText(value, minimum, maximum) {
  return typeof value === 'string' && value.length >= minimum && value.length <= maximum
}

async function readBody(request) {
  const contentType = request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase()
  if (contentType !== 'application/json') return null
  const reader = request.body?.getReader()
  if (!reader) return null
  const decoder = new TextDecoder()
  let bytes = 0
  let body = ''
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) return JSON.parse(body + decoder.decode())
      bytes += value.byteLength
      if (bytes > 8192) {
        await reader.cancel()
        return null
      }
      body += decoder.decode(value, { stream: true })
    }
  } catch {
    return null
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin')
    const headers = {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Origin',
    }
    if (origin && origin === env.GUESTBOOK_ORIGIN) {
      headers['Access-Control-Allow-Origin'] = origin
      headers['Access-Control-Allow-Methods'] = 'GET, POST, DELETE, OPTIONS'
      headers['Access-Control-Allow-Headers'] = 'Content-Type'
    }
    const json = (data, status = 200) => Response.json(data, { status, headers })
    const path = new URL(request.url).pathname
    const match = /^\/messages\/([0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/.exec(path)
    if (path !== '/messages' && !match) return json({ error: 'not_found' }, 404)
    if (origin && origin !== env.GUESTBOOK_ORIGIN) return json({ error: 'forbidden' }, 403)
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })

    try {
      const client = request.headers.get('CF-Connecting-IP') ?? 'local'
      if (request.method === 'GET' && !match) {
        if (!(await env.READ_LIMIT.limit({ key: client })).success) return json({ error: 'rate_limited' }, 429)
        const { results } = await env.DB.prepare('SELECT id, name, message FROM guest_messages ORDER BY created_at DESC, id DESC LIMIT 100').all()
        return json(results)
      }

      if (!(request.method === 'POST' && !match) && !(request.method === 'DELETE' && match)) {
        return json({ error: 'method_not_allowed' }, 405)
      }
      if (!origin || origin !== env.GUESTBOOK_ORIGIN) return json({ error: 'forbidden' }, 403)
      if (!env.GUESTBOOK_SECRET) return json({ error: 'unavailable' }, 503)
      const rate = await env.WRITE_LIMIT.limit({ key: client })
      if (!rate.success) return json({ error: 'rate_limited' }, 429)
      const body = await readBody(request)
      if (!validText(body?.password, 8, 80)) return json({ error: 'invalid_input' }, 400)

      if (match) {
        const id = match[1]
        if (!(await env.DELETE_LIMIT.limit({ key: id })).success) return json({ error: 'rate_limited' }, 429)
        const hash = await passwordKey(env.GUESTBOOK_SECRET, id, body.password)
        const { meta } = await env.DB.prepare('DELETE FROM guest_messages WHERE id = ? AND password_key = ?').bind(id, hash).run()
        return meta.changes ? new Response(null, { status: 204, headers }) : json({ error: 'invalid_password' }, 403)
      }

      const name = typeof body.name === 'string' ? body.name.trim() : ''
      const message = typeof body.message === 'string' ? body.message.trim() : ''
      if (body.website !== '' && body.website !== undefined) return json({ error: 'invalid_input' }, 400)
      if (!validText(name, 1, 40) || !validText(message, 1, 500)) return json({ error: 'invalid_input' }, 400)
      const id = crypto.randomUUID()
      const hash = await passwordKey(env.GUESTBOOK_SECRET, id, body.password)
      await env.DB.prepare('INSERT INTO guest_messages (id, name, message, password_key, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(id, name, message, hash, Date.now()).run()
      return json({ id, name, message }, 201)
    } catch {
      return json({ error: 'unavailable' }, 503)
    }
  },
}
