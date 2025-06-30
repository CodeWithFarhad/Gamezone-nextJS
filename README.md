# GameZone

**GameZone** is a modern, fully responsive web app featuring a curated collection of interactive games. Built with Next.js and React, it offers a beautiful, unified UI, smooth performance, and a great experience on both desktop and mobile.

---

## 🎮 Features

- **12+ Classic & Modern Games**  
  Tic-Tac-Toe, Snake, Memory Cards, Rock Paper Scissors, Hangman, Quiz Game, Flappy Bird, 2048, Pong, Whack-a-Mole, Typing Speed Test, Word Scramble.

- **Unified, Animated UI**  
  All games use a consistent, modern wrapper with animated titles, score counters, overlays, and responsive containers.

- **Fully Responsive**  
  Games and UI scale perfectly on all devices, using Tailwind CSS and aspect ratios.

- **Performance Optimized**  
  Dynamic imports/code splitting for fast initial loads. Games load only when needed.

- **Game-Specific Features**  
  - Flappy Bird: Parallax background, animated bird, modern pipes.
  - Pong: SVG graphics, scalable paddles.
  - Quiz Game: Randomized questions, new quiz each time.
  - Typing Speed Test: Large paragraphs, improved input.
  - And more!

- **Animated, Moving Background**  
  The main page features a beautiful, animated background image.

- **Search & Suggestions**  
  Instantly search for games with live suggestions.

- **No Sign-In Required**  
  The site is open and ready to play—no authentication needed.

- **Custom Branding**  
  Custom logo and footer with a glassmorphic effect and background image.

---

## 🚀 Getting Started

### 1. **Install Dependencies**
```bash
pnpm install
# or
npm install
# or
yarn install
```

### 2. **Run Locally**
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Build for Production

```bash
pnpm build
pnpm start
# or
npm run build && npm start
# or
yarn build && yarn start
```

---

## 🌐 Deploying to Vercel

1. Push your code to GitHub (or GitLab/Bitbucket).
2. Go to [https://vercel.com/](https://vercel.com/) and import your repo.
3. Vercel auto-detects Next.js and builds your site.
4. Get a live URL instantly!

---

## 📁 Project Structure

```
/app
  /game/[slug]    # Dynamic game pages
  layout.tsx      # Main layout
  page.tsx        # Home page
/components
  /games          # All game components
  /ui             # UI components (buttons, cards, etc.)
/public/images    # Backgrounds, logos, etc.
/styles           # Global and Tailwind CSS
```

---

## ✨ Customization

- **Add new games:** Drop a new component in `/components/games` and add it to the dynamic import map.
- **Change branding:** Update the logo and background images in `/public/images` and the relevant components.
- **Edit game logic or UI:** All games are modular and easy to update.

---

## 🙏 Credits

- Built with [Next.js](https://nextjs.org/), [React](https://react.dev/), and [Tailwind CSS](https://tailwindcss.com/).
- GameZone logo: [VectorStock #30490200](https://cdn.vectorstock.com/i/1000v/02/00/game-zone-sign-logo-design-vector-30490200.jpg)
- Footer background: [Peakpx](https://w0.peakpx.com/wallpaper/392/996/HD-wallpaper-dark-devotion-2019-pc-game-poster.jpg)
- Main background: [Freepik](https://img.freepik.com/free-photo/cool-geometric-triangular-figure-neon-laser-light-great-backgrounds-wallpapers_181624-9331.jpg?semt=ais_items_boosted&w=740)

---

## 📣 License

This project is for educational and demo purposes.  
For commercial use, please check the licenses of all included assets. 