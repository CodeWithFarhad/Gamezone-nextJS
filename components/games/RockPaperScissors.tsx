import React, { useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const choices = [
  { name: "Rock", icon: "✊" },
  { name: "Paper", icon: "✋" },
  { name: "Scissors", icon: "✌️" },
]

function getResult(user: string, computer: string) {
  if (user === computer) return "Draw"
  if (
    (user === "Rock" && computer === "Scissors") ||
    (user === "Paper" && computer === "Rock") ||
    (user === "Scissors" && computer === "Paper")
  ) {
    return "You Win!"
  }
  return "You Lose!"
}

export default function RockPaperScissors() {
  const [userChoice, setUserChoice] = useState<string | null>(null)
  const [computerChoice, setComputerChoice] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const play = (choice: string) => {
    const compChoice = choices[Math.floor(Math.random() * 3)].name
    setUserChoice(choice)
    setComputerChoice(compChoice)
    setResult(getResult(choice, compChoice))
  }

  const reset = () => {
    setUserChoice(null)
    setComputerChoice(null)
    setResult(null)
  }

  return (
    <GameUIWrapper
      title="Rock Paper Scissors"
      score={result === "You Win!" ? 1 : 0}
      started={true}
      gameOver={false}
      onRestart={reset}
      onStart={reset}
      instructions="Choose Rock, Paper, or Scissors."
      aspectRatio="1/1"
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-wrap justify-center gap-6 mb-8 w-full">
          {choices.map((c) => (
            <button
              key={c.name}
              className="bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 transition rounded-full w-24 h-24 sm:w-32 sm:h-32 flex flex-col items-center justify-center text-4xl sm:text-5xl shadow-lg border-4 border-transparent hover:border-purple-300 focus:outline-none"
              onClick={() => play(c.name)}
              disabled={!!result}
            >
              <span>{c.icon}</span>
              <span className="text-base sm:text-lg mt-2 font-semibold">{c.name}</span>
            </button>
          ))}
        </div>
        {result && (
          <div className="flex flex-col items-center mt-6 w-full">
            <div className="flex flex-wrap justify-center gap-12 mb-4 w-full">
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl">{choices.find(c => c.name === userChoice)?.icon}</span>
                <span className="mt-2 text-base sm:text-lg">You</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl sm:text-4xl">{choices.find(c => c.name === computerChoice)?.icon}</span>
                <span className="mt-2 text-base sm:text-lg">Computer</span>
              </div>
            </div>
            <div className="text-xl sm:text-2xl font-bold mb-4">{result}</div>
            <button
              className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
              onClick={reset}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameUIWrapper>
  )
} 