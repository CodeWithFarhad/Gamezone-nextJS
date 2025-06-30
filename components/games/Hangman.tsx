import React, { useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const WORDS = [
  "REACT", "JAVASCRIPT", "PYTHON", "COMPUTER", "GAMING", "HANGMAN", "PROGRAM", "COMPONENT", "DEVELOPER", "ALGORITHM"
]

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

const MAX_WRONG = 6

const HANGMAN_PICS = [
  "",
  "O",
  "O\n|",
  "O\n/|",
  "O\n/|\\",
  "O\n/|\\\n/",
  "O\n/|\\\n/ \""
]

export default function Hangman() {
  const [word, setWord] = useState(getRandomWord())
  const [guessed, setGuessed] = useState<string[]>([])
  const [wrong, setWrong] = useState(0)
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing")
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(0)

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const handleGuess = (letter: string) => {
    if (guessed.includes(letter) || status !== "playing" || !started) return
    setGuessed([...guessed, letter])
    if (!word.includes(letter)) {
      const newWrong = wrong + 1
      setWrong(newWrong)
      if (newWrong >= MAX_WRONG) setStatus("lost")
    } else {
      const allGuessed = word.split("").every(l => guessed.includes(l) || l === letter)
      if (allGuessed) {
        setStatus("won")
        setScore(s => s + 1)
      }
    }
  }

  const reset = () => {
    setWord(getRandomWord())
    setGuessed([])
    setWrong(0)
    setStatus("playing")
    setStarted(false)
  }

  return (
    <GameUIWrapper
      title="Hangman"
      score={score}
      started={started}
      gameOver={status !== "playing"}
      onRestart={reset}
      onStart={() => setStarted(true)}
      instructions="Guess the word by clicking letters. Click or Press Space to Start."
      aspectRatio="4/3"
    >
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full h-full p-4 md:p-8 max-w-3xl mx-auto">
        <pre className="text-5xl font-mono text-center whitespace-pre leading-tight select-none flex-1">
          {HANGMAN_PICS[wrong]}
        </pre>
        <div className="flex flex-col items-center flex-1 w-full px-2 md:px-6">
          <div className="flex flex-wrap justify-center mb-6 text-3xl font-mono tracking-widest w-full">
            {word.split("").map((l, i) => (
              <span key={i} className="border-b-2 border-purple-400 w-8 text-center mx-1">
                {guessed.includes(l) || status !== "playing" ? l : ""}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-2 mb-4 w-full max-w-xl mx-auto">
            {letters.map(l => (
              <button
                key={l}
                className={`rounded bg-purple-700 px-3 py-2 font-bold text-lg transition border-2 border-transparent ${guessed.includes(l) || status !== "playing" || !started ? "opacity-40 cursor-not-allowed" : "hover:bg-purple-800"}`}
                onClick={() => handleGuess(l)}
                disabled={guessed.includes(l) || status !== "playing" || !started}
              >
                {l}
              </button>
            ))}
          </div>
          <div className="text-lg mb-2">Wrong guesses: {wrong} / {MAX_WRONG}</div>
          {status !== "playing" && started && (
            <div className="mt-4 text-2xl font-bold">
              {status === "won" ? "You Won! 🎉" : `You Lost! The word was ${word}`}
            </div>
          )}
          <button
            className="mt-4 px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
            onClick={reset}
          >
            Play Again
          </button>
        </div>
      </div>
    </GameUIWrapper>
  )
} 