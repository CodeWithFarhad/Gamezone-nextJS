import React, { useEffect, useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const SIZE = 4
const START_TILES = 2

function getEmptyBoard() {
  return Array(SIZE)
    .fill(0)
    .map(() => Array(SIZE).fill(0))
}

function getRandomEmptyCell(board: number[][]) {
  const empty: [number, number][] = []
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) empty.push([r, c])
    }
  }
  if (empty.length === 0) return null
  return empty[Math.floor(Math.random() * empty.length)]
}

function addRandomTile(board: number[][]) {
  const cell = getRandomEmptyCell(board)
  if (!cell) return board
  const [r, c] = cell
  board[r][c] = Math.random() < 0.9 ? 2 : 4
  return board
}

function clone(board: number[][]) {
  return board.map(row => [...row])
}

function canMove(board: number[][]) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] === 0) return true
      if (c < SIZE - 1 && board[r][c] === board[r][c + 1]) return true
      if (r < SIZE - 1 && board[r][c] === board[r + 1][c]) return true
    }
  }
  return false
}

function move(board: number[][], dir: string) {
  let moved = false
  let score = 0
  let newBoard = clone(board)
  function slide(row: number[]) {
    let arr = row.filter(x => x)
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2
        score += arr[i]
        arr[i + 1] = 0
      }
    }
    arr = arr.filter(x => x)
    while (arr.length < SIZE) arr.push(0)
    return arr
  }
  if (dir === "left") {
    for (let r = 0; r < SIZE; r++) {
      const newRow = slide(newBoard[r])
      if (newRow.join() !== newBoard[r].join()) moved = true
      newBoard[r] = newRow
    }
  } else if (dir === "right") {
    for (let r = 0; r < SIZE; r++) {
      const rev = [...newBoard[r]].reverse()
      const newRow = slide(rev).reverse()
      if (newRow.join() !== newBoard[r].join()) moved = true
      newBoard[r] = newRow
    }
  } else if (dir === "up") {
    for (let c = 0; c < SIZE; c++) {
      const col = newBoard.map(row => row[c])
      const newCol = slide(col)
      for (let r = 0; r < SIZE; r++) {
        if (newBoard[r][c] !== newCol[r]) moved = true
        newBoard[r][c] = newCol[r]
      }
    }
  } else if (dir === "down") {
    for (let c = 0; c < SIZE; c++) {
      const col = newBoard.map(row => row[c]).reverse()
      const newCol = slide(col).reverse()
      for (let r = 0; r < SIZE; r++) {
        if (newBoard[r][c] !== newCol[r]) moved = true
        newBoard[r][c] = newCol[r]
      }
    }
  }
  return { board: newBoard, moved, score }
}

const COLORS: Record<number, string> = {
  0: "bg-gray-800 border-gray-700",
  2: "bg-purple-200 text-purple-900 border-purple-300",
  4: "bg-purple-300 text-purple-900 border-purple-400",
  8: "bg-purple-400 text-white border-purple-500",
  16: "bg-purple-500 text-white border-purple-600",
  32: "bg-purple-600 text-white border-purple-700",
  64: "bg-purple-700 text-white border-purple-800",
  128: "bg-indigo-400 text-white border-indigo-500",
  256: "bg-indigo-500 text-white border-indigo-600",
  512: "bg-indigo-600 text-white border-indigo-700",
  1024: "bg-indigo-700 text-white border-indigo-800",
  2048: "bg-yellow-400 text-yellow-900 border-yellow-500",
}

export default function Game2048() {
  const [board, setBoard] = useState(() => {
    let b = getEmptyBoard()
    for (let i = 0; i < START_TILES; i++) b = addRandomTile(b)
    return b
  })
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (gameOver) return
      let dir = null
      if (e.key === "ArrowLeft") dir = "left"
      if (e.key === "ArrowRight") dir = "right"
      if (e.key === "ArrowUp") dir = "up"
      if (e.key === "ArrowDown") dir = "down"
      if (!dir) return
      e.preventDefault()
      const { board: newBoard, moved, score: addScore } = move(board, dir)
      if (moved) {
        setBoard(addRandomTile(newBoard))
        setScore(s => s + addScore)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [board, gameOver])

  useEffect(() => {
    if (!canMove(board)) setGameOver(true)
    if (board.flat().includes(2048)) setWon(true)
  }, [board])

  const restart = () => {
    let b = getEmptyBoard()
    for (let i = 0; i < START_TILES; i++) b = addRandomTile(b)
    setBoard(b)
    setScore(0)
    setGameOver(false)
    setWon(false)
  }

  return (
    <GameUIWrapper
      title="2048"
      score={score}
      started={!gameOver && !won}
      gameOver={gameOver || won}
      onRestart={restart}
      onStart={() => {}}
      instructions="Use arrow keys to move tiles."
      aspectRatio="1/1"
    >
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="mb-4 text-lg font-semibold">Score: {score}</div>
        <div className="grid grid-cols-4 gap-2 bg-gray-800 p-2 rounded-lg w-full h-full max-w-full max-h-full" style={{ aspectRatio: '1/1' }}>
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={r + "-" + c}
                className={`flex items-center justify-center text-2xl font-bold border-2 rounded-lg transition-all duration-100 ${COLORS[cell] || COLORS[0]} w-full h-full aspect-square`}
              >
                {cell !== 0 ? cell : ""}
              </div>
            ))
          )}
        </div>
        {(gameOver || won) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 rounded-xl z-10">
            <div className="text-3xl font-bold mb-4">{won ? "You Win! 🎉" : "Game Over"}</div>
            <button
              className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
              onClick={restart}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
      <div className="mt-4 text-gray-300 text-center">Use arrow keys to move tiles.</div>
    </GameUIWrapper>
  )
} 