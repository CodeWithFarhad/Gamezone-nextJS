import React, { useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const WORDS = [
  "REACT",
  "JAVASCRIPT",
  "PYTHON",
  "COMPONENT",
  "ALGORITHM"
]

function shuffle(word: string) {
  const arr = word.split("")
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr.join("")
}

function getRandomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)]
}

export default function WordScramble() {
  const [word, setWord] = useState(getRandomWord())
  const [scrambled, setScrambled] = useState(() => shuffle(word))
  const [guess, setGuess] = useState("")
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing")
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(0)

  const checkGuess = () => {
    if (guess.toUpperCase() === word) {
      setStatus("won")
      setScore(s => s + 1)
    } else {
      setStatus("lost")
    }
  }

  const restart = () => {
    const newWord = getRandomWord()
    setWord(newWord)
    setScrambled(shuffle(newWord))
    setGuess("")
    setStatus("playing")
    setStarted(false)
  }

  return (
    <GameUIWrapper
      title="Word Scramble"
      score={score}
      started={started}
      gameOver={status !== "playing"}
      onRestart={restart}
      onStart={() => setStarted(true)}
      instructions="Unscramble the word above. Click or Press Space to Start."
      aspectRatio="4/3"
    >
      <div className="bg-gray-900/80 rounded-xl p-4 sm:p-8 shadow-lg flex flex-col items-center w-full h-full max-w-xl relative">
        <div className="mb-6 text-2xl font-mono tracking-widest text-purple-300 select-none break-words w-full text-center">
          {scrambled.split("").join(" ")}
        </div>
        {status === "playing" && started && (
          <>
            <input
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-lg text-white border-2 border-purple-700 focus:outline-none focus:border-purple-400 mb-6 text-center uppercase"
              value={guess}
              onChange={e => setGuess(e.target.value)}
              maxLength={word.length}
              autoFocus
            />
            <button
              className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition mb-2"
              onClick={checkGuess}
            >
              Submit
            </button>
          </>
        )}
        {status !== "playing" && started && (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">
              {status === "won" ? "Correct! 🎉" : `Wrong! The word was ${word}`}
            </div>
            <button
              className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
              onClick={restart}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </GameUIWrapper>
  )
} 