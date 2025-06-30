"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"
import GameUIWrapper from "./GameUIWrapper"

type Player = "X" | "O" | null

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X")
  const [winner, setWinner] = useState<Player>(null)
  const [gameOver, setGameOver] = useState(false)
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })
  const [aiMode, setAiMode] = useState(false)
  const [winningLine, setWinningLine] = useState<number[] | null>(null)
  const [started, setStarted] = useState(false)

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]

  const checkWinner = (board: Player[]): { winner: Player; line: number[] | null } => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], line: combo }
      }
    }
    return { winner: null, line: null }
  }

  // Minimax AI for TicTacToe
  function minimax(newBoard: Player[], isMaximizing: boolean): { score: number; move: number | null } {
    const { winner } = checkWinner(newBoard)
    if (winner === "O") return { score: 1, move: null }
    if (winner === "X") return { score: -1, move: null }
    if (newBoard.every(cell => cell !== null)) return { score: 0, move: null }

    let bestScore = isMaximizing ? -Infinity : Infinity
    let bestMove: number | null = null
    for (let i = 0; i < 9; i++) {
      if (newBoard[i] === null) {
        newBoard[i] = isMaximizing ? "O" : "X"
        const { score } = minimax(newBoard, !isMaximizing)
        newBoard[i] = null
        if (isMaximizing) {
          if (score > bestScore) {
            bestScore = score
            bestMove = i
          }
        } else {
          if (score < bestScore) {
            bestScore = score
            bestMove = i
          }
        }
      }
    }
    return { score: bestScore, move: bestMove }
  }

  // AI move using minimax
  const aiMove = () => {
    const { move } = minimax([...board], true)
    if (move !== null) {
      handleCellClick(move, true)
    }
  }

  useEffect(() => {
    if (aiMode && currentPlayer === "O" && !gameOver && !winner && started) {
      const timer = setTimeout(aiMove, 500)
      return () => clearTimeout(timer)
    }
  }, [aiMode, currentPlayer, gameOver, winner, board, started])

  const handleCellClick = (index: number, isAI = false) => {
    if (board[index] || gameOver || (aiMode && currentPlayer === "O" && !isAI) || !started) return
    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)
    const { winner: gameWinner, line } = checkWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
      setWinningLine(line)
      setGameOver(true)
      setStarted(false)
      setScores(prev => ({ ...prev, [gameWinner]: prev[gameWinner] + 1 }))
    } else if (newBoard.every(cell => cell !== null)) {
      setGameOver(true)
      setStarted(false)
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X")
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setCurrentPlayer("X")
    setWinner(null)
    setGameOver(false)
    setWinningLine(null)
    setStarted(false)
  }

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 })
    resetGame()
  }

  // SVG grid lines for better visuals
  const renderSVGGrid = () => (
    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
      <line x1="100" y1="0" x2="100" y2="300" stroke="#a78bfa" strokeWidth="6" />
      <line x1="200" y1="0" x2="200" y2="300" stroke="#a78bfa" strokeWidth="6" />
      <line x1="0" y1="100" x2="300" y2="100" stroke="#a78bfa" strokeWidth="6" />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#a78bfa" strokeWidth="6" />
    </svg>
  )

  // Game status message
  let statusMsg = ""
  if (!gameOver) {
    statusMsg = aiMode && currentPlayer === "O" ? "AI's Turn" : `Player ${currentPlayer}'s Turn`
  } else if (winner) {
    statusMsg = aiMode && winner === "O" ? "AI Wins! 🤖" : `Player ${winner} Wins! 🎉`
  } else {
    statusMsg = "It's a Draw! 🤝"
  }

  return (
    <GameUIWrapper
      title="Tic-Tac-Toe"
      score={scores.X + scores.O}
      started={started}
      gameOver={gameOver}
      onRestart={resetGame}
      onStart={() => setStarted(true)}
      instructions="Click or Press Space to Start. Play as X."
      aspectRatio="1/1"
    >
      {/* AI Mode Toggle */}
      <div className="flex justify-center mb-4">
        <button
          className={`px-6 py-2 rounded-l-lg font-semibold border-2 border-purple-500 transition-colors duration-200 ${!aiMode ? "bg-purple-700 text-white" : "bg-gray-800 text-purple-300"}`}
          onClick={() => setAiMode(false)}
          disabled={!started || !aiMode}
        >
          2 Players
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg font-semibold border-2 border-purple-500 border-l-0 transition-colors duration-200 ${aiMode ? "bg-purple-700 text-white" : "bg-gray-800 text-purple-300"}`}
          onClick={() => setAiMode(true)}
          disabled={!started || aiMode}
        >
          Play vs AI
        </button>
      </div>
      {/* Game Status */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-white text-center">{statusMsg}</h3>
      </div>
      {/* Scoreboard */}
      <div className="grid grid-cols-3 gap-4 mb-4 max-w-md mx-auto">
        <div className="glass-container p-2">
          <div className="text-lg font-bold text-blue-400">X</div>
          <div className="text-white">{scores.X}</div>
        </div>
        <div className="glass-container p-2">
          <div className="text-sm font-bold text-gray-400">Draws</div>
          <div className="text-white">{scores.draws}</div>
        </div>
        <div className="glass-container p-2">
          <div className="text-lg font-bold text-red-400">O</div>
          <div className="text-white">{scores.O}</div>
        </div>
      </div>
      {/* Game Board with SVG grid */}
      <div className="relative mx-auto mb-4 w-full max-w-[400px] aspect-square" style={{ minHeight: 260 }}>
        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 300 300">
          <line x1="100" y1="0" x2="100" y2="300" stroke="#a78bfa" strokeWidth="6" />
          <line x1="200" y1="0" x2="200" y2="300" stroke="#a78bfa" strokeWidth="6" />
          <line x1="0" y1="100" x2="300" y2="100" stroke="#a78bfa" strokeWidth="6" />
          <line x1="0" y1="200" x2="300" y2="200" stroke="#a78bfa" strokeWidth="6" />
        </svg>
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0 w-full h-full">
          {board.map((cell, index) => {
            const isWin = winningLine?.includes(index)
            return (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
                className={`flex items-center justify-center text-5xl font-extrabold transition-all duration-300 border-none focus:outline-none w-full h-full ${
                  isWin
                    ? "bg-green-500/80 text-white shadow-lg"
                    : "bg-black/30 hover:bg-white/10"
                }`}
                style={{ borderRadius: 12 }}
                disabled={!!cell || gameOver || !started}
          >
                <span className={cell === "X" ? "text-blue-400" : cell === "O" ? "text-red-400" : ""}>{cell}</span>
          </button>
            )
          })}
        </div>
      </div>
      {/* Controls */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={resetGame}
          className="glass-button px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          <RotateCcw className="w-5 h-5 inline mr-2" />
          New Game
        </button>
        <button
          onClick={resetScores}
          className="glass-button px-4 py-2 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
        >
          Reset Scores
        </button>
      </div>
    </GameUIWrapper>
  )
}

