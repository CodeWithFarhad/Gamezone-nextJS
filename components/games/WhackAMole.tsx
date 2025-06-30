import React, { useEffect, useRef, useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const GRID_SIZE = 3
const GAME_TIME = 30 // seconds
const MOLE_SHOW_TIME = 700 // ms

function getRandomCell() {
  return Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE))
}

export default function WhackAMole() {
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(GAME_TIME)
  const [mole, setMole] = useState<number | null>(null)
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const moleRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!running) return
    timerRef.current = setInterval(() => {
      setTime(t => {
        if (t <= 1) {
          setGameOver(true)
          setRunning(false)
          setStarted(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [running])

  useEffect(() => {
    if (!running) return
    function showMole() {
      setMole(getRandomCell())
      moleRef.current = setTimeout(() => {
        setMole(null)
        moleRef.current = setTimeout(showMole, 400)
      }, MOLE_SHOW_TIME)
    }
    showMole()
    return () => moleRef.current && clearTimeout(moleRef.current)
  }, [running])

  const whack = (idx: number) => {
    if (mole === idx && running) {
      setScore(s => s + 1)
      setMole(null)
    }
  }

  const start = () => {
    setScore(0)
    setTime(GAME_TIME)
    setGameOver(false)
    setRunning(true)
    setStarted(true)
  }

  const restart = () => {
    setScore(0)
    setTime(GAME_TIME)
    setGameOver(false)
    setRunning(false)
    setStarted(false)
    setMole(null)
  }

  return (
    <GameUIWrapper
      title="Whack-a-Mole"
      score={score}
      started={started}
      gameOver={gameOver}
      onRestart={restart}
      onStart={start}
      instructions="Click the mole as fast as you can! Click or Press Space to Start."
      aspectRatio="1/1"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="mb-4 flex space-x-8 text-lg font-semibold">
          <span>Score: {score}</span>
          <span>Time: {time}s</span>
        </div>
        <div className="grid grid-cols-3 gap-4 w-full h-full max-w-full max-h-full" style={{ aspectRatio: '1/1' }}>
          {Array(GRID_SIZE * GRID_SIZE).fill(0).map((_, idx) => (
            <button
              key={idx}
              className={`w-full h-full aspect-square rounded-full flex items-center justify-center bg-gradient-to-b from-gray-700 to-gray-800 border-4 border-gray-600 relative transition-all duration-100 ${mole === idx ? 'ring-4 ring-purple-400' : ''}`}
              onClick={() => whack(idx)}
              disabled={!running}
            >
              {mole === idx && (
                <span className="text-5xl select-none">🐹</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </GameUIWrapper>
  )
} 