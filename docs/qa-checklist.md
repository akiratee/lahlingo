# Dialect App QA Checklist

## Version: 1.0
## Last Updated: 2026-02-16
## QA Lead: Dan

---

## Pre-Flight Checklist

- [ ] All features from previous release tested and passing
- [ ] No critical bugs pending
- [ ] Test environment matches production
- [ ] Test data prepared

---

## Regression Testing (Every Release)

### Onboarding Flow
- [ ] New user sees welcome screen
- [ ] Can select dialect (Hokkien, Teochew, Cantonese, Hakka)
- [ ] Can select level (Beginner, Intermediate, Advanced)
- [ ] Can enter name
- [ ] Can set daily goal
- [ ] Profile saves correctly
- [ ] Redirects to home after completion

### Home Dashboard
- [ ] Shows correct streak count
- [ ] Shows correct XP and level
- [ ] Shows unit progress
- [ ] Weekly activity chart renders
- [ ] "Continue Learning" button works
- [ ] Unit cards clickable and navigate correctly
- [ ] Profile button navigates to profile

### Profile Screen
- [ ] Shows user stats (XP, level, streak)
- [ ] Dialect selector works
- [ ] Achievements display correctly
- [ ] Settings button works
- [ ] Reset progress works (danger zone)

### Settings Screen
- [ ] TTS provider toggle works
- [ ] API key saves for OpenAI TTS
- [ ] Voice selection saves
- [ ] Speed slider works
- [ ] Test TTS button works
- [ ] Provider comparison feature works

### Lesson Player - Vocabulary
- [ ] Navigation between phrases works
- [ ] Progress bar updates
- [ ] Play button triggers audio
- [ ] Audio feedback shows (playing/loading)
- [ ] Microphone button works
- [ ] Speech recognition feedback shows
- [ ] Match percentage displays
- [ ] Previous/Next buttons work
- [ ] Exit button works

### Lesson Player - Dialogue
- [ ] Dialogue lines display correctly
- [ ] Audio plays for each line
- [ ] Progress tracking works
- [ ] Navigation works

### Lesson Player - Quiz
- [ ] Questions display correctly
- [ ] Option selection works
- [ ] Progress updates
- [ ] Score calculation correct
- [ ] Results screen shows correct feedback

### Completion Flow
- [ ] XP awarded correctly
- [ ] Quiz score displayed
- [ ] Cultural note shows
- [ ] "Next Lesson" button works
- [ ] "Return Home" button works

### TTS Providers
- [ ] Browser TTS works
- [ ] OpenAI TTS works (if API key set)
- [ ] Audio quality acceptable
- [ ] Loading states show correctly
- [ ] Error handling works

---

## New Feature Testing Template

Feature: _____________

### Happy Path
- [ ] Main user flow works
- [ ] All buttons clickable
- [ ] Navigation works
- [ ] Data saves correctly

### Edge Cases
- [ ] Empty inputs handled
- [ ] Invalid data handled
- [ ] Network errors handled
- [ ] Loading states show
- [ ] Error messages helpful

### Cross-Platform
- [ ] Desktop view works
- [ ] Mobile view works
- [ ] Dark mode works
- [ ] Light mode works

---

## Bug Report Template

**Title:** [Bug] Brief description

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. Step one
2. Step two
3. ...

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
Attach here

**Browser/OS:**
Chrome / Firefox / Safari
Windows / macOS / iOS / Android

**Environment:**
- App version: 
- Build date:
- Test data:

---

## Test Data

### User Profiles
- Test User 1: Beginner, Hokkien, 5 day streak
- Test User 2: Intermediate, Teochew, 0 streak
- Test User 3: Advanced, Cantonese, 10 day streak

### Lessons to Test
- Unit 1, Lesson 1: Basic Greetings
- Unit 1, Lesson 5: Unit Review
- Unit 2, Lesson 1: Numbers 1-10

---

## Release Checklist

Before each release:
- [ ] All regression tests pass
- [ ] New feature tests pass
- [ ] No critical bugs
- [ ] Build succeeds
- [ ] Tests pass locally
- [ ] Code reviewed
- [ ] Deployed to staging
- [ ] Staging tested
- [ ] Ready for production

---

## Notes

- Browser TTS quality varies by browser
- OpenAI TTS requires API key
- Speech recognition requires microphone permission
- Mobile testing important (responsive design)
