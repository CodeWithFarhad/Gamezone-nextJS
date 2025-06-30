"use client"

import { useState, useEffect, useCallback } from "react"
import { Play, Pause, RotateCcw } from "lucide-react"
import GameUIWrapper from "./GameUIWrapper"

type Position = { x: number; y: number }
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

const BOARD_SIZE = 20
const INITIAL_SNAKE = [{ x: 10, y: 10 }]
const INITIAL_FOOD = { x: 15, y: 15 }

export default function Snake() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>("RIGHT")
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const generateFood = useCallback((): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      }
    } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
    return newFood
  }, [snake])

  const resetGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection("RIGHT")
    setGameOver(false)
    setScore(0)
    setIsPlaying(false)
  }

  const moveSnake = useCallback(() => {
    if (gameOver || !isPlaying) return

    setSnake((currentSnake) => {
      const newSnake = [...currentSnake]
      const head = { ...newSnake[0] }

      switch (direction) {
        case "UP":
          head.y -= 1
          break
        case "DOWN":
          head.y += 1
          break
        case "LEFT":
          head.x -= 1
          break
        case "RIGHT":
          head.x += 1
          break
      }

      // Check wall collision
      if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      // Check self collision
      if (newSnake.some((segment) => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true)
        setIsPlaying(false)
        return currentSnake
      }

      newSnake.unshift(head)

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore((prev) => {
          const newScore = prev + 10
          if (newScore > highScore) {
            setHighScore(newScore)
          }
          return newScore
        })
        setFood(generateFood())
      } else {
        newSnake.pop()
      }

      return newSnake
    })
  }, [direction, food, gameOver, isPlaying, generateFood, highScore])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return

      switch (e.key) {
        case "ArrowUp":
          e.preventDefault()
          setDirection((prev) => (prev !== "DOWN" ? "UP" : prev))
          break
        case "ArrowDown":
          e.preventDefault()
          setDirection((prev) => (prev !== "UP" ? "DOWN" : prev))
          break
        case "ArrowLeft":
          e.preventDefault()
          setDirection((prev) => (prev !== "RIGHT" ? "LEFT" : prev))
          break
        case "ArrowRight":
          e.preventDefault()
          setDirection((prev) => (prev !== "LEFT" ? "RIGHT" : prev))
          break
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isPlaying])

  useEffect(() => {
    const gameInterval = setInterval(moveSnake, 150)
    return () => clearInterval(gameInterval)
  }, [moveSnake])

  const toggleGame = () => {
    if (gameOver) {
      resetGame()
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  return (
    <GameUIWrapper
      title="Snake"
      score={score}
      started={isPlaying}
      gameOver={gameOver}
      onRestart={resetGame}
      onStart={() => setIsPlaying(true)}
      instructions="Use arrow keys to control the snake. Click Start to play."
      aspectRatio="1/1"
    >
      {/* Game Status */}
      <div className="mb-4 w-full flex flex-col sm:flex-row justify-center gap-4">
        <div className="glass-container p-2 flex-1">
          <div className="text-base font-bold text-white">Score</div>
          <div className="text-xl font-bold text-green-400">{score}</div>
          </div>
        <div className="glass-container p-2 flex-1">
          <div className="text-base font-bold text-white">High Score</div>
          <div className="text-xl font-bold text-yellow-400">{highScore}</div>
        </div>
      </div>
      {/* Game Board */}
      <div className="flex-1 flex items-center justify-center w-full h-full">
        <div
          className="grid gap-1 bg-black/30 p-1 rounded-lg w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
            const x = index % BOARD_SIZE
            const y = Math.floor(index / BOARD_SIZE)
            const isSnake = snake.some((segment) => segment.x === x && segment.y === y)
            const isHead = snake[0]?.x === x && snake[0]?.y === y
            const isFood = food.x === x && food.y === y

            return (
              <div
                key={index}
                className={`aspect-square rounded-sm w-full h-full ${
                  isFood ? "bg-red-500" : isHead ? "bg-green-300" : isSnake ? "bg-green-500" : "bg-gray-800/50"
                }`}
              />
            )
          })}
        </div>
      </div>
      {/* Controls */}
      <div className="flex gap-4 justify-center mb-2 mt-4">
        <button
          onClick={toggleGame}
          className="glass-button px-6 py-3 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          {gameOver ? (
            <>
              <RotateCcw className="w-5 h-5 inline mr-2" />
              Play Again
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-5 h-5 inline mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-5 h-5 inline mr-2" />
              Start
            </>
          )}
        </button>
        <button
          onClick={resetGame}
          className="glass-button px-6 py-3 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          Reset
        </button>
      </div>
      {/* Instructions */}
      <p className="text-gray-300 text-sm">Use arrow keys to control the snake</p>
    </GameUIWrapper>
  )
}
