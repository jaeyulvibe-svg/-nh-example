'use client'

import { useState, useEffect } from 'react'

const CLOCKS = [
  { label: '한국', timezone: 'Asia/Seoul' },
  { label: '중국', timezone: 'Asia/Shanghai' },
  { label: '일본', timezone: 'Asia/Tokyo' },
  { label: '미국 (뉴욕)', timezone: 'America/New_York' },
  { label: '멕시코', timezone: 'America/Mexico_City' },
]

function formatTime(date: Date, timezone: string) {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: timezone,
  })
}

export default function WorldClockBar() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())
    const id = setInterval(() => setNow(new Date()), 1_000)
    return () => clearInterval(id)
  }, [])

  if (!now) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-8 bg-white/80 px-6 py-2 shadow-sm backdrop-blur dark:bg-zinc-800/80">
      {CLOCKS.map(({ label, timezone }) => (
        <div key={timezone} className="flex flex-col items-center">
          <span className="font-mono text-lg font-semibold tabular-nums text-zinc-800 dark:text-zinc-100">
            {formatTime(now, timezone)}
          </span>
          <span className="text-xs text-zinc-500">{label}</span>
        </div>
      ))}
    </div>
  )
}
