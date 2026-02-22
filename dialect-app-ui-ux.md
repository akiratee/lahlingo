# Dialect Master - UI/UX Design

## Design Philosophy

### Core Principles
1. **Heritage Warmth**: Warm, inviting colors that evoke nostalgia and family connection
2. **Tone-Forward**: Visual design that constantly reinforces tone learning
3. **Heritage-Inclusive**: Respects diverse backgrounds (Hokkien, Teochew, Cantonese, Hakka)
4. **Focus-First**: Clean interfaces that don't distract from learning
5. **Encouraging**: Gamification that motivates without pressure

### Target Users
- **Heritage Speakers**: ABCDs reclaiming their language
- **Young Singaporeans**: Connecting with grandparents
- **Language Enthusiasts**: Learning for cultural identity
- **Busy Adults**: Learning in short bursts (5-7 min lessons)

---

## Design System

### Color Palette

#### Primary Colors
```
Brand Brown:  #8B5E3C  (Main buttons, CTAs, brand)
Heritage Gold: #D4A574  (Highlights, achievements, XP)
```

#### Tone Visualization Colors
```
Tone 1: #4CAF50  (Green - Easy/Flat)
Tone 2: #2196F3  (Blue - Rising)
Tone 3: #F44336  (Red - Falling)
Tone 5: #9E9E9E  (Gray - Low)
Tone 6: #FF9800  (Orange - Low Rising)
Tone 7: #673AB7  (Purple - Entering)
```

#### Background Colors
```
Light Mode:
  Background:     #FAFAF8  (Warm Off-White)
  Surface:        #FFFFFF  (Pure White)
  Border:         #E5E2DB  (Soft Gray)

Dark Mode:
  Background:     #1A1816  (Warm Black)
  Surface:        #262320  (Charcoal)
  Border:         #3D3A35  (Subtle Gray)
```

#### Semantic Colors
```
Success:   #4CAF50  (Green)
Warning:   #FF9800  (Orange)
Error:     #F44336  (Red)
Info:      #2196F3  (Blue)
```

### Typography

| Type | Font | Size | Weight |
|------|------|------|--------|
| Display | Inter | 32px | 600 |
| H1 | Inter | 28px | 600 |
| H2 | Inter | 24px | 600 |
| H3 | Inter | 20px | 600 |
| Body | Inter | 16px | 400 |
| Small | Inter | 14px | 400 |
| Caption | Inter | 12px | 400 |
| Chinese | Noto Serif SC | Variable | 400-500 |
| Romanization | JetBrains Mono | Variable | 400 |

### Spacing
```
Base unit: 4px
Standard:  16px (4x)
Comfortable: 24px (6x)
Section: 32px (8x)
```

### Border Radius
```
Small:  4px   (tags)
Medium: 8px   (cards, buttons)
Large:  12px  (modals)
XL:     16px  (screens)
Full:   9999px (pills)
```

---

## Component Library

### 1. Buttons

#### Primary Button
```
Background: #8B5E3C (Brand Brown)
Text: White
Height: 48px
Padding: 16px 32px
Border-radius: 8px
Hover: Darken 10%
Disabled: 50% opacity
```

#### Secondary Button
```
Background: Transparent
Border: 1px solid #E5E2DB
Text: #4A4743
Height: 48px
```

#### Play Button (Large)
```
Size: 72x72px
Background: Brand color
Shape: Full rounded
```

### 2. Cards

#### Lesson Card
```
Padding: 16px
Border-radius: 12px
Background: White (light) / #262320 (dark)
Progress bar: Full width, 4px height
```

#### Phrase Card
```
Padding: 16px
Border-radius: 12px
Large Chinese character: 32px
Romanization: Monospace, 16px
Translation: 14px
Action icons: Play, Audio, Favorite
```

#### Achievement Card
```
Size: 80x80px
Icon: 36px
Title: 12px bold
XP bonus: 12px
```

### 3. Tone Ladder Component
```
Visual representation of each tone contour:
Tone 1: ═════════ (Flat, High)
Tone 2:   ╱       (Rising)
Tone 3:   ╲       (Falling)
Tone 5: _ _ _ _ _ (Low, Flat)
Tone 6:   ╲_      (Low Rising)
Tone 7: ─┐        (Short, Stopped)
```

### 4. Progress Bar
```
Height: 8px
Border-radius: 4px
Background: #E5E2DB
Fill: Brand color gradient
```

---

## Screen-by-Screen Design

### 1. Welcome Screen
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│                                                     │
│                                                     │
│              🏠  Dialect Master                     │
│                                                     │
│    Learn Hokkien, Teochew, Cantonese, Hakka        │
│                                                     │
│    "Reclaim your heritage, one phrase at           │
│     a time."                                       │
│                                                     │
│                                                     │
│                                                     │
│              [  Get Started  ]                    │
│                                                     │
│         Already have an account?  Sign in          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Dialect Selection
```
Header: "Choose Your Dialect"

Options (cards):
┌───────────────────────────────────────────┐
│  🗣️  Hokkien                              │
│                                            │
│  闽南话 • Southern Min                     │
│  Largest Chinese group in Singapore        │
│  [SELECTED]                               │
└───────────────────────────────────────────┘

Other options: Teochew, Cantonese, Hakka

CTA: [ Continue ]
```

### 3. Assessment Level
```
Options:
┌───────────────────────────────────────────┐
│  😕  I'm a complete beginner              │
│     I don't understand anything           │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│  🤔  I can understand a little             │
│     I grew up hearing it but can't speak  │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│  😊  I know some basics                   │
│     Hello, thank you, etc.                │
└───────────────────────────────────────────┘

┌───────────────────────────────────────────┐
│  😎  I'm conversational                   │
│     I can get by but want to improve     │
└───────────────────────────────────────────┘

CTA: [ Start Learning ]
```

### 4. Home Screen (Logged In)
```
Header:
- Date
- Streak: 🔥 12

Welcome Card:
- "Welcome back, Emma!"
- "Keep your streak alive!"

Progress Section:
- Current unit progress bar
- Weekly activity (M T W T F S S dots)

Achievements:
- 3 recent badges

Continue Learning:
- "Continue Lesson" card with resume CTA

Units Grid:
- 6 unit cards with icons, progress, status

Bottom: [ + Add Dialect ]
Top Right: ⚙️ 🔔 👤
```

### 5. Lesson Player - Intro
```
Header:
- Back arrow
- Lesson progress: "Lesson 2/5"

Card:
- Unit title: "🔤 Greetings"
- Subtitle: "Hello, Thank you"
- Duration: "5 minutes • 7 phrases"
- Skills preview

CTA: [ Start ]

Skills list below
```

### 6. Lesson Player - Vocabulary
```
Header:
- Back arrow
- Lesson progress
- 🔊 Audio toggle

Phrase Card (centered):
- Chinese: 你好 (large, 48px)
- Romanization: lí-hó (monospace, 24px)
- Tone ladder visualization
- Translation: Hello

Actions:
- [ ▶ Play Audio ]
- Navigation: ◀ 1/5 ▶
- Progress bar

CTA: [ Next Phrase ]
```

### 7. Lesson Player - Pronunciation
```
Prompt: "Repeat: 你好"

Recording Button:
- 🎤 Tap to Record (large, prominent)

After Recording:
- Waveform visualization
- Pitch contour overlay (yours vs target)
- Match percentage: 92%
- Feedback: "✓ Great job!"

CTA: [ Continue ]
```

### 8. Lesson Player - Dialogue
```
Dialogue Display:
- Speaker labels with avatars
- Dialogue lines with play/slow buttons
- Translations below each line

Comprehension Question:
- "What did they say?"
- Multiple choice options
- [ Check ] button

Feedback on answer
CTA: [ Continue ]
```

### 9. Lesson Complete
```
Celebration:
- 🎉 Lesson Complete!
- +50 XP
- Progress bar fill

Achievements:
- 🥉 First Steps
- 🔥 3-Day Streak

Cultural Note:
- 📖 box with cultural insight

CTAs:
- Primary: [ Next Lesson ]
- Secondary: [ ⟲ Replay ]
```

### 10. Profile Screen
```
Header:
- Avatar 👤
- Name: Emma Tan
- Level & XP bar

Stats Grid:
- 🔤 156 Words
- 🗣️ 42 Lessons
- ⏱️ 2h 35m

Streaks:
- Longest: 12 days
- Current: 3 days

Achievements: 8/24

Dialect Cards:
- Hokkien: Lv.5 ████████░░░
- Teochew: Lv.1 █░░░░░░░░░
- Cantonese: Lv.0 ○○○○○○○○○

Links:
- ⚙️ Settings
- 📊 Progress Export
- 📤 Share Progress
```

### 11. Units Screen
```
Header:
- "📚 Hokkien Lessons"
- Search bar

Unit Cards (4-5 visible):
┌─────────────────────────────────────────────┐
│  🥚  Unit 1: Greetings                      │
│  5 lessons • 25 minutes                     │
│  ████████████████████████████░░░  100%     │
│  ✓ Completed                                │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔢  Unit 2: Numbers & Counting             │
│  5 lessons • 30 minutes                     │
│  ██████████████████████████░░░░░  80%     │
│  ● Lesson 4 of 5                            │
└─────────────────────────────────────────────┘

Locked units show 🔒 and unlock requirement
```

---

## User Flows

### Flow 1: New User Onboarding
```
Welcome → Select Dialect → Assess Level → Personalize → First Lesson → Home
```

### Flow 2: Daily Learning
```
Open App → Home (Continue Lesson) → Lesson Flow → Complete → Share → Close
```

### Flow 3: Review Session
```
Tap "Review" → Spaced Repetition Cards → Results Summary
```

---

## Accessibility (WCAG 2.1 AA)

### Color Contrast
```
Text on Background: 4.5:1 minimum
Large Text: 3:1 minimum
UI Components: 3:1 minimum
```

### Interactive Elements
```
Touch Targets: 44x44px minimum
Focus States: Visible outline
Feedback: Visual + Audio + Haptic
```

### Screen Readers
```
Alt Text: All images
ARIA: Proper labels
Headings: Logical structure
Reading Order: Meaningful sequence
```

### Motion
```
Reduced Motion: Respects OS preference
No Auto-Play: Audio requires action
Transitions: 200-300ms
```

---

## Implementation Priority

### MVP (Version 1.0)
- [x] Design System
- [x] Welcome Screen
- [x] Dialect Selection
- [x] Home Screen
- [x] Lesson Player (Vocabulary + Audio)
- [x] Lesson Complete Screen
- [x] Profile Screen
- [x] Units Screen

### V1.1 (Add Features)
- [ ] Pronunciation Practice (speech API)
- [ ] Dialogue Scenes
- [ ] Spaced Repetition Review
- [ ] Achievements Gallery
- [ ] Streak Calendar

### V2.0 (Polish)
- [ ] Social Features
- [ ] Community Content
- [ ] Conversation Practice
- [ ] Advanced Analytics
