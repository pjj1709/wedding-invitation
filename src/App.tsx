import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import weddingPhoto from './assets/wedding-cover.jpg'
import gardenPhoto from './assets/wedding-garden.jpg'
import bouquetPhoto from './assets/wedding-bouquet.jpg'
import veilPhoto from './assets/wedding-veil.jpg'
import portraitPhoto from './assets/wedding-portrait.jpg'

const invitation = {
  groom: '박정진',
  bride: '윤수빈',
  date: '2027-04-10',
  dateLabel: '2027.04.10 토요일',
  venue: '평택 JnJ 아트컨벤션웨딩홀 2층 카넬리안노아',
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토']
const gallery = [
  { src: gardenPhoto, alt: '꽃 아치 아래 선 커플' },
  { src: bouquetPhoto, alt: '흰 꽃다발과 결혼반지' },
  { src: veilPhoto, alt: '햇살에 비친 웨딩 베일' },
  { src: portraitPhoto, alt: '손을 잡고 걷는 커플' },
  { src: weddingPhoto, alt: '밝은 예식장으로 걸어가는 커플' },
]

const seoulDate = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function daysUntil(date: string) {
  const parts = seoulDate.formatToParts(new Date())
  const today = ['year', 'month', 'day'].map(unit => parts.find(part => part.type === unit)?.value).join('-')
  return (Date.parse(date) - Date.parse(today)) / 86_400_000
}

function Countdown({ date }: { date: string }) {
  const [days, setDays] = useState(() => daysUntil(date))

  useEffect(() => {
    const update = () => setDays(daysUntil(date))
    update()
    const timer = window.setInterval(update, 1000)
    return () => window.clearInterval(timer)
  }, [date])

  return <p className="invitation__countdown">{days === 0 ? 'D-DAY' : `D${days > 0 ? '-' : '+'}${Math.abs(days)}`}</p>
}

type GuestMessage = { id: string; name: string; message: string }
const apiUrl = import.meta.env.VITE_GUESTBOOK_API_URL?.trim().replace(/\/+$/, '')

function Guestbook() {
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [loading, setLoading] = useState(Boolean(apiUrl))
  const [loadError, setLoadError] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [pending, setPending] = useState(false)
  const [deleteId, setDeleteId] = useState<string>()

  useEffect(() => {
    if (!apiUrl) return
    const controller = new AbortController()

    async function loadMessages() {
      try {
        const response = await fetch(`${apiUrl}/messages`, { signal: controller.signal })
        if (!response.ok) throw new Error('Guestbook unavailable')
        const list = await response.json() as GuestMessage[]
        if (!controller.signal.aborted) setMessages(list)
      } catch {
        if (!controller.signal.aborted) setLoadError(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadMessages()
    return () => controller.abort()
  }, [loadAttempt])

  async function submitMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!apiUrl || pending) return
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name')).trim()
    const message = String(data.get('message')).trim()
    if (!name || !message) {
      setFeedback('이름과 메시지를 입력해 주세요.')
      return
    }

    setPending(true)
    try {
      const response = await fetch(`${apiUrl}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, password: data.get('password'), website: data.get('website') }),
      })
      if (response.status === 429) {
        setFeedback('요청이 많습니다. 잠시 후 다시 시도해 주세요.')
        return
      }
      if (!response.ok) throw new Error('Could not save message')
      const entry = await response.json() as GuestMessage
      setMessages(current => [entry, ...current].slice(0, 100))
      form.reset()
      setFeedback('축하 메시지를 저장했습니다.')
    } catch {
      setFeedback('메시지를 저장하지 못했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setPending(false)
    }
  }

  async function deleteMessage(event: FormEvent<HTMLFormElement>, entry: GuestMessage) {
    event.preventDefault()
    if (!apiUrl || pending) return
    const password = String(new FormData(event.currentTarget).get('deletePassword'))
    setPending(true)
    try {
      const response = await fetch(`${apiUrl}/messages/${encodeURIComponent(entry.id)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (response.status === 403) {
        setFeedback('비밀번호를 확인해 주세요.')
        return
      }
      if (response.status === 429) {
        setFeedback('요청이 많습니다. 잠시 후 다시 시도해 주세요.')
        return
      }
      if (!response.ok) throw new Error('Could not delete message')
      setMessages(current => current.filter(message => message.id !== entry.id))
      setDeleteId(undefined)
      setFeedback('축하 메시지를 삭제했습니다.')
    } catch {
      setFeedback('메시지를 삭제하지 못했습니다.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="invitation__section" aria-labelledby="guestbook-title">
      <h2 id="guestbook-title">축하 메시지</h2>
      <p className="guestbook__note">{apiUrl ? '작성자 이름과 메시지가 청첩장 방문자에게 공개됩니다.' : '공유 방명록 연결을 준비 중입니다.'}</p>
      {loading && <p role="status" className="guestbook__note">축하 메시지를 불러오는 중입니다.</p>}
      {loadError && <button type="button" className="invitation__button" onClick={() => {
        setLoadError(false)
        setLoading(true)
        setLoadAttempt(attempt => attempt + 1)
      }}>메시지 다시 불러오기</button>}
      <form className="guestbook__form" onSubmit={submitMessage}>
        <div hidden><input name="website" tabIndex={-1} autoComplete="off" aria-label="웹사이트" /></div>
        <label>이름<input name="name" required maxLength={40} autoComplete="name" /></label>
        <label>삭제용 비밀번호 (8자 이상)<input name="password" type="password" required minLength={8} maxLength={80} autoComplete="new-password" /></label>
        <label>메시지<textarea name="message" required maxLength={500} rows={4} /></label>
        <button className="invitation__button" disabled={!apiUrl || loading || loadError || pending}>축하 메시지 남기기</button>
      </form>
      <p role="status" className="guestbook__note">{feedback}</p>
      <ul className="guestbook__messages">
        {messages.map(entry => (
          <li key={entry.id}>
            <strong>{entry.name}</strong>
            <p>{entry.message}</p>
            {deleteId === entry.id ? (
              <form className="guestbook__form" onSubmit={event => deleteMessage(event, entry)}>
                <label>삭제용 비밀번호<input name="deletePassword" type="password" required maxLength={80} /></label>
                <button className="invitation__button" disabled={pending}>메시지 삭제</button>
                <button type="button" className="invitation__button" onClick={() => setDeleteId(undefined)}>취소</button>
              </form>
            ) : <button type="button" className="guestbook__delete" onClick={() => { setDeleteId(entry.id); setFeedback('') }}>삭제</button>}
          </li>
        ))}
      </ul>
    </section>
  )
}

function WeddingCalendar({ date }: { date: string }) {
  const [year, month, weddingDay] = date.split('-').map(Number)
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay()
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
  const weekCount = Math.ceil((firstWeekday + daysInMonth) / weekdays.length)

  return (
    <table className="wedding-calendar">
      <caption>{year}년 {month}월</caption>
      <thead>
        <tr>{weekdays.map(day => <th key={day} scope="col">{day}</th>)}</tr>
      </thead>
      <tbody>
        {Array.from({ length: weekCount }, (_, week) => (
          <tr key={week}>
            {weekdays.map((weekday, column) => {
              const day = week * weekdays.length + column - firstWeekday + 1
              if (day < 1 || day > daysInMonth) return <td key={weekday} />

              return (
                <td key={weekday}>
                  {day === weddingDay ? (
                    <time className="wedding-calendar__selected" dateTime={date} aria-label={`${day}일, 결혼식`}>
                      {day}
                    </time>
                  ) : day}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function App() {
  return (
    <main className="invitation">
      <div className="invitation__glass">
        <span className="invitation__ornament" aria-hidden="true">✦</span>
        <h1 className="invitation__names">
          <span>{invitation.groom}</span>
          <span className="invitation__heart" aria-hidden="true">♥</span>
          <span>{invitation.bride}</span>
        </h1>
        <img className="invitation__photo" src={weddingPhoto} alt="밝은 예식장으로 함께 걸어가는 커플의 웨딩 샘플 사진" />
        <p className="invitation__message">
          저희 두 사람의 결혼식에 초대합니다.
        </p>
        <div className="invitation__details">
          <time dateTime={invitation.date}>{invitation.dateLabel}</time>
          <p>{invitation.venue}</p>
        </div>
        <WeddingCalendar date={invitation.date} />
        <Countdown date={invitation.date} />
        <section className="invitation__section" aria-labelledby="gallery-title">
          <div className="invitation__photo-strip">
            {gallery.slice(0, 3).map(photo => <img key={photo.src} {...photo} loading="lazy" />)}
          </div>
          <h2 id="gallery-title" lang="en">GALLERY</h2>
          <details className="invitation__album">
            <summary className="invitation__button">갤러리 더보기</summary>
            <div className="invitation__album-grid">
              {gallery.map(photo => <a key={photo.src} href={photo.src}><img {...photo} loading="lazy" /></a>)}
            </div>
          </details>
        </section>
        <section className="invitation__section" aria-labelledby="invitation-title">
          <h2 id="invitation-title" lang="en">WEDDING INVITATION</h2>
          <p className="invitation__letter">
            <span>오랜 시간 서로의 곁을 지켜온 두 사람이</span>
            <span>이제 같은 곳을 바라보며 평생을 약속합니다.</span>
            <span>저희의 새로운 시작을 함께 축복해 주세요.</span>
          </p>
          <div className="invitation__couple">
            <span><small lang="en">GROOM</small>{invitation.groom}</span>
            <span className="invitation__heart" aria-hidden="true">♥</span>
            <span><small lang="en">BRIDE</small>{invitation.bride}</span>
          </div>
          <img className="invitation__photo" src={portraitPhoto} alt="손을 잡고 걷는 커플의 웨딩 샘플 사진" loading="lazy" />
          <div className="invitation__details invitation__details--bottom">
            <time dateTime={invitation.date}>{invitation.dateLabel}</time>
            <p>{invitation.venue}</p>
          </div>
        </section>
        <Guestbook />
      </div>
    </main>
  )
}

export default App
