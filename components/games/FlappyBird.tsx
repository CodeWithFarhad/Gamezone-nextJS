import React, { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import GameUIWrapper from "./GameUIWrapper"

// Virtual game size (logic coordinates)
const GAME_WIDTH = 400
const GAME_HEIGHT = 600
const BIRD_SIZE = 40
const GRAVITY = 0.5
const FLAP = -9
const PIPE_WIDTH = 80
const PIPE_GAP = 180
const PIPE_SPEED = 2.2
const CLOUDS = [
  { x: 60, y: 60, r: 30 },
  { x: 200, y: 120, r: 40 },
  { x: 350, y: 80, r: 25 },
]

function getRandomPipeY() {
  return Math.floor(Math.random() * (GAME_HEIGHT - PIPE_GAP - 120)) + 60
}

export default function FlappyBird() {
  // State
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2)
  const [velocity, setVelocity] = useState(0)
  const [pipes, setPipes] = useState([
    { x: GAME_WIDTH + 100, y: getRandomPipeY() },
    { x: GAME_WIDTH + 100 + 220, y: getRandomPipeY() },
  ])
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [backgroundOffset, setBackgroundOffset] = useState(0)
  const svgRef = useRef<SVGSVGElement>(null)
  const requestRef = useRef<number | null>(null)

  // Responsive scaling
  const [dimensions, setDimensions] = useState({ width: 400, height: 600 })
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const parent = svgRef.current.parentElement
        if (parent) {
          const w = parent.offsetWidth
          const h = parent.offsetHeight
          // Maintain 2:3 aspect ratio
          let width = w, height = h
          if (w / h > 2 / 3) width = h * 2 / 3
          else height = w * 3 / 2
          setDimensions({ width, height })
        }
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Keep refs in sync for animation
  const birdYRef = useRef(birdY)
  const velocityRef = useRef(velocity)
  const pipesRef = useRef(pipes)
  const gameOverRef = useRef(gameOver)
  const startedRef = useRef(started)
  useEffect(() => { birdYRef.current = birdY }, [birdY])
  useEffect(() => { velocityRef.current = velocity }, [velocity])
  useEffect(() => { pipesRef.current = pipes }, [pipes])
  useEffect(() => { gameOverRef.current = gameOver }, [gameOver])
  useEffect(() => { startedRef.current = started }, [started])

  // Flap handler
  const flap = () => {
    if (!startedRef.current) setStarted(true)
    if (!gameOverRef.current) setVelocity(FLAP)
    if (gameOverRef.current) restart()
  }

  // Main game loop
  useEffect(() => {
    if (!started) return
    const loop = () => {
      setBirdY(prev => {
        const next = prev + velocityRef.current
        if (next < 0) return 0
        if (next > GAME_HEIGHT - BIRD_SIZE) return GAME_HEIGHT - BIRD_SIZE
        return next
      })
      setVelocity(v => v + GRAVITY)
      setBackgroundOffset(prev => (prev + 1) % GAME_WIDTH)
      setPipes(prev => {
        let newPipes = prev.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }))
        // Check for passed pipes and add new
        if (newPipes[0].x < -PIPE_WIDTH) {
          newPipes.shift()
          newPipes.push({ x: GAME_WIDTH, y: getRandomPipeY() })
          setScore(s => s + 1)
          setShowScoreAnimation(true)
          setTimeout(() => setShowScoreAnimation(false), 500)
        }
        return newPipes
      })
      // Collision detection
      const birdBox = { x: 80, y: birdYRef.current, w: BIRD_SIZE, h: BIRD_SIZE }
      for (const pipe of pipesRef.current) {
        if (
          birdBox.x + birdBox.w > pipe.x &&
          birdBox.x < pipe.x + PIPE_WIDTH &&
          (birdBox.y < pipe.y || birdBox.y + birdBox.h > pipe.y + PIPE_GAP)
        ) {
          setGameOver(true)
          return
        }
      }
      // Ground/ceiling
      if (birdYRef.current >= GAME_HEIGHT - BIRD_SIZE || birdYRef.current <= 0) {
        setGameOver(true)
        return
      }
      requestRef.current = requestAnimationFrame(loop)
    }
    requestRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(requestRef.current!)
  }, [started])

  // Score animation effect
  useEffect(() => {
    if (score > 0) {
      setShowScoreAnimation(true)
      const timeout = setTimeout(() => setShowScoreAnimation(false), 500)
      return () => clearTimeout(timeout)
    }
  }, [score])

  // Keyboard controls
  useEffect(() => {
    const onSpace = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault()
        flap()
      }
    }
    window.addEventListener("keydown", onSpace)
    return () => window.removeEventListener("keydown", onSpace)
  }, [])

  const restart = () => {
    setBirdY(GAME_HEIGHT / 2)
    setVelocity(0)
    setPipes([
      { x: GAME_WIDTH + 100, y: getRandomPipeY() },
      { x: GAME_WIDTH + 100 + 220, y: getRandomPipeY() },
    ])
    setScore(0)
    setGameOver(false)
    setStarted(false)
    setBackgroundOffset(0)
  }

  // Bird rotation
  const birdRotation = Math.min(Math.max(velocity * 3, -30), 90)

  return (
    <GameUIWrapper
      title="Flappy Bird"
      score={score}
      started={started}
      gameOver={gameOver}
      onRestart={restart}
      onStart={() => setStarted(true)}
      instructions="Click or Press Space to Start. Tap to flap the bird!"
      aspectRatio="2/3"
    >
      <div
        className="w-full h-full flex items-center justify-center select-none"
        style={{ width: '100%', height: '100%' }}
        tabIndex={0}
        onClick={flap}
        onTouchStart={flap}
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          viewBox={`0 0 ${GAME_WIDTH} ${GAME_HEIGHT}`}
          style={{ display: 'block', background: 'linear-gradient(to bottom, #87CEEB, #E0F6FF)', borderRadius: 24, boxShadow: '0 8px 32px #0008' }}
        >
          {/* Clouds */}
          {CLOUDS.map((cloud, i) => (
            <ellipse
              key={i}
              cx={(cloud.x - backgroundOffset + GAME_WIDTH) % GAME_WIDTH}
              cy={cloud.y}
              rx={cloud.r}
              ry={cloud.r * 0.6}
              fill="#fff"
              opacity={0.7}
            />
          ))}
          {/* Pipes */}
          {pipes.map((pipe, i) => (
            <g key={i}>
              {/* Top pipe */}
              <g>
                {/* Pipe body */}
                <rect
                  x={pipe.x}
                  y={24}
                  width={PIPE_WIDTH}
                  height={pipe.y - 24}
                  fill="url(#pipeBodyGradient)"
                  stroke="#1a3a1a"
                  strokeWidth={4}
                  rx={16}
                />
                {/* Pipe rim (cap) */}
                <rect
                  x={pipe.x - 8}
                  y={0}
                  width={PIPE_WIDTH + 16}
                  height={28}
                  fill="url(#pipeRimGradient)"
                  stroke="#0e1e0e"
                  strokeWidth={4}
                  rx={14}
                />
                {/* Rim shadow/separation */}
                <rect
                  x={pipe.x - 8}
                  y={26}
                  width={PIPE_WIDTH + 16}
                  height={6}
                  fill="#000"
                  opacity={0.18}
                  rx={3}
                />
                {/* Rim shine */}
                <rect
                  x={pipe.x + 8}
                  y={4}
                  width={16}
                  height={20}
                  fill="url(#pipeRimShine)"
                  opacity={0.25}
                  rx={6}
                />
                {/* Body shine */}
                <rect
                  x={pipe.x + 8}
                  y={32}
                  width={10}
                  height={pipe.y - 48 > 0 ? pipe.y - 48 : 0}
                  fill="url(#pipeBodyShine)"
                  opacity={0.18}
                  rx={4}
                />
              </g>
              {/* Bottom pipe */}
              <g>
                {/* Pipe body */}
                <rect
                  x={pipe.x}
                  y={pipe.y + PIPE_GAP}
                  width={PIPE_WIDTH}
                  height={GAME_HEIGHT - (pipe.y + PIPE_GAP) - 24}
                  fill="url(#pipeBodyGradient)"
                  stroke="#1a3a1a"
                  strokeWidth={4}
                  rx={16}
                />
                {/* Pipe rim (cap) */}
                <rect
                  x={pipe.x - 8}
                  y={pipe.y + PIPE_GAP + GAME_HEIGHT - (pipe.y + PIPE_GAP) - 28}
                  width={PIPE_WIDTH + 16}
                  height={28}
                  fill="url(#pipeRimGradient)"
                  stroke="#0e1e0e"
                  strokeWidth={4}
                  rx={14}
                />
                {/* Rim shadow/separation */}
                <rect
                  x={pipe.x - 8}
                  y={pipe.y + PIPE_GAP + GAME_HEIGHT - (pipe.y + PIPE_GAP) - 6}
                  width={PIPE_WIDTH + 16}
                  height={6}
                  fill="#000"
                  opacity={0.18}
                  rx={3}
                />
                {/* Rim shine */}
                <rect
                  x={pipe.x + 8}
                  y={pipe.y + PIPE_GAP + GAME_HEIGHT - (pipe.y + PIPE_GAP) - 24}
                  width={16}
                  height={20}
                  fill="url(#pipeRimShine)"
                  opacity={0.25}
                  rx={6}
                />
                {/* Body shine */}
                <rect
                  x={pipe.x + 8}
                  y={pipe.y + PIPE_GAP + 8}
                  width={10}
                  height={GAME_HEIGHT - (pipe.y + PIPE_GAP) - 32 > 0 ? GAME_HEIGHT - (pipe.y + PIPE_GAP) - 32 : 0}
                  fill="url(#pipeBodyShine)"
                  opacity={0.18}
                  rx={4}
                />
              </g>
            </g>
          ))}
          {/* Bird */}
          <g
            style={{
              transform: `rotate(${birdRotation}deg)`,
              transformOrigin: `${80 + BIRD_SIZE / 2}px ${birdY + BIRD_SIZE / 2}px`,
              transition: 'transform 0.1s',
            }}
          >
            <ellipse
              cx={80 + BIRD_SIZE / 2}
              cy={birdY + BIRD_SIZE / 2}
              rx={BIRD_SIZE / 2}
              ry={BIRD_SIZE / 2}
              fill="#ffe066"
              stroke="#e1b800"
              strokeWidth={4}
            />
            <text
              x={80 + BIRD_SIZE / 2}
              y={birdY + BIRD_SIZE / 2 + 8}
              textAnchor="middle"
              fontSize={BIRD_SIZE * 0.8}
              fontWeight="bold"
              fill="#fff"
              style={{ pointerEvents: 'none' }}
            >
              🐤
            </text>
          </g>
          {/* Score Animation */}
          <AnimatePresence>
            {showScoreAnimation && (
              <motion.text
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.3, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                x={GAME_WIDTH / 2}
                y={60}
                textAnchor="middle"
                fontSize={48}
                fontWeight="bold"
                fill="#ffe066"
                style={{ pointerEvents: 'none' }}
              >
                +1
              </motion.text>
            )}
          </AnimatePresence>
          {/* Pipe Gradients */}
          <defs>
            <linearGradient id="pipeBodyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ee24e" />
              <stop offset="60%" stopColor="#2eb82e" />
              <stop offset="100%" stopColor="#1a7a1a" />
            </linearGradient>
            <linearGradient id="pipeRimGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7fff7f" />
              <stop offset="100%" stopColor="#2eb82e" />
            </linearGradient>
            <linearGradient id="pipeRimShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff0" />
            </linearGradient>
            <linearGradient id="pipeBodyShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="100%" stopColor="#fff0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </GameUIWrapper>
  )
}