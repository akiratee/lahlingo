# LahLingo PRD: Developer Mode & Audio Resources

**Version:** 1.2  
**Date:** 2026-02-16  
**Status:** In Progress  
**Priority:** P1

## ⚠️ IMPORTANT: TTS Services Removed

**Decision:** Removed all cloud TTS providers (OpenAI, ElevenLabs) as they speak Mandarin, NOT Hokkien.

**Rationale:**
- OpenAI TTS voices (Alloy, Nova, etc.) are trained on English/general data
- No cloud TTS service currently offers authentic Hokkien/Taiwanese voice
- Browser TTS is also Mandarin-leaning
- Neither solves the core problem: authentic Hokkien pronunciation

**Current State:**
- Browser TTS: Available but Mandarin-leaning (fallback only)
- OpenAI TTS: REMOVED
- ElevenLabs: REMOVED

## New Direction: Real Audio Recordings

### Research Required
Find and evaluate sources of authentic Hokkien audio:

1. **YouTube Channels**
   - "Hokkien with Steven"
   - "Learn Hokkien"
   - Singaporean Hokkien teachers

2. **Open Source Datasets**
   - Taiwan Ministry of Education Hokkien corpus
   - Open Speech Corpus - Taiwanese Hokkien
   - ACQDIV Dataset

3. **Commercial Licensing**
   - Simply Learn Hokkien app audio
   - Glossika Hokkien courses
   - Pimsleur (if licensed)

4. **User-Generated**
   - Vincent's family/friends recording phrases
   - Community volunteers
   - Heritage speaker donations

### Technical Approach

**Option A: Manual Recording (Recommended for MVP)**
- Vincent records his family's Hokkien phrases
- 31 phrases in Unit 1 = ~2 hours of recording
- Clean, controlled environment
- Pros: Authentic, free, personal connection
- Cons: Time-consuming

**Option B: YouTube Audio Extraction**
- Extract audio from educational videos
- Manual alignment required
- Pros: Free content exists
- Cons: Quality varies, legal ambiguity

**Option C: Dataset Licensing**
- Contact Taiwan Ministry of Education
- Academic/open datasets
- Pros: Professional quality
- Cons: May require translation to Singapore Hokkien

---

## User Stories (Revised)

### Story 1: Enable Developer Mode
**As a** developer/user  
**I want to** toggle Developer Mode on  
**So that** I can access audio comparison tools

**Acceptance Criteria:**
- Developer Mode toggle exists in Profile → Settings
- When enabled, shows badge/indicator in header
- Audio resources panel appears below play button

### Story 2: Audio Resources Panel
**As a** user in Developer Mode  
**I want to** see/listen to authentic Hokkien recordings  
**So that** I can learn correct pronunciation

**Acceptance Criteria:**
- Shows list of available audio resources
- Play button next to each phrase (when recording exists)
- Shows "Coming Soon" for phrases without recordings
- Displays recording metadata (speaker, region)

### Story 3: Recording Upload (Future)
**As a** admin  
**I want to** upload Hokkien audio recordings  
**So that** the app has authentic pronunciation samples

**Acceptance Criteria:**
- Admin interface to upload .mp3/.wav files
- Automatic file naming convention
- Alignment with phrase data
- Storage in cloud/CDN (future)

---

## UI Design

### Developer Mode Toggle
```
Profile Screen:
├── [Toggle] Developer Mode
└── ⚠️ Shows advanced tools for testing and audio resources
```

### Audio Resources Panel (New)
```
┌─ Audio Resources ──────────────────────┐
│  🔊 你好 (lí-hó)                      │
│  Speaker: Native Singapore Hokkien   │
│  Region: Singapore                  │
│  [▶ Play] [🔁 Replay]               │
│                                       │
│  Status: ✅ Recording available       │
└───────────────────────────────────────┘
```

---

## Technical Implementation

### Files to Modify

1. **`src/lib/audio-resources.ts`** (NEW)
   - Define audio resource schema
   - Map phrases to audio files
   - Handle playback

2. **`src/components/AudioResourcesPanel.tsx`** (NEW)
   - Display audio resources
   - Play controls
   - Recording status

3. **`src/components/LessonPlayer.tsx`**
   - Replace TTSComparisonPanel with AudioResourcesPanel

4. **`src/lib/config.ts`**
   - Remove OpenAI/ElevenLabs TTS functions
   - Keep Developer Mode functions

---

## Tasks

### P1: Remove TTS Services
- [ ] Delete TTSComparisonPanel.tsx
- [ ] Remove TTS provider selectors from UI
- [ ] Clean up TTS-related code in useAudio.ts
- [ ] Update Settings screen

### P2: Audio Resources Research
- [ ] Research YouTube Hokkien channels
- [ ] Contact/open datasets
- [ ] Evaluate quality and licensing
- [ ] Create list of potential sources

### P3: Audio Resources Panel
- [ ] Create audio-resource.json with available recordings
- [ ] Build AudioResourcesPanel component
- [ ] Integrate into Lesson Player
- [ ] Add recording status indicators

### P4: Recording Workflow (Future)
- [ ] Create admin upload interface
- [ ] Design recording metadata schema
- [ ] Plan community contribution workflow

---

## Success Metrics

1. All Unit 1 phrases have authentic Hokkien recordings
2. Users can hear correct pronunciation
3. Audio quality rated "good" or better by heritage speakers
4. Cost per recording < $0.50 (if paid)

---

## References

### Open Datasets to Research
- [Taiwan Ministry of Education Hokkien Corpus](https:// language.moe.gov.tw)
- [ACQDIV - Asian Language Diversity](https://acdiv.github.io)
- [Common Voice - Taiwanese](https://commonvoice.mozilla.org/zh-TW)

### YouTube Channels to Evaluate
- Hokkien with Steven
- Learn Hokkien Naturally
- SG Dialect Academy

### Commercial Alternatives (Not TTS)
- Simply Learn Hokkien
- Glossika Hokkien
- Pimsleur (if licensing available)

---

## Budget Considerations

| Option | Cost | Time | Quality |
|--------|------|------|---------|
| Manual recording (family) | $0 | 2-4 hours | ⭐⭐⭐⭐⭐ |
| YouTube extraction | $0 | 1-2 days | ⭐⭐⭐ |
| Dataset licensing | TBD | 1-2 weeks | ⭐⭐⭐⭐ |
| Professional studio | $$$$ | 1 week | ⭐⭐⭐⭐⭐ |

**Recommendation:** Start with manual recording from Vincent's family. Authentic, free, emotionally meaningful.
