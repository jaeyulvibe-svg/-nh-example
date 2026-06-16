'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

type Mode = 'work' | 'short' | 'long'

const DURATIONS: Record<Mode, number> = {
  work: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
}

const LABELS: Record<Mode, string> = {
  work: '집중',
  short: '짧은 휴식',
  long: '긴 휴식',
}

const DONE_LABELS: Record<Mode, string> = {
  work: '집중 완료! 휴식하세요',
  short: '짧은 휴식 완료!',
  long: '긴 휴식 완료!',
}

const MODE_COLORS: Record<Mode, { bg: string; ring: string; btn: string; banner: string }> = {
  work: {
    bg: 'bg-rose-50 dark:bg-rose-950',
    ring: 'stroke-rose-500',
    btn: 'bg-rose-500 hover:bg-rose-600',
    banner: 'bg-rose-500 text-white',
  },
  short: {
    bg: 'bg-teal-50 dark:bg-teal-950',
    ring: 'stroke-teal-500',
    btn: 'bg-teal-500 hover:bg-teal-600',
    banner: 'bg-teal-500 text-white',
  },
  long: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    ring: 'stroke-blue-500',
    btn: 'bg-blue-500 hover:bg-blue-600',
    banner: 'bg-blue-500 text-white',
  },
}

function playDoneChime() {
  const ctx = new AudioContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.type = 'sine'
  oscillator.frequency.value = 880
  gain.gain.setValueAtTime(0.4, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6)
  oscillator.start(ctx.currentTime)
  oscillator.stop(ctx.currentTime + 0.6)
  oscillator.onended = () => ctx.close()
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function formatTime(seconds: number) {
  return `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`
}

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work')
  const [seconds, setSeconds] = useState(DURATIONS.work)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = DURATIONS[mode]
  const progress = (total - seconds) / total
  const dashOffset = CIRCUMFERENCE * (1 - progress)
  const colors = MODE_COLORS[mode]

  const reset = useCallback((m: Mode) => {
    setRunning(false)
    setSeconds(DURATIONS[m])
    setDone(false)
  }, [])

  const switchMode = useCallback(
    (m: Mode) => {
      setMode(m)
      reset(m)
    },
    [reset],
  )

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!)
          setRunning(false)
          if (mode === 'work') setSessions((n) => n + 1)
          playDoneChime()
          setDone(true)
          return 0
        }
        return s - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, mode])

  return (
    <div
      className={`relative flex flex-col items-center gap-8 rounded-3xl px-10 py-12 shadow-lg transition-colors ${colors.bg}`}
    >
      {/* Mode tabs */}
      <div className="flex gap-2 rounded-full bg-black/5 p-1 dark:bg-white/5">
        {(Object.keys(LABELS) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-white text-black shadow dark:bg-zinc-800 dark:text-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>

      {/* Circular progress */}
      <div className="relative flex items-center justify-center">
        <svg width="220" height="220" className="-rotate-90">
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-black/5 dark:text-white/5"
          />
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            className={`transition-all duration-1000 ${colors.ring}`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono text-5xl font-bold tabular-nums tracking-tight">
            {formatTime(seconds)}
          </span>
          <span className="mt-1 text-sm text-zinc-500">{LABELS[mode]}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => reset(mode)}
          className="rounded-full p-3 text-zinc-400 transition-colors hover:bg-black/5 hover:text-zinc-600 dark:hover:bg-white/5"
          aria-label="초기화"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <button
          onClick={() => setRunning((r) => !r)}
          className={`rounded-full px-10 py-3 text-lg font-semibold text-white shadow-md transition-colors ${colors.btn}`}
        >
          {running ? '일시정지' : seconds === 0 ? '완료' : '시작'}
        </button>

        <div className="w-10" />
      </div>

      {/* Session count */}
      <div className="flex items-center gap-2 text-sm text-zinc-500">
        <span>완료한 세션</span>
        <div className="flex gap-1">
          {Array.from({ length: Math.max(4, sessions) }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < sessions ? 'bg-rose-400' : 'bg-zinc-200 dark:bg-zinc-700'
              }`}
            />
          ))}
        </div>
        <span className="font-medium text-zinc-700 dark:text-zinc-300">
          {sessions}
        </span>
      </div>

      {done && (
        <div
          className={`absolute inset-x-0 bottom-0 flex items-center justify-between rounded-b-3xl px-6 py-3 ${colors.banner}`}
        >
          <span className="text-sm font-semibold">{DONE_LABELS[mode]}</span>
          <button
            onClick={() => setDone(false)}
            aria-label="닫기"
            className="text-white/80 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
