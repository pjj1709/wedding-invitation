import './App.css'

const invitation = {
  groom: '박정진',
  bride: '윤수빈',
  date: '2027-04-10',
  dateLabel: '2027.04.10 토요일',
  venue: '평택 JnJ 아트컨벤션웨딩홀 2층 카넬리안노아',
}

function App() {
  return (
    <main className="invitation">
      <div className="invitation__glass">
        <span className="invitation__ornament" aria-hidden="true">✦</span>
        <h1 className="invitation__names">
          <span>{invitation.groom}</span>
          <span className="invitation__ampersand" aria-label="그리고">&amp;</span>
          <span>{invitation.bride}</span>
        </h1>
        <p className="invitation__message">
          저희 두 사람의 결혼식에 초대합니다.
        </p>
        <div className="invitation__details">
          <time dateTime={invitation.date}>{invitation.dateLabel}</time>
          <p>{invitation.venue}</p>
        </div>
      </div>
    </main>
  )
}

export default App
