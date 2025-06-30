import React, { useState, useEffect } from "react"
import GameUIWrapper from "./GameUIWrapper"

const QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris", "Madrid"],
    answer: 2,
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 1,
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Jane Austen"],
    answer: 1,
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    answer: 3,
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Silver", "Iron"],
    answer: 1,
  },
  // More questions
  {
    question: "What is the smallest prime number?",
    options: ["0", "1", "2", "3"],
    answer: 2,
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "Japan", "Thailand", "South Korea"],
    answer: 1,
  },
  {
    question: "What is the hardest natural substance?",
    options: ["Gold", "Iron", "Diamond", "Silver"],
    answer: 2,
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Vincent Van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
    answer: 2,
  },
  {
    question: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    answer: 2,
  },
  {
    question: "What is the largest mammal?",
    options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
    answer: 1,
  },
  {
    question: "Which language is used to style web pages?",
    options: ["HTML", "JQuery", "CSS", "XML"],
    answer: 2,
  },
  {
    question: "What is the boiling point of water?",
    options: ["90°C", "100°C", "110°C", "120°C"],
    answer: 1,
  },
  {
    question: "Who discovered gravity?",
    options: ["Albert Einstein", "Isaac Newton", "Galileo Galilei", "Nikola Tesla"],
    answer: 1,
  },
  {
    question: "Which continent is the Sahara Desert located on?",
    options: ["Asia", "Africa", "Australia", "Europe"],
    answer: 1,
  },
]

function shuffleArray<T>(array: T[]): T[] {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)
}

export default function QuizGame() {
  const [questions, setQuestions] = useState(() => shuffleArray(QUESTIONS))
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    setQuestions(shuffleArray(QUESTIONS))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setShowResult(false)
  }, [])

  const handleOption = (idx: number) => {
    setSelected(idx)
    if (idx === questions[current].answer) {
      setScore(score + 1)
    }
    setTimeout(() => {
      if (current + 1 < questions.length) {
        setCurrent(current + 1)
        setSelected(null)
      } else {
        setShowResult(true)
      }
    }, 900)
  }

  const reset = () => {
    setQuestions(shuffleArray(QUESTIONS))
    setCurrent(0)
    setSelected(null)
    setScore(0)
    setShowResult(false)
  }

  return (
    <GameUIWrapper
      title="Quiz Game"
      score={score}
      started={!showResult}
      gameOver={showResult}
      onRestart={reset}
      onStart={reset}
      instructions="Answer the questions. A new quiz appears every refresh!"
      aspectRatio="3/4"
    >
      {!showResult ? (
        <div className="w-full h-full max-w-xl bg-gray-900/70 rounded-xl p-4 sm:p-8 shadow-lg flex flex-col items-center justify-center">
          <div className="text-lg font-semibold mb-4">Question {current + 1} of {questions.length}</div>
          <div className="text-2xl font-bold mb-6 text-center">{questions[current].question}</div>
          <div className="grid grid-cols-1 gap-4 w-full">
            {questions[current].options.map((opt, idx) => (
              <button
                key={idx}
                className={`w-full px-6 py-3 rounded-lg text-lg font-semibold border-2 transition focus:outline-none
                  ${selected === null ? "bg-purple-700 border-purple-700 hover:bg-purple-800" :
                    idx === questions[current].answer ? "bg-green-600 border-green-600" :
                    selected === idx ? "bg-red-600 border-red-600" : "bg-gray-700 border-gray-700 opacity-60"}
                `}
                onClick={() => handleOption(idx)}
                disabled={selected !== null}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-full max-w-xl bg-gray-900/70 rounded-xl p-4 sm:p-8 shadow-lg flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-4">Quiz Complete!</div>
          <div className="text-lg mb-6">Your Score: <span className="font-bold">{score} / {questions.length}</span></div>
          <button
            className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition"
            onClick={reset}
          >
            Play Again
          </button>
        </div>
      )}
    </GameUIWrapper>
  )
} 