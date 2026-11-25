import { useEffect, useRef, useState } from 'react'

const venue = {
  name: '평택 JnJ 아트컨벤션웨딩홀',
  address: '경기 평택시 비전5로 20-46',
  latitude: 37.00043994,
  longitude: 127.11535181,
}
const name = encodeURIComponent(venue.name)
const webMap = `https://map.naver.com/p/search/${encodeURIComponent(venue.address)}`
const appName = encodeURIComponent('https://pjj1709.github.io/wedding-invitation/')
const naverNavigation = `nmap://navigation?dlat=${venue.latitude}&dlng=${venue.longitude}&dname=${name}&appname=${appName}`
const tmapNavigation = `tmap://route?rGoName=${name}&rGoX=${venue.longitude}&rGoY=${venue.latitude}`
const naverKey = import.meta.env.VITE_NAVER_MAP_KEY_ID?.trim()
const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY?.trim()

type NaverMaps = {
  LatLng: new (lat: number, lng: number) => object
  Map: new (element: HTMLElement, options: { center: object; zoom: number }) => { destroy: () => void }
  Marker: new (options: { map: object; position: object; title: string }) => object
}
type Kakao = {
  init: (key: string) => void
  isInitialized: () => boolean
  Navi: { start: (options: { name: string; x: number; y: number; coordType: 'wgs84' }) => void }
}

const sdkWindow = globalThis as typeof globalThis & { naver?: { maps: NaverMaps }; Kakao?: Kakao }

export default function Directions() {
  const mapElement = useRef<HTMLDivElement>(null)
  const [mapReady, setMapReady] = useState(false)
  const [kakao, setKakao] = useState<Kakao>()
  const [navigationError, setNavigationError] = useState('')

  useEffect(() => {
    if (!naverKey) return
    const script = document.createElement('script')
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${encodeURIComponent(naverKey)}`
    let map: InstanceType<NaverMaps['Map']> | undefined
    function showMap() {
      const maps = sdkWindow.naver?.maps
      if (!maps?.Map || !mapElement.current) return
      try {
        const center = new maps.LatLng(venue.latitude, venue.longitude)
        map = new maps.Map(mapElement.current, { center, zoom: 16 })
        new maps.Marker({ map, position: center, title: venue.name })
        setMapReady(true)
      } catch {
        setMapReady(false)
      }
    }

    script.addEventListener('load', showMap)
    document.head.append(script)
    return () => {
      script.removeEventListener('load', showMap)
      script.remove()
      map?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!kakaoKey) return
    const key = kakaoKey
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.5/kakao.min.js'
    script.integrity = 'sha384-v6JKY3z4FUkWq21oZDHZe74YvuPk/WUrVLrDHTBojHXClOSa3iXy7sCXPY1jkFbj'
    script.crossOrigin = 'anonymous'
    function initialize() {
      const sdk = sdkWindow.Kakao
      if (!sdk) return
      try {
        if (!sdk.isInitialized()) sdk.init(key)
        setKakao(sdk)
      } catch {
        setNavigationError('카카오내비를 초기화하지 못했습니다.')
      }
    }
    script.addEventListener('load', initialize)
    document.head.append(script)
    return () => {
      script.removeEventListener('load', initialize)
      script.remove()
    }
  }, [])

  function openKakao() {
    if (!kakao) {
      setNavigationError('카카오내비 연결을 사용할 수 없습니다. 다른 앱이나 웹 지도를 이용해 주세요.')
      return
    }
    try {
      kakao.Navi.start({ name: venue.name, x: venue.longitude, y: venue.latitude, coordType: 'wgs84' })
    } catch {
      setNavigationError('카카오내비를 열지 못했습니다. 다른 앱이나 웹 지도를 이용해 주세요.')
    }
  }

  return (
    <section className="invitation__section" aria-labelledby="directions-title">
      <h2 id="directions-title">오시는 길</h2>
      <address className="directions__address">
        {venue.address} (비전동 1101-1)<br />
        <a href="tel:0316535300">TEL. 031-653-5300</a>
      </address>
      {naverKey && <div className="directions__map" data-ready={mapReady} ref={mapElement} role="region" aria-label="예식장 네이버 지도" />}
      <a className="directions__web-map" href={webMap} target="_blank" rel="noreferrer">네이버지도 웹에서 위치 보기</a>
      <nav aria-label="내비게이션 앱">
        <p className="directions__label" lang="en">NAVIGATION</p>
        <div className="directions__buttons">
          <button className="invitation__button" type="button" onClick={openKakao}>카카오내비</button>
          <a className="invitation__button" href={tmapNavigation}>티맵</a>
          <a className="invitation__button" href={naverNavigation}>네이버지도</a>
        </div>
      </nav>
      {navigationError && <p role="status" className="guestbook__note">{navigationError}</p>}
    </section>
  )
}
