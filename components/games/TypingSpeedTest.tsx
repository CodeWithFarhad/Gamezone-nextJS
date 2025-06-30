import React, { useEffect, useRef, useState } from "react"
import GameUIWrapper from "./GameUIWrapper"

const PARAGRAPHS = [
  "The quick brown fox jumps over the lazy dog. React makes it painless to create interactive UIs. Typing speed tests are fun and challenging. Practice makes perfect in programming. GameZone offers premium interactive experiences. The rain in Spain stays mainly in the plain. She sells seashells by the seashore. How much wood would a woodchuck chuck if a woodchuck could chuck wood?", 
  "In the world of web development, responsiveness and performance are key. Modern frameworks like React and Next.js enable developers to build fast, scalable, and beautiful applications. Typing speed is a valuable skill for programmers, writers, and anyone who spends time at a keyboard. Challenge yourself to improve your speed and accuracy every day.",
  "Artificial intelligence is transforming the way we interact with technology. From smart assistants to self-driving cars, AI is everywhere. The future will be shaped by those who can adapt and learn new skills. Keep practicing, keep learning, and never stop improving."
]

function getRandomParagraph() {
  return PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)]
}

export default function TypingSpeedTest() {
  const [paragraph, setParagraph] = useState(getRandomParagraph())
  const [input, setInput] = useState("")
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [started, setStarted] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (input.length === 1 && !startTime && started) setStartTime(Date.now())
    if (input === paragraph) {
      setEndTime(Date.now())
      setFinished(true)
    }
  }, [input, paragraph, startTime, started])

  const restart = () => {
    setParagraph(getRandomParagraph())
    setInput("")
    setStartTime(null)
    setEndTime(null)
    setFinished(false)
    setStarted(false)
    inputRef.current?.focus()
  }

  const getWPM = () => {
    if (!startTime || !endTime) return 0
    const minutes = (endTime - startTime) / 60000
    return Math.round(paragraph.split(" ").length / minutes)
  }

  const getAccuracy = () => {
    let correct = 0
    for (let i = 0; i < input.length; i++) {
      if (input[i] === paragraph[i]) correct++
    }
    return Math.round((correct / paragraph.length) * 100)
  }

  return (
    <GameUIWrapper
      title="Typing Speed Test"
      score={finished ? getWPM() : undefined}
      started={started}
      gameOver={finished}
      onRestart={restart}
      onStart={() => setStarted(true)}
      instructions="Type the paragraph as fast and accurately as you can. Click or Press Space to Start."
      aspectRatio="3/4"
    >
      <div className="bg-gray-900/80 rounded-xl p-4 sm:p-8 shadow-lg flex flex-col items-center w-full h-full max-w-2xl">
        <div className="mb-6 text-base sm:text-lg text-purple-300 text-center select-none break-words w-full">
          {paragraph.split("").map((char, idx) => (
            <span
              key={idx}
              className={
                input[idx] === undefined
                  ? ""
                  : input[idx] === char
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {char}
            </span>
          ))}
        </div>
        <textarea
          ref={inputRef}
          className="w-full h-32 sm:h-40 px-4 py-3 rounded-lg bg-gray-800 text-base sm:text-lg text-white border-2 border-purple-700 focus:outline-none focus:border-purple-400 mb-6 resize-none"
          value={input}
          onChange={e => {
            if (!finished && started) setInput(e.target.value)
          }}
          disabled={finished || !started}
          autoFocus
        />
        {!finished ? (
          <div className="text-gray-300">Type the paragraph above as fast and accurately as you can.</div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-2xl font-bold mb-2">Results</div>
            <div className="mb-1">WPM: <span className="font-semibold">{getWPM()}</span></div>
            <div className="mb-4">Accuracy: <span className="font-semibold">{getAccuracy()}%</span></div>
            <button
              className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
              onClick={restart}
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </GameUIWrapper>
  )
} 