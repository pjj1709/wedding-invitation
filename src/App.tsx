import './App.css'
import weddingPhoto from './assets/wedding-cover.jpg'

const invitation = {
  groom: '박정진',
  bride: '윤수빈',
  date: '2027-04-10',
  dateLabel: '2027.04.10 토요일',
  venue: '평택 JnJ 아트컨벤션웨딩홀 2층 카넬리안노아',
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

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
      </div>
    </main>
  )
}

export default App
