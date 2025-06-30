"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Play, RotateCcw, Home } from "lucide-react"
import dynamic from "next/dynamic"
import { useRef } from "react"

const gameComponents: Record<string, any> = {
  "tic-tac-toe": dynamic(() => import("@/components/games/TicTacToe"), { ssr: false }),
  "snake": dynamic(() => import("@/components/games/Snake"), { ssr: false }),
  "memory-cards": dynamic(() => import("@/components/games/MemoryCards"), { ssr: false }),
  // The following will be created:
  "rock-paper-scissors": dynamic(() => import("@/components/games/RockPaperScissors"), { ssr: false }),
  "hangman": dynamic(() => import("@/components/games/Hangman"), { ssr: false }),
  "quiz-game": dynamic(() => import("@/components/games/QuizGame"), { ssr: false }),
  "flappy-bird": dynamic(() => import("@/components/games/FlappyBird"), { ssr: false }),
  "2048": dynamic(() => import("@/components/games/Game2048"), { ssr: false }),
  "pong": dynamic(() => import("@/components/games/Pong"), { ssr: false }),
  "whack-a-mole": dynamic(() => import("@/components/games/WhackAMole"), { ssr: false }),
  "typing-speed-test": dynamic(() => import("@/components/games/TypingSpeedTest"), { ssr: false }),
  "word-scramble": dynamic(() => import("@/components/games/WordScramble"), { ssr: false }),
}

const gameData = {
  "tic-tac-toe": {
    title: "Tic-Tac-Toe",
    description: "A strategic game for two players. Align three Xs or Os to win.",
    instructions:
      "Click a cell to place your symbol. The first player to align three symbols horizontally, vertically, or diagonally wins the game.",
    controls: [
      "Click on empty cells to place your symbol",
      "Take turns with your opponent",
      "First to get three in a row wins",
    ],
  },
  "snake": {
    title: "Snake",
    description: "Guide the snake to eat food and grow. Avoid hitting the walls or yourself!",
    instructions: "Use arrow keys to control the snake. Eat food to grow longer. Don't crash!",
    controls: [
      "Arrow keys to move",
      "Eat food to grow",
      "Avoid walls and yourself",
    ],
  },
  "memory-cards": {
    title: "Memory Cards",
    description: "Test your memory by matching pairs of cards.",
    instructions: "Flip two cards at a time to find matching pairs. Match all pairs to win.",
    controls: [
      "Click cards to flip",
      "Find all matching pairs",
    ],
  },
  "rock-paper-scissors": {
    title: "Rock Paper Scissors",
    description: "Classic hand game. Outsmart your opponent!",
    instructions: "Choose rock, paper, or scissors. Rock beats scissors, scissors beats paper, paper beats rock.",
    controls: [
      "Click to select your move",
      "See if you win, lose, or draw",
    ],
  },
  "hangman": {
    title: "Hangman",
    description: "Guess the word before the hangman is complete!",
    instructions: "Guess letters to reveal the word. Too many wrong guesses and you lose.",
    controls: [
      "Click or type letters to guess",
      "Guess the word before the hangman is drawn",
    ],
  },
  "quiz-game": {
    title: "Quiz Game",
    description: "Test your knowledge with fun questions!",
    instructions: "Answer multiple-choice questions. Try to get the highest score!",
    controls: [
      "Click to select your answer",
      "See your score at the end",
    ],
  },
  "flappy-bird": {
    title: "Flappy Bird",
    description: "Guide the bird through pipes. How far can you go?",
    instructions: "Click or press space to flap. Avoid hitting the pipes.",
    controls: [
      "Click or press space to flap",
      "Avoid pipes",
    ],
  },
  "2048": {
    title: "2048",
    description: "Combine tiles to reach 2048!",
    instructions: "Use arrow keys to move tiles. Combine same numbers to add up to 2048.",
    controls: [
      "Arrow keys to move tiles",
      "Combine tiles to reach 2048",
    ],
  },
  "pong": {
    title: "Pong",
    description: "Classic table tennis arcade game.",
    instructions: "Control your paddle to hit the ball past your opponent.",
    controls: [
      "Use arrow keys or mouse to move paddle",
      "Score points by getting the ball past your opponent",
    ],
  },
  "whack-a-mole": {
    title: "Whack-a-Mole",
    description: "Hit as many moles as you can before time runs out!",
    instructions: "Click on moles as they pop up. Score as many points as possible.",
    controls: [
      "Click moles to whack them",
      "Score as many as you can before time runs out",
    ],
  },
  "typing-speed-test": {
    title: "Typing Speed Test",
    description: "Test how fast you can type!",
    instructions: "Type the displayed text as quickly and accurately as possible.",
    controls: [
      "Type the text shown",
      "See your speed and accuracy",
    ],
  },
  "word-scramble": {
    title: "Word Scramble",
    description: "Unscramble the letters to form the correct word!",
    instructions: "Rearrange the letters to guess the word.",
    controls: [
      "Drag or click letters to rearrange",
      "Guess the correct word",
    ],
  },
}

export default function GamePage() {
  const params = useParams()
  const slug = params.slug as string
  const game = gameData[slug as keyof typeof gameData]
  const GameComponent = gameComponents[slug]
  const gameAreaRef = useRef<HTMLDivElement>(null)

  const handleStartGame = () => {
    if (gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://m.media-amazon.com/images/I/812Zzeb+4cL.jpg"
          alt="Game background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 animate-bg-pan"
          draggable="false"
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="glass-container-simple p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Game Not Found</h1>
            <Link href="/" className="glass-button-simple inline-block px-6 py-3 text-white font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background image */}
      <img
        src="https://m.media-amazon.com/images/I/812Zzeb+4cL.jpg"
        alt="Game background"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-60 animate-bg-pan"
        draggable="false"
      />
      <div className="relative z-10">
        {/* Header - Simple Glass */}
        <header className="p-6">
          <div className="glass-container-simple max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/" className="glass-button-simple p-3">
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-white">{game.title}</h1>
            <Link href="/" className="glass-button-simple p-3">
              <Home className="w-6 h-6 text-white" />
            </Link>
          </div>
        </header>

        {/* Game Content */}
        <main className="px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="glass-container-simple p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">{game.title}</h2>
              <p className="text-gray-200 text-lg mb-6">{game.description}</p>

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">How to Play</h3>
                <p className="text-gray-300 mb-4">{game.instructions}</p>
                <ul className="space-y-2">
                  {game.controls.map((control, index) => (
                    <li key={index} className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-3"></span>
                      {control}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  className="glass-button-simple px-8 py-4 text-white font-semibold flex items-center space-x-2"
                  onClick={handleStartGame}
                >
                  <Play className="w-5 h-5" />
                  <span>Start Game</span>
                </button>
                <button className="glass-button-simple px-6 py-4 text-white font-semibold flex items-center space-x-2">
                  <RotateCcw className="w-5 h-5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Game Area */}
            <div className="glass-container-simple p-8" ref={gameAreaRef}>
              <div className="bg-gray-900/50 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                {GameComponent ? <GameComponent /> : <p className="text-gray-400 text-lg">Game will be implemented here</p>}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
