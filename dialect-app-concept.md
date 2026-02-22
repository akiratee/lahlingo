# Dialect Master - App Concept

## Core Value Proposition
A gamified learning platform for Singapore Chinese dialects (Hokkien, Teochew, Cantonese, Hakka) that bridges heritage speakers with formal learning, focusing on tone training and practical conversation skills.

## Target Audience

### Primary Users
1. **Heritage Speakers (ABCDs)** - Speak dialect at home but can't read/write; want to reclaim heritage
2. **Young Singaporeans** - Want to learn grandparents' language before it's lost
3. **Mandarin Speakers** - Adding a third "dialect" for cultural connection
4. **Language Enthusiasts** - Anyone interested in Southern Min languages

### User Personas
- **"Reclaimer Emma"** (25, Singaporean ABCD): Grandma only speaks Hokkien, Emma understands but can't respond. Wants to have real conversations.
- **"Heritage Hunter"** (30, Malaysia/Indonesia): Family speaks Teochew at home. Wants to speak properly with elders.
- **"Linguistic Sam"** (22, Singaporean): Studies Chinese formally, wants to learn "cool" dialects for cultural identity.

## Key Features

### 1. Dialect Selector
- Start with placement test to identify baseline
- Switch between dialects (Hokkien, Teochew, Cantonese, Hakka)
- Track progress per dialect

### 2. Tone Training Lab ⭐ (Differentiation)
- Visual tone ladder showing 6-8 tones
- Interactive exercises: hear → repeat → compare
- Pitch visualization (like Duolingo's speaking exercises but better)
- Tone drills: minimal pairs (words that differ only by tone)
- Slow-playback with waveform visualization

### 3. Romanization Explorer
- Toggle between systems: POJ, Peh-oe-jī, Peng'im, Tâi-lô
- Learn the differences between romanizations
- "My romanization" preference setting

### 4. Conversational Core
- Scenario-based lessons (market, family dinner, phone call)
- Role-play with native speaker audio
- Practical phrases for Singapore context:
  - "Lai chia, beh chia?" (Want to eat?)
  - "Ai beh lor" (Don't want already)
  - "Gua beh khi" (I don't want to go)
- Cultural notes explaining usage

### 5. Character Bridge
- Show Chinese characters where applicable
- Explain when dialect uses different characters
- Build literacy alongside speaking

### 6. Speaking Practice
- Speech recognition (device native or API)
- Pronunciation scoring
- Record and compare with native audio
- Shadow speaking exercises

### 7. Heritage Connect
- Community features: find conversation partners
- "Ask Grandma" questions curated by users
- Audio submissions from native speakers

### 8. Gamification
- Daily streaks (learning habit)
- XP for lessons completed
- Leaderboards by dialect
- Achievements (e.g., "First Conversation", "Tone Master")
- Levels: Beginner → Conversational → Fluent

## Learning Path

### Beginner Track (0-50 hours)
- Numbers 1-100
- Common greetings
- Family terms
- Food vocabulary
- Basic sentence patterns
- Tone introduction

### Conversational Track (50-150 hours)
- Daily conversations
- Market/shopping scenarios
- Phone calls
- Family discussions
- Emotions and expressions
- Tone refinement

### Fluent Track (150+ hours)
- Abstract discussions
- Storytelling
- Debates (simple)
- Literature excerpts
- Native-level pronunciation

## Content Structure

### Units (Hokkien Example)
1. **Greetings & Basics** - Hello, goodbye, thank you, sorry
2. **Numbers & Counting** - 1-100, prices, time
3. **Family** - Mom, dad, siblings, extended family
4. **Food** - Common dishes, ordering, hawker center
5. **Daily Activities** - Wake up, eat, work, sleep
6. **Shopping** - Market, asking prices, bargaining
7. **Travel** - Directions, taxi, bus
8. **At Home** - Chores, meals, relaxation
9. **Health** - Body parts, doctor, symptoms
10. **Social** - Meeting friends, invitations

### Lesson Format (5-7 min)
1. Warm-up review (1 min)
2. New vocabulary (5-7 words/phrases)
3. Pronunciation practice (interactive)
4. Dialogue introduction
5. Comprehension check
6. Production exercise
7. Cultural note

## Technical Considerations

### Frontend
- React Native or Flutter (mobile-first)
- Offline mode for lessons
- Audio caching

### Audio
- Native speaker recordings
- Multiple speakers (male/female, young/old)
- Singaporeaccented dialect
- Slow playback option

### Speech Recognition
- Options: Whisper API, Azure Speech, or device-native
- Train on dialect audio if possible
- Fallback to human transcription for review

### Backend
- User progress sync
- Community content moderation
- Leaderboards

### Content Management
- Structured lesson data (JSON)
- Easy to add new dialects
- Version control for content updates

## Monetization (Optional)

### Free Tier
- 1 lesson/day
- Basic vocabulary
- Limited practice

### Premium ($9.99/month)
- Unlimited lessons
- All dialects
- Advanced features
- No ads

### One-time Purchase ($49.99)
- Lifetime access
- All future content

## Differentiation from Competitors

| Feature | Dialect Master | Duolingo | HelloChinese | Existing Dialect Apps |
|---------|----------------|----------|---------------|----------------------|
| Dialects (Hokkien/Teochew) | ✅ | ❌ | ❌ | Partial |
| Tone visualization | ✅⭐ | ❌ | Partial | ❌ |
| Multiple romanization | ✅ | ❌ | ❌ | ❌ |
| Singapore context | ✅⭐ | ❌ | ❌ | ❌ |
| Heritage speaker focus | ✅⭐ | ❌ | Partial | ❌ |
| Gamification | ✅ | ✅ | ✅ | ❌ |
| Speech recognition | ✅ | ✅ | ✅ | ❌ |
| Community features | ✅ | ✅ | ❌ | ❌ |

## Name Options
1. **Dialect Master** - Clear, memorable
2. **Lán Lán** (咱倆 "We two") - Playful, heritage feel
3. **Ga lang** (我講 "I speak") - Action-oriented
4. **Heritage** - Simple, meaningful
5. **Dialect Connect** - Community-focused

## MVP Scope

### Version 1.0
- Hokkien only (simplify)
- 10 beginner units
- Basic audio lessons
- Simple gamification (streaks, XP)
- Romanization toggle
- No speech recognition (manual feedback)

### Version 1.1
- Add Teochew
- Speech recognition
- Community features

### Version 2.0
- All 4 dialects
- Advanced lessons
- Native speaker chat

## Next Steps

1. Validate concept with potential users
2. Create content outline for Hokkien beginner track
3. Design UI/UX mockups
4. Build prototype (MVP)
5. Test with 5-10 heritage speakers
6. Iterate based on feedback
