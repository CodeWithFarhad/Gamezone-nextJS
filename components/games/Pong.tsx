import React, { useEffect, useRef, useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const GAME_WIDTH = 360
const GAME_HEIGHT = 480
const PADDLE_WIDTH = 12
const PADDLE_HEIGHT = 70
const BALL_SIZE = 16
const PADDLE_SPEED = 6
const BALL_SPEED = 5

export default function Pong() {
  const [leftY, setLeftY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const [rightY, setRightY] = useState(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
  const [ball, setBall] = useState({ x: GAME_WIDTH / 2 - BALL_SIZE / 2, y: GAME_HEIGHT / 2 - BALL_SIZE / 2, vx: BALL_SPEED, vy: BALL_SPEED })
  const [score, setScore] = useState({ left: 0, right: 0 })
  const [running, setRunning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const requestRef = useRef<number>()
  const keys = useRef<{ [k: string]: boolean }>({})

  const reset = () => {
    setLeftY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
    setRightY(GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2)
    setBall({ x: GAME_WIDTH / 2 - BALL_SIZE / 2, y: GAME_HEIGHT / 2 - BALL_SIZE / 2, vx: BALL_SPEED, vy: BALL_SPEED })
    setScore({ left: 0, right: 0 })
    setGameOver(false)
    setRunning(false)
    setStarted(false)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true
      if (!running && ["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
        setRunning(true)
        setStarted(true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false
    }
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [running])

  useEffect(() => {
    if (!running || gameOver) return
    const loop = () => {
      setLeftY(prev => {
        let next = prev
        if (keys.current["w"] || keys.current["ArrowUp"]) next -= PADDLE_SPEED
        if (keys.current["s"] || keys.current["ArrowDown"]) next += PADDLE_SPEED
        return Math.max(0, Math.min(GAME_HEIGHT - PADDLE_HEIGHT, next))
      })
      setBall(prev => {
        let { x, y, vx, vy } = prev
        x += vx
        y += vy
        // Top/bottom collision
        if (y < 0 || y > GAME_HEIGHT - BALL_SIZE) vy = -vy
        // Left paddle collision
        if (
          x < PADDLE_WIDTH &&
          y + BALL_SIZE > leftY &&
          y < leftY + PADDLE_HEIGHT
        ) {
          x = PADDLE_WIDTH
          vx = -vx * 1.05
        }
        // Right paddle collision
        if (
          x + BALL_SIZE > GAME_WIDTH - PADDLE_WIDTH &&
          y + BALL_SIZE > rightY &&
          y < rightY + PADDLE_HEIGHT
        ) {
          x = GAME_WIDTH - PADDLE_WIDTH - BALL_SIZE
          vx = -vx * 1.05
        }
        // Score
        if (x < 0) {
          setScore(s => ({ ...s, right: s.right + 1 }))
          return { x: GAME_WIDTH / 2 - BALL_SIZE / 2, y: GAME_HEIGHT / 2 - BALL_SIZE / 2, vx: BALL_SPEED, vy: BALL_SPEED }
        }
        if (x > GAME_WIDTH - BALL_SIZE) {
          setScore(s => ({ ...s, left: s.left + 1 }))
          return { x: GAME_WIDTH / 2 - BALL_SIZE / 2, y: GAME_HEIGHT / 2 - BALL_SIZE / 2, vx: -BALL_SPEED, vy: BALL_SPEED }
        }
        return { x, y, vx, vy }
      })
      // AI for right paddle
      setRightY(prev => {
        const target = ball.y - PADDLE_HEIGHT / 2 + BALL_SIZE / 2
        if (prev < target) return Math.min(prev + PADDLE_SPEED * 0.85, GAME_HEIGHT - PADDLE_HEIGHT)
        if (prev > target) return Math.max(prev - PADDLE_SPEED * 0.85, 0)
        return prev
      })
      requestRef.current = requestAnimationFrame(loop)
    }
    requestRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [running, gameOver, leftY, rightY, ball])

  useEffect(() => {
    if (score.left >= 5 || score.right >= 5) setGameOver(true)
  }, [score])

  return (
    <GameUIWrapper
      title="Pong"
      score={score.left + score.right}
      started={started}
      gameOver={gameOver}
      onRestart={reset}
      onStart={() => { setRunning(true); setStarted(true); }}
      instructions="W/S or Up/Down to move. First to 5 wins. Press W/S or Up/Down to Start."
      aspectRatio="3/4"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
        className="block mx-auto bg-gradient-to-br from-gray-900 to-indigo-900 rounded-xl shadow-lg"
        style={{ display: 'block', background: 'linear-gradient(135deg, #1e293b, #6366f1)' }}
      >
        {/* Middle line */}
        <line x1={GAME_WIDTH / 2} y1={0} x2={GAME_WIDTH / 2} y2={GAME_HEIGHT} stroke="#fff" strokeDasharray="8 12" strokeWidth={3} opacity={0.3} />
        {/* Left Paddle */}
        <rect x={0} y={leftY} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} rx={6} fill="#a78bfa" />
        {/* Right Paddle */}
        <rect x={GAME_WIDTH - PADDLE_WIDTH} y={rightY} width={PADDLE_WIDTH} height={PADDLE_HEIGHT} rx={6} fill="#818cf8" />
        {/* Ball */}
        <circle cx={ball.x + BALL_SIZE / 2} cy={ball.y + BALL_SIZE / 2} r={BALL_SIZE / 2} fill="#fde047" stroke="#facc15" strokeWidth={3} />
        {/* Score */}
        <text x={GAME_WIDTH / 2 - 40} y={40} fontSize={32} fontWeight="bold" fill="#fff" textAnchor="end">{score.left}</text>
        <text x={GAME_WIDTH / 2 + 40} y={40} fontSize={32} fontWeight="bold" fill="#fff" textAnchor="start">{score.right}</text>
      </svg>
    </GameUIWrapper>
  )
} 