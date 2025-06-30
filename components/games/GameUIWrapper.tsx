import React, { useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface GameUIWrapperProps {
  title: string
  score?: number
  started: boolean
  gameOver: boolean
  onRestart: () => void
  onStart: () => void
  children: React.ReactNode
  instructions?: string
  gameWidth?: number
  gameHeight?: number
  aspectRatio?: string
}

export default function GameUIWrapper({
  title,
  score = 0,
  started,
  gameOver,
  onRestart,
  onStart,
  children,
  instructions = "Click or Press Space to Start",
  gameWidth,
  gameHeight,
  aspectRatio,
}: GameUIWrapperProps) {
  // Responsive style: use custom size if provided, else fill available space
  const style = gameWidth && gameHeight
    ? { width: gameWidth, height: gameHeight, maxWidth: '95vw', maxHeight: '90vh' }
    : { width: '100%', height: '100%', maxWidth: '95vw', maxHeight: '90vh', aspectRatio: aspectRatio || undefined }

  // Ref for main game area
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Scroll and start handler
  const handleStart = () => {
    if (gameAreaRef.current) {
      gameAreaRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    onStart()
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white select-none">
      {/* Score - always show, floating above the game card */}
      <motion.div
        key={score}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5 }}
        className="z-40 mb-4 mt-2 text-4xl font-extrabold text-yellow-300 drop-shadow-lg bg-black/60 px-8 py-3 rounded-full border-2 border-yellow-400 shadow-xl"
        style={{ letterSpacing: 2, position: 'relative', top: 0, left: 0, maxWidth: '90vw' }}
      >
        {score}
      </motion.div>
      <h2 className="text-3xl font-bold mb-6 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse">
          {title}
        </span>
      </h2>
      <div
        ref={gameAreaRef}
        className="relative overflow-hidden rounded-xl shadow-2xl bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col items-center w-full h-full justify-center"
        style={style}
        tabIndex={0}
      >
        {/* Game Content */}
        <div className="w-full h-full flex flex-col items-center justify-center">
          {children}
        </div>
        {/* Start Overlay */}
        <AnimatePresence>
          {!started && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl z-20"
              onClick={handleStart}
              tabIndex={-1}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-2xl font-bold mb-4 text-yellow-400"
              >
                {instructions}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm rounded-xl z-20"
            >
              <div className="text-4xl font-bold mb-4 text-red-500">Game Over</div>
              <div className="text-2xl mb-6">
                Score: <span className="text-yellow-400">{score}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg font-semibold text-lg shadow-lg hover:from-purple-700 hover:to-purple-900 transition"
                onClick={onRestart}
              >
                Play Again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 