# Dialect Master - Technical Architecture

## Executive Summary

After evaluating multiple architectural approaches, this document presents three options ranging from minimal-viable to scalable, with a **recommended approach** for the MVP and future scaling path.

---

## Architecture Options Overview

| Aspect | Option A: Pure Web (PWA) | Option B: Cross-Platform Mobile | Option C: Native Mobile |
|--------|-------------------------|--------------------------------|------------------------|
| **Tech Stack** | Next.js + React | React Native + Supabase | Swift/Kotlin + Backend |
| **Initial Dev Time** | 4-6 weeks | 8-12 weeks | 16-20 weeks |
| **Cost (MVP)** | $2-5K | $8-15K | $30-50K |
| **Platforms** | Web + Mobile browser | iOS + Android | iOS or Android only |
| **Audio Quality** | Good | Good | Excellent |
| **Offline Support** | Limited | Good | Excellent |
| **Speech Recognition** | Web Speech API | Native + Cloud | Native SDK |
| **Maintenance** | Easy | Medium | Harder |

---

## Detailed Analysis

### 1. Platform Decision: Web vs Mobile App

#### Option A: Progressive Web App (PWA)
**Approach**: Build with Next.js, deploy as PWA, works on all devices via browser

**Pros**:
- ✅ Single codebase for all platforms
- ✅ Instant deployment (no app store review)
- ✅ Easy updates (users always have latest version)
- ✅ Lower development cost
- ✅ Good for MVP validation
- ✅ SEO-friendly if public content added later
- ✅ Can add native-like features via PWA (offline, notifications)

**Cons**:
- ❌ Limited offline functionality
- ❌ No access to some native APIs
- ❌ Speech recognition quality varies by browser
- ❌ Requires browser (not "real app" experience)
- ❌ Discoverability lower (not in app stores)
- ❌ iOS PWA has limitations (no push notifications)

**Best For**: MVP validation, limited budget, web-first approach

#### Option B: React Native (Cross-Platform)
**Approach**: Single JavaScript codebase, compiles to native iOS/Android apps

**Pros**:
- ✅ True mobile app experience
- ✅ Access to native device features (microphone, speech)
- ✅ Offline-first architecture possible
- ✅ App store distribution (discoverability)
- ✅ Push notifications
- ✅ Cross-platform with 80-90% code sharing
- ✅ Large talent pool for hiring

**Cons**:
- ❌ More complex than web
- ❌ Third-party library dependencies
- ❌ Some platform-specific code needed
- ❌ App store review process
- ❌ Higher initial cost

**Best For**: Production app, broad user base, offline priority

#### Option C: Native Development (Swift/Kotlin)
**Approach**: Platform-specific native apps (iOS AND Android = 2 codebases)

**Pros**:
- ✅ Best performance and UX
- ✅ Full access to platform features
- ✅ Optimal speech recognition
- ✅ Platform-convention UI
- ✅ Best offline experience

**Cons**:
- ❌ 2x development cost
- ❌ 2x maintenance burden
- ❌ Longest time to market
- ❌ Smaller talent pool

**Best For**: Enterprise apps, performance-critical, unlimited budget

### 2. Backend Architecture

#### Option 1: Serverless (Vercel + Supabase/Firebase)
**Stack**: Vercel (frontend) + Supabase (database + auth + storage)

**Architecture Diagram**:
```
┌─────────────────────────────────────────────────┐
│                   User Device                     │
│  (PWA or React Native App)                      │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│              Vercel / Netlify                     │
│  (Next.js API Routes + Static Hosting)          │
│                                                 │
│  - Lesson content delivery                       │
│  - Progress tracking                             │
│  - User authentication                          │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│   Supabase    │   │   Supabase   │
│   Database    │   │   Storage    │
│  (PostgreSQL) │   │  (Audio/Imgs)│
└───────────────┘   └───────────────┘
```

**Pros**:
- ✅ Zero server management
- ✅ Automatic scaling
- ✅ Pay-per-use (cheap for MVP)
- ✅ Built-in auth, database, storage
- ✅ Supabase has generous free tier

**Cons**:
- ❌ Cold starts (slower initial response)
- ❌ Vendor lock-in
- ❌ Limited compute (though sufficient for this app)
- ❌ Database connection limits on free tier

**Cost Estimate (MVP)**:
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- **Total**: ~$45/month

#### Option 2: Managed Backend (Railway/Render + Supabase)

**Architecture**:
```
User Device → Railway/Render (Node.js API) → Supabase (DB)
```

**Pros**:
- ✅ More control over API logic
- ✅ No cold starts
- ✅ Cron jobs for analytics
- ✅ Still managed (no server运维)

**Cons**:
- ❌ Slightly more complex
- ❌ Higher cost than pure serverless
- ❌ Still need separate auth/DB service

**Cost Estimate**:
- Railway Pro: $19/month
- Supabase Pro: $25/month
- **Total**: ~$44/month

#### Option 3: Self-Hosted (Docker + VPS)

**Architecture**:
```
User Device → VPS (Docker) → PostgreSQL + Redis
```

**Pros**:
- ✅ Full control
- ✅ No vendor lock-in
- ✅ Can run complex background jobs
- ✅ Cheaper at scale

**Cons**:
- ❌ Server management required
- ❌ Security patching
- ❌ Backup responsibility
- ❌ Infrastructure complexity

**Cost Estimate**:
- DigitalOcean VPS ($24-48/month) + maintenance

### 3. Database Design

#### Recommended: PostgreSQL (via Supabase)

**Schema Overview**:
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  settings JSONB DEFAULT '{}'
);

-- Progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  dialect TEXT NOT NULL,
  unit_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP DEFAULT NOW(),
  score JSONB DEFAULT '{}'
);

-- Lesson content (admin-editable)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dialect TEXT NOT NULL,
  unit_id INTEGER NOT NULL,
  lesson_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,  -- Full lesson structure
  audio_urls JSONB,         -- Audio file references
  published BOOLEAN DEFAULT FALSE
);

-- User achievements
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  achievement_key TEXT NOT NULL,
  earned_at TIMESTAMP DEFAULT NOW()
);
```

**Pros of PostgreSQL**:
- ✅ Relational data (users → progress → achievements)
- ✅ JSONB for flexible content storage
- ✅ Supabase provides nice admin UI
- ✅ Strong typing for queries
- ✅ Row-level security (RLS) for data protection

**Cons**:
- ❌ Schema migrations needed
- ❌ Learning curve for SQL

### 4. Audio Infrastructure

#### Storage: Supabase Storage or Cloudflare R2

**Option A: Supabase Storage**
- Simple S3-compatible API
- Integrated with Supabase auth
- Free tier: 1GB audio storage
- Paid: ~$0.02/GB

**Option B: Cloudflare R2**
- No egress fees
- Excellent CDN
- S3-compatible API
- Free tier: 10GB

**Recommendation**: Start with Supabase Storage (simpler), migrate to R2 if scale

#### Audio Delivery Strategy
```
Content Flow:
1. Admin uploads audio files → Supabase Storage
2. CDN caches globally
3. App downloads audio on:
   - First load (lazy)
   - Background (when on WiFi)
   - Preload next lesson
```

**Audio Format**:
- Format: WebM (browser) + M4A (iOS)
- Quality: 128kbps (sufficient for speech)
- Metadata: Include tone markers, speaker ID

### 5. Speech Recognition Options

#### Option A: Web Speech API (Browser Native)
```
Pros: Free, no backend needed, works offline
Cons: Quality varies, no dialect support, Chrome only
Accuracy: 70-80% for clear speech
```

#### Option B: OpenAI Whisper (Cloud API)
```
Pros: High accuracy, supports multiple languages, cheap
Cons: Latency, cost per request, no real-time
Accuracy: 90-95% for clean speech
Cost: $0.006/minute
```

#### Option C: Azure Speech Services
```
Pros: Dialect-specific models possible, real-time
Cons: Expensive, complex setup
Accuracy: 85-92%
Cost: $1/hour
```

#### Option D: Device Native (iOS/Android)
```
Pros: No internet needed, fast, good for offline
Cons: No dialect training, platform-specific
Accuracy: 80-85%
```

**Recommendation**:
- **MVP**: Web Speech API (free, good enough)
- **V1.1**: Add Whisper API as optional upgrade
- **V2.0**: Build custom dialect model if scale justifies

### 6. Content Management System

#### Admin Interface Requirements

**Needs**:
1. Create/edit/Publish lessons
2. Upload audio files
3. Track lesson analytics
4. Manage user accounts (if needed)
5. A/B test content

#### Options

**Option A: Supabase Studio + Manual JSON**
```
Approach: Edit JSON files, upload via Supabase dashboard
Pros: Simple, no custom admin needed
Cons: Error-prone, no validation
Best For: MVP
```

**Option B: Custom Admin Panel**
```
Approach: Build admin interface in same Next.js app
Pros: Full control, validation, preview
Cons: Development time (~1-2 weeks)
Best For: V1.0+
```

**Option C: Headless CMS (Strapi/Keystatic)**
```
Approach: Use external CMS for content
Pros: Rich editing, media management
Cons: Extra infrastructure, learning curve
Best For: Scale
```

**Recommendation**: Start with Option A (manual JSON), build Option B for V1.0

---

## Recommended Architecture

### MVP (Version 1.0)

```
┌──────────────────────────────────────────────────────────┐
│                    Architecture Stack                     │
├──────────────────────────────────────────────────────────┤
│  Frontend:     Next.js 14 (React) + TypeScript         │
│  Styling:      Tailwind CSS + shadcn/ui                 │
│  PWA:          next-pwa for offline support             │
│  Backend:      Next.js API Routes                        │
│  Database:     Supabase (PostgreSQL)                     │
│  Auth:         Supabase Auth                             │
│  Storage:      Supabase Storage (audio files)             │
│  Hosting:      Vercel                                    │
│  Speech:       Web Speech API (browser native)          │
│  Analytics:    Vercel Analytics                          │
└──────────────────────────────────────────────────────────┘
```

### V1.1 (Add Features)

```
+ Add: OpenAI Whisper API for pronunciation scoring
+ Add: React Native wrapper (Expo) for mobile app
+ Add: Custom admin panel for content management
```

### V2.0 (Scale)

```
+ Migrate to: React Native standalone app
+ Add: Cloudflare R2 for audio storage (cost optimization)
+ Add: Custom speech recognition model for dialects
+ Add: Real-time features (conversation practice)
```

---

## Step-by-Step Implementation Plan

### Phase 1: Foundation (Weeks 1-2)
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up Supabase project
- [ ] Create database schema
- [ ] Implement authentication flow
- [ ] Build basic UI components

### Phase 2: Core Features (Weeks 3-4)
- [ ] Build lesson player UI
- [ ] Implement audio playback with slow mode
- [ ] Create tone visualization component
- [ ] Build progress tracking system
- [ ] Add XP and achievement system
- [ ] Implement unit/lesson navigation

### Phase 3: Content Integration (Weeks 5-6)
- [ ] Upload lesson content (JSON)
- [ ] Upload audio files to Supabase Storage
- [ ] Create unit/lesson data structure
- [ ] Add pronunciation practice module
- [ ] Build cultural notes section
- [ ] QA all content

### Phase 4: Polish (Weeks 7-8)
- [ ] Add PWA features (offline mode)
- [ ] Implement streak tracking
- [ ] Add achievements UI
- [ ] Build user profile page
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] App store submission (optional)

---

## Cost Breakdown

### Monthly Costs (MVP)

| Service | Free Tier | Usage | Cost |
|---------|-----------|-------|------|
| Vercel | $0 | Pro tier | $20 |
| Supabase | $0 | Pro tier | $25 |
| Domain (Cloudflare) | $0 | 2 domains | $0 |
| Speech API | $0 | Web Speech (free) | $0 |
| **Total** | | | **$45/month** |

### Growth Costs (10,000 users)

| Service | Cost |
|---------|------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Whisper API | ~$50/month (假设用户每月使用1000分钟) |
| Cloudflare R2 | ~$10 |
| **Total** | **$105/month** |

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Speech recognition quality poor | Medium | High | Use Whisper API; manual fallback option |
| Content creation bottleneck | High | High | Build efficient content pipeline; crowdsource |
| User retention low | High | Medium | Focus on gamification; community features |
| Supabase limits hit | Low | Medium | Plan migration to R2 + separate DB |
| PWA insufficient for UX | Medium | Medium | Plan React Native migration early |

---

## Final Recommendation

### For MVP: **Option A (Pure Web/PWA)**

**Rationale**:
1. **Validate first**: Prove content/product fit before investing in native app
2. **Speed to market**: Launch in 6-8 weeks vs 12-16 weeks for native
3. **Cost efficiency**: $45/month vs $500+/month for native
4. **Flexibility**: Easy to iterate based on user feedback
5. **Sufficient UX**: PWA can deliver 90% of needed experience

**When to migrate to React Native**:
- Hit 10,000 active users
- User feedback demands native app features
- Retention metrics prove product-market fit

**Technology Selection**:
- **Frontend**: Next.js 14 + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **Hosting**: Vercel
- **Speech**: Web Speech API (free, MVP)
- **CMS**: JSON files + Supabase Admin UI

**Confidence Level**: High (80%+) for MVP success

---

## Appendix: Alternative Stack Comparison

### Full-Stack Comparison Table

| Stack | Learning Curve | Dev Speed | Performance | Community | Hiring |
|-------|---------------|-----------|-------------|-----------|--------|
| Next.js + Supabase | Easy | Fast | Good | Large | Easy |
| Remix + Prisma | Medium | Fast | Good | Medium | Medium |
| Vue/Nuxt + Supabase | Easy | Fast | Good | Medium | Easy |
| React Native + Expo | Medium | Medium | Good | Large | Medium |
| Flutter | Steep | Medium | Excellent | Growing | Medium |

### Supabase Alternatives

| Service | Pros | Cons | Cost |
|---------|------|------|------|
| Firebase | Larger ecosystem | Google lock-in | Similar |
| PocketBase | Self-hosted option | Newer, less stable | Free |
| Appwrite | Self-hosted option | Smaller community | Similar |
| Convex | Type-safe end-to-end | Less flexible | Similar |

### Conclusion: Next.js + Supabase is optimal for this project due to:
1. Large community and documentation
2. TypeScript support throughout
3. Supabase's generous free tier
4. Easy developer experience
5. Quickest path to functional MVP
