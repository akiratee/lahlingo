# LahLingo - Product Requirements Document

**Version:** 1.0  
**Date:** March 2, 2026  
**Author:** Yilong (Senior Engineer)  
**Status:** Complete

---

## 1. Overview

### Product Name
**LahLingo** - Dialect Learning App for Children

### Product Type
Mobile-first Progressive Web App (PWA) built with Next.js

### Core Summary
An engaging dialect learning application designed for children (ages 5-12) to learn Southern Chinese dialects (Hokkien, Teochew, Cantonese, Hakka) through interactive lessons, gamification, and speech practice.

### Target Users
- **Primary:** Children ages 5-12 learning Chinese dialects
- **Secondary:** Parents who want to introduce dialect preservation to their children

---

## 2. Supported Dialects

| Dialect | Status | Units | Lessons | Tones |
|---------|--------|-------|---------|-------|
| Hokkien (Singaporean) | ✅ Active | 3 | 16 | 8 (Tones 1-8) |
| Teochew | ✅ Active | 2 | 10 | 8 (Tones 1-8) |
| Cantonese | 🔜 Coming Soon | 0 | 0 | - |
| Hakka | 🔜 Coming Soon | 0 | 0 | - |

---

## 3. Current Features

### 3.1 Learning Features

#### 3.1.1 Lessons
- **Structure:** Units → Lessons → Vocabulary + Dialogues + Quiz
- **Vocabulary:** Chinese characters, romanization (Peh-oe-ji for Hokkien), English translation, tone markers
- **Dialogues:** Practical conversation scenarios with cultural notes
- **Quiz:** Multiple choice questions testing vocabulary and comprehension
- **XP Reward:** Base XP per lesson completion (50 XP)

#### 3.1.2 Quiz Challenge (`/learn/quiz`)
- 5-question quick quiz on current dialect
- Visual feedback for correct/incorrect answers
- XP rewards: 10 base + 5 per correct answer
- Progress tracking within session

#### 3.1.3 Tone Drills (`/learn/drill`)
- **Full Drill:** 10 questions for comprehensive practice
- **Quick Drill:** 3 questions for fast review
- Tone contour visualization
- Audio playback of phrase
- User selects correct tone (1-8)
- Visual feedback for correct/incorrect

#### 3.1.4 Flashcard Review (`/learn/review`)
- Spaced repetition using SM-2 algorithm
- Cards due based on review interval
- Quality rating (Again, Hard, Good, Easy)
- Automatic card addition from completed lessons
- LocalStorage persistence

#### 3.1.5 Quick Review (`/learn/review/quick`)
- 5-question rapid vocabulary review
- Random selection from recently completed vocabulary
- XP rewards similar to Quiz Challenge
- Fast-paced for daily review

#### 3.1.6 Pronunciation Practice
- Web Speech API (SpeechRecognition) for voice input
- Microphone-based input with real-time transcript
- Pronunciation scoring using similarity algorithm
- 70% threshold for successful match
- Visual and color-coded feedback
- Text-to-speech for correct pronunciation playback

#### 3.1.7 Favorites System (`/learn/favorites`)
- Star/Bookmark any lesson for quick replay
- Favorites persisted in localStorage
- "My Favorites" section on home screen
- Quick access to favorite lessons

---

### 3.2 Gamification Features

#### 3.2.1 XP & Levels
- **XP System:** Earn XP from lessons, quizzes, reviews
- **Level Progression:** 
  - Level 1-2: Beginner (0-500 XP)
  - Level 3-4: Intermediate (501-1500 XP)
  - Level 5+: Advanced
- XP required for next level shown in stats

#### 3.2.2 Streaks
- Daily streak tracking
- Streak increments when at least 1 lesson completed per day
- Longest streak record maintained
- Streak freeze system (starts with 1 freeze)
- Freeze protects streak if user misses a day

#### 3.2.3 Achievements
| Achievement | Condition | XP Bonus |
|-------------|-----------|----------|
| First Steps | Complete 1 lesson | 100 |
| Getting Started | Complete 3 lessons | 150 |
| Dedicated Learner | Complete 10 lessons | 300 |
| Three Day Fire | 3-day streak | 200 |
| First Week | 7-day streak | 500 |
| Two Week Champion | 14-day streak | 750 |
| Month Warrior | 30-day streak | 1000 |
| Two Month Titan | 60-day streak | 1500 |
| Century Streak | 100-day streak | 2500 |
| Tone Master | Score 95%+ on pronunciation | 200 |
| Quick Learner | Complete 5 lessons | 250 |
| Explorer | Try all 4 dialects | 400 |
| Century | Earn 1000 XP | 500 |
| Dialect Master | Reach Level 5 | 1000 |

#### 3.2.4 Daily Goals
- Configurable daily study minutes goal
- Tracks minutes studied and lessons completed
- Visual progress bar on home screen
- Goal completion indicator

---

### 3.3 Progress & Analytics

#### 3.3.1 Stats Screen
- **Level Progress:** XP bar showing progress to next level
- **Streak Card:** Current streak + best streak
- **Weekly Activity:** 7-day chart showing study minutes
- **Quick Stats Grid:** Lessons, achievements, quiz score average, goals met
- **Dialect Exploration:** Breakdown by dialect
- **Learning Journey:** Timeline of progress

#### 3.3.2 Weekly Review
- Summary statistics (completed, pending, completion rate)
- Daily breakdown for last 7 days
- Project/task progress
- Most used tags

---

### 3.4 User Interface

#### 3.4.1 Screens
1. **Onboarding Screen:** Dialect selection, profile creation
2. **Home Screen:** Continue learning, quick actions, stats overview
3. **Lesson Player:** Vocabulary, dialogues, quiz, completion
4. **Profile Screen:** Avatar, achievements, progress
5. **Settings Screen:** Daily goals, data management, about
6. **Stats Screen:** Detailed analytics

#### 3.4.2 Navigation
- Header with back button and contextual actions
- Floating action buttons for quick access
- Tab-based navigation within sections

#### 3.4.3 Audio Resources Panel
- Expandable panel showing available audio recordings
- Status indicators (available/coming soon)
- Ready for family recordings (MP3 in public/audio/)

---

### 3.5 Data Management

#### 3.5.1 Export/Import
- Export all progress data to JSON file
- Import progress from backup file
- Timestamp-based backup filenames
- Clear favorites and clear data options

#### 3.5.2 LocalStorage Persistence
All data stored locally:
- User profile
- Progress (lessons, XP, levels, streaks)
- Achievements
- Favorites
- Settings
- Review cards

---

## 4. Technical Specifications

### 4.1 Tech Stack
- **Framework:** Next.js 14.2.35
- **Language:** TypeScript
- **Testing:** Vitest
- **PWA:** next-pwa with service worker
- **Storage:** localStorage (client-side)
- **APIs:** Web Speech API (SpeechRecognition, SpeechSynthesis)

### 4.2 Project Structure
```
lahlingo/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── learn/          # Learning routes
│   │   │   ├── [dialect]/ # Dialect-specific lessons
│   │   │   ├── drill/     # Tone drills
│   │   │   ├── favorites/ # Favorites list
│   │   │   ├── quiz/      # Quiz challenge
│   │   │   ├── review/    # Flashcard review
│   │   │   └── vocabulary/# Vocabulary list
│   │   └── mandarin-poc/  # Mandarin POC route
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/               # Business logic
│   │   ├── achievements.ts
│   │   ├── audio-resources.ts
│   │   ├── config.ts
│   │   ├── flashcard-review.ts
│   │   ├── lessons.ts
│   │   ├── progress.ts
│   │   ├── quiz-challenge.ts
│   │   ├── quick-review.ts
│   │   ├── speech-recognition.ts
│   │   ├── stats.ts
│   │   └── tts.ts
│   ├── test/               # Test setup
│   └── types/              # TypeScript types
├── public/
│   ├── manifest.json       # PWA manifest
│   └── audio/             # Audio resources
└── package.json
```

### 4.3 Test Coverage
- **Total Tests:** 63 tests (3 test files)
- **Test Files:**
  - mandarin-poc.test.ts
  - progress.test.ts
  - quiz-challenge.test.ts

---

## 5. Content Structure

### 5.1 Hokkien (Singaporean)
- **Unit 1: Getting Started** (5 lessons)
  - Greetings & Introductions
  - Numbers 1-10
  - Numbers 11-100
  - Counting Objects
  - Prices & Money
- **Unit 2: Family** (6 lessons)
  - Parents & Siblings
  - Extended Family
  - Spouse & Children
  - In-Laws
  - Addressing Others
- **Unit 3: Family Topics** (5 lessons)
  - (From Task 1096)

### 5.2 Teochew
- **Unit 1: Greetings** (5 lessons)
- **Unit 2: Numbers** (5 lessons)

---

## 6. Future Enhancements (Out of Scope)

### 6.1 Content Expansion
- Complete Cantonese content
- Complete Hakka content
- More units for Hokkien and Teochew

### 6.2 Features
- Multi-child profiles (partially implemented)
- Cloud sync / account system
- Parent dashboard
- WhatsApp integration for reminders
- AI-powered conversation practice

### 6.3 Technical
- Supabase backend integration
- Push notifications
- Offline mode enhancements

---

## 7. Dependencies

### 7.1 Required
- Next.js 14.x
- React 18.x
- TypeScript 5.x
- Vitest

### 7.2 Optional (for future)
- OpenAI API (for AI features)
- Supabase (for cloud sync)

---

## 8. Success Metrics

- ✅ All tests passing (63/63)
- ✅ TypeScript compiles clean
- ✅ PWA build successful
- ✅ Core learning features functional
- ✅ Gamification system operational
- ✅ Progress tracking accurate

---

## 9. Notes

- **Blockers:** None - all core features implemented
- **Production Ready:** Yes (per Dan's QA verification)
- **WhatsApp Integration:** Not required for core functionality
- **Supabase:** Not required - localStorage-based storage works

---

**Document Version History:**
- v1.0 (March 2, 2026): Initial PRD created by Yilong
