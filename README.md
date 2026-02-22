# LahLingo 🎯

Learn Singapore dialects with tone training — lah!

## About

**LahLingo** is a language learning app for Singapore Chinese dialects:
- 🇸🇬 **Hokkien** (闽南语)
- 🇨🇳 **Teochew** (潮州话)
- 🇭🇰 **Cantonese** (粤语)
- 🏯 **Hakka** (客家话)

## Features

- 🎯 **Visual Tone Training** — Master tones 1-7 with interactive ladder
- 🗣️ **Speech Recognition** — Practice pronunciation with feedback
- 🏆 **XP & Streaks** — Gamified learning journey
- 📱 **Mobile-First PWA** — Learn anywhere, offline-capable

## Quick Start

```bash
cd projects/dialect-app
npm install
npm run dev
```

Visit: http://localhost:3001

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** localStorage (MVP)
- **TTS:** Browser TTS + OpenAI TTS

## Project Structure

```
dialect-app/
├── src/
│   ├── app/           # Next.js pages
│   ├── components/    # React components
│   ├── hooks/         # Custom hooks
│   ├── lib/           # Utilities
│   └── types/         # TypeScript types
├── docs/              # PRD, research, QA
└── public/           # Static assets
```

## TTS Providers

- 🌐 **Browser TTS** — Free, built-in, robotic quality
- 🤖 **OpenAI TTS** — Natural, pay-per-use (configure in Settings)

## Team

- **Vincent** — Product Owner
- **Rei** — Product Manager
- **Yilong** — Senior Engineer
- **Dan** — QA Tester

## License

Private project © 2026
