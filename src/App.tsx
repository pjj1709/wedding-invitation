import './App.css'

const invitation = {
  groom: '김도윤',
  bride: '이서연',
  dateTime: '2027-05-22T14:00:00+09:00',
  dateLabel: '2027년 5월 22일 토요일 오후 2시',
  venue: '봄빛 웨딩홀 2층 가든홀',
}

function App() {
  return (
    <main className="invitation">
      <div className="invitation__arch">
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
          <time dateTime={invitation.dateTime}>{invitation.dateLabel}</time>
          <p>{invitation.venue}</p>
        </div>
      </div>
    </main>
  )
}

export default App
