"use client"

import { useState, useRef } from "react"
import { Search, Play, Star, Users, Clock, Trophy } from "lucide-react"
import Link from "next/link"

const codeGames = [
  {
    title: "Tic-Tac-Toe",
    slug: "tic-tac-toe",
    category: "Strategy",
    description: "A strategic game for two players. Align three Xs or Os to win.",
    difficulty: "Easy",
    players: "2 Players",
    time: "5 min",
    rating: 4.5,
    poster: "https://www.tannens.com/cdn/shop/files/SOCIALTICTACTOE.png?v=1720732016",
  },
  {
    title: "Snake",
    slug: "snake",
    category: "Arcade",
    description: "Control a snake that grows longer. Avoid walls and your tail.",
    difficulty: "Medium",
    players: "1 Player",
    time: "10 min",
    rating: 4.8,
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeICjNpKz28ldSuSL7YPndO3ZQLJeHzxKliA&s",
  },
  {
    title: "Memory Cards",
    slug: "memory-cards",
    category: "Puzzle",
    description: "Flip cards to find matching pairs. Test your memory skills.",
    difficulty: "Easy",
    players: "1 Player",
    time: "8 min",
    rating: 4.3,
    poster: "https://www.shutterstock.com/image-vector/animal-memory-card-game-illustration-260nw-2175228653.jpg",
  },
  {
    title: "Rock Paper Scissors",
    slug: "rock-paper-scissors",
    category: "Quick Play",
    description: "Classic hand game. Rock beats scissors, scissors beats paper.",
    difficulty: "Easy",
    players: "1-2 Players",
    time: "2 min",
    rating: 4.1,
    poster: "https://img.freepik.com/free-vector/rock-paper-scissors-banner_107791-8387.jpg?semt=ais_hybrid&w=740",
  },
  {
    title: "Hangman",
    slug: "hangman",
    category: "Word",
    description: "Guess the hidden word by suggesting letters.",
    difficulty: "Medium",
    players: "1 Player",
    time: "7 min",
    rating: 4.4,
    poster: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3363840/header.jpg?t=1735136423",
  },
  {
    title: "Quiz Game",
    slug: "quiz-game",
    category: "Trivia",
    description: "Answer multiple-choice questions on various topics.",
    difficulty: "Medium",
    players: "1 Player",
    time: "15 min",
    rating: 4.6,
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyX29Bnu3ZhWVzjIou4DG1GPeYSWJzaXGVJQ&s",
  },
  {
    title: "Flappy Bird",
    slug: "flappy-bird",
    category: "Arcade",
    description: "Control a bird flying through gaps between pipes.",
    difficulty: "Hard",
    players: "1 Player",
    time: "5 min",
    rating: 4.7,
    poster: "https://i.ytimg.com/vi/ihvBiJ1oC9U/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDS1fKUzNuMZN17_juid1RLdJkDtg",
  },
  {
    title: "2048",
    slug: "2048",
    category: "Puzzle",
    description: "Slide numbered tiles to combine them and reach 2048.",
    difficulty: "Hard",
    players: "1 Player",
    time: "20 min",
    rating: 4.9,
    poster: "https://i.ytimg.com/vi/4NFZwPhqeRs/maxresdefault.jpg",
  },
  {
    title: "Pong",
    slug: "pong",
    category: "Arcade",
    description: "Classic two-player arcade game with paddles and ball.",
    difficulty: "Medium",
    players: "1-2 Players",
    time: "10 min",
    rating: 4.2,
    poster: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFPKadxkUFipgmqEflHaDnCAMNMy9VtQ9m1A&s",
  },
  {
    title: "Whack-a-Mole",
    slug: "whack-a-mole",
    category: "Action",
    description: "Click on moles as they appear. Test your reflexes.",
    difficulty: "Medium",
    players: "1 Player",
    time: "5 min",
    rating: 4.3,
    poster: "https://www.cokogames.com/wp-content/uploads/2022/03/whack-em-all-game.jpg",
  },
  {
    title: "Typing Speed Test",
    slug: "typing-speed-test",
    category: "Skill",
    description: "Test how fast and accurately you can type.",
    difficulty: "Easy",
    players: "1 Player",
    time: "3 min",
    rating: 4.5,
    poster: "https://www.speedtypingonline.com/images/TTA_icon_med.png?v=3",
  },
  {
    title: "Word Scramble",
    slug: "word-scramble",
    category: "Word",
    description: "Unscramble mixed-up letters to form the correct word.",
    difficulty: "Medium",
    players: "1 Player",
    time: "8 min",
    rating: 4.4,
    poster: "https://dictionary.cambridge.org/external/images/wordscramble-og-image.png",
  },
]

const categories = ["All", "Strategy", "Arcade", "Puzzle", "Quick Play", "Word", "Trivia", "Action", "Skill"]

export default function GameZone() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredGames = codeGames.filter((game) => {
    const matchesSearch =
      game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Suggestions for search
  const suggestions = searchTerm.length > 0
    ? codeGames.filter(game => game.title.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 5)
    : []

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* New Esports Background - Zoomed 15% */}
      <div className="fixed inset-0 w-full h-full">
        <div
          className="absolute inset-0 w-full h-[120%] bg-cover bg-center animate-slow-float scale-115"
          style={{
            backgroundImage: `url('/images/esports-background.avif')`,
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10">
        {/* Header - Simple Glass */}
        <header className="p-6">
          <div className="glass-container-simple max-w-7xl mx-auto flex items-center justify-center gap-8">
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn.vectorstock.com/i/1000v/02/00/game-zone-sign-logo-design-vector-30490200.jpg"
                alt="GameZone Logo"
                className="w-16 h-16 object-contain rounded-xl bg-white/10"
                draggable="false"
              />
              <h1 className="text-3xl font-bold text-white">GameZone</h1>
            </div>

            {/* Search Bar - Simple Glass */}
            <div className="glass-input-container-simple flex-1 max-w-xl mx-auto relative">
              <Search className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 transform -translate-y-1/2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setShowSuggestions(true); }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                className="glass-input-simple w-full pl-12 pr-4 py-3 text-white placeholder-gray-300"
                autoComplete="off"
              />
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 border border-slate-700 rounded-xl shadow-xl z-50 max-h-60 overflow-auto">
                  {suggestions.map((game) => (
                    <Link
                      key={game.slug}
                      href={`/game/${game.slug}`}
                      className="block px-4 py-3 hover:bg-purple-700/80 text-white text-base cursor-pointer transition-colors"
                      onMouseDown={e => e.preventDefault()}
                    >
                      <div className="flex items-center gap-3">
                        <img src={game.poster || "/placeholder.svg"} alt={game.title} className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-semibold">{game.title}</span>
                        <span className="ml-auto text-xs text-gray-400">{game.category}</span>
                      </div>
                    </Link>
                  ))}
            </div>
              )}
            </div>
          </div>
        </header>

        {/* Hero Section with Enhanced Gaming Controller Background */}
        <section className="px-6 py-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="hero-glass-container relative overflow-hidden p-12">
              {/* Blurred Gaming Controller Background */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
                style={{
                  backgroundImage: `url('/images/hero-gaming-bg.jpeg')`,
                }}
              />

              {/* Glass overlay for better text readability */}
              <div className="absolute inset-0 bg-black/20" />

              {/* Content */}
              <div className="relative z-10">
                <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Welcome to GameZone</h2>
                <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto drop-shadow-md">
                  Discover a curated collection of high-quality, interactive games. From classic puzzles to modern
                  challenges, find your next favorite game.
                </p>
                <div className="glass-button-simple inline-block">
                  <a href="#featured-games" className="px-8 py-4 text-white font-semibold text-lg block">Start Playing</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories - Simple Glass */}
        <section className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-container-simple p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Categories</h3>
              <div className="flex flex-wrap gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`glass-button-simple px-6 py-3 text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === category
                        ? "bg-white/30 text-white"
                        : "text-gray-300 hover:text-white hover:bg-white/20"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Games Grid - Simple Glass */}
        <section id="featured-games" className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="glass-container-simple p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-3xl font-bold text-white">Featured Games</h3>
                <p className="text-gray-300">{filteredGames.length} games found</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <Link key={game.slug} href={`/game/${game.slug}`}>
                    <div className="game-card-simple group cursor-pointer">
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={game.poster || "/placeholder.svg"}
                          alt={game.title}
                          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4">
                          <div className="glass-badge-simple px-3 py-1 text-xs font-semibold text-white">
                            {game.category}
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="glass-button-simple p-3 rounded-full">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <h4 className="text-xl font-bold text-white mb-2">{game.title}</h4>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-2">{game.description}</p>

                        <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{game.players}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{game.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{game.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              game.difficulty === "Easy"
                                ? "bg-green-500/20 text-green-400"
                                : game.difficulty === "Medium"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {game.difficulty}
                          </span>
                          <div className="glass-button-simple px-4 py-2 text-sm font-semibold text-white">Play Now</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Simple Glass */}
        <footer className="px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="glass-container-simple p-8 text-center relative overflow-hidden">
              {/* Footer background image */}
              <img
                src="https://w0.peakpx.com/wallpaper/392/996/HD-wallpaper-dark-devotion-2019-pc-game-poster.jpg"
                alt="Footer background"
                className="absolute inset-0 w-full h-full object-cover opacity-70 pointer-events-none select-none z-0 blur-sm"
                draggable="false"
              />
              <div className="relative z-10">
              <div className="flex items-center justify-center space-x-4 mb-6">
                  <img
                    src="https://cdn.vectorstock.com/i/1000v/02/00/game-zone-sign-logo-design-vector-30490200.jpg"
                    alt="GameZone Logo"
                    className="w-12 h-12 object-contain rounded-lg bg-white/10"
                    draggable="false"
                  />
                <h4 className="text-2xl font-bold text-white">GameZone</h4>
              </div>
              <p className="text-gray-300 mb-6">Your ultimate destination for high-quality interactive games.</p>
              <div className="flex justify-center space-x-8 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">
                  About
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-gray-500 text-sm">© 2025 GameZone. All rights reserved.</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
