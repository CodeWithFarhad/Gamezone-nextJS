"use client"

import { useState, useEffect } from "react"
import { RotateCcw, Trophy } from "lucide-react"
import GameUIWrapper from "./GameUIWrapper"

type Card = {
  id: number
  value: string
  isFlipped: boolean
  isMatched: boolean
}

const cardValues = ["🎮", "🎯", "🎲", "🎪", "🎨", "🎭", "🎸", "🎺"]

export default function MemoryCards() {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [matches, setMatches] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [bestScore, setBestScore] = useState<number | null>(null)

  const initializeGame = () => {
    const shuffledCards = [...cardValues, ...cardValues]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }))

    setCards(shuffledCards)
    setFlippedCards([])
    setMoves(0)
    setMatches(0)
    setGameWon(false)
  }

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards
      const firstCard = cards.find((card) => card.id === first)
      const secondCard = cards.find((card) => card.id === second)

      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Match found
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isMatched: true } : card)),
          )
          setMatches((prev) => prev + 1)
          setFlippedCards([])
        }, 1000)
      } else {
        // No match
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card) => (card.id === first || card.id === second ? { ...card, isFlipped: false } : card)),
          )
          setFlippedCards([])
        }, 1000)
      }
      setMoves((prev) => prev + 1)
    }
  }, [flippedCards, cards])

  useEffect(() => {
    if (matches === cardValues.length) {
      setGameWon(true)
      if (!bestScore || moves < bestScore) {
        setBestScore(moves)
      }
    }
  }, [matches, moves, bestScore])

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length === 2) return

    const card = cards.find((c) => c.id === cardId)
    if (!card || card.isFlipped || card.isMatched) return

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)))
    setFlippedCards((prev) => [...prev, cardId])
  }

  return (
    <GameUIWrapper
      title="Memory Cards"
      score={matches}
      started={cards.length > 0 && !gameWon}
      gameOver={gameWon}
      onRestart={initializeGame}
      onStart={initializeGame}
      instructions="Find all matching pairs. Click a card to flip."
      aspectRatio="1/1"
    >
      {/* Game Status */}
      <div className="mb-4 w-full flex flex-col sm:flex-row justify-center gap-4">
        <div className="glass-container p-2 flex-1">
          <div className="text-base font-bold text-white">Moves</div>
          <div className="text-xl font-bold text-blue-400">{moves}</div>
          </div>
        <div className="glass-container p-2 flex-1">
          <div className="text-base font-bold text-white">Matches</div>
          <div className="text-xl font-bold text-green-400">{matches}/{cardValues.length}</div>
        </div>
        {bestScore && (
          <div className="glass-container p-2 flex-1">
            <div className="text-base font-bold text-white">Best</div>
            <div className="text-xl font-bold text-yellow-400">{bestScore}</div>
          </div>
        )}
      </div>
      {/* Game Board */}
      <div className="grid grid-cols-4 gap-4 w-full h-full max-w-full max-h-full mb-6" style={{ aspectRatio: '1/1' }}>
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`glass-container aspect-square flex items-center justify-center text-4xl font-bold transition-all duration-300 w-full h-full ${
              card.isFlipped || card.isMatched ? "bg-white/30" : "hover:bg-white/20 cursor-pointer"
            }`}
            disabled={card.isFlipped || card.isMatched || flippedCards.length === 2}
          >
            {card.isFlipped || card.isMatched ? card.value : "?"}
          </button>
        ))}
      </div>
      {/* Controls */}
      <button
        onClick={initializeGame}
        className="glass-button px-6 py-3 text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300"
      >
        <RotateCcw className="w-5 h-5 inline mr-2" />
        New Game
      </button>
      {gameWon && (
        <div className="glass-container p-6 mt-4">
          <h3 className="text-2xl font-bold text-green-400 mb-2">
            <Trophy className="w-8 h-8 inline mr-2" />
            Congratulations! 🎉
          </h3>
          <p className="text-white">You completed the game in {moves} moves!</p>
    </div>
      )}
    </GameUIWrapper>
  )
}
