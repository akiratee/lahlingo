# Hokkien Audio Resources for LahLingo App

Research compiled: February 2025

## Executive Summary

After researching available Hokkien audio resources, this document provides a comprehensive overview of options for pronunciation practice audio in the LahLingo app. **Recommended MVP approach:** Use a combination of community-recorded fallback phrases (quickest to implement) + explore Taiwan Ministry of Education corpus for future expansion.

---

## 1. Open Source Datasets

### 1.1 Taiwan Ministry of Education Hokkien Corpus (台灣教育部閩南語語料庫)

**Status:** ⚠️ RESEARCH IN PROGRESS - Unable to verify current availability

**Historical Information:**
- Known as the "Ministry of Education Southern Min Corpus" (教育部閩南語語料庫)
- Contains thousands of recorded Southern Min (Hokkien) phrases and sentences
- Native speaker recordings from Taiwan
- Part of Taiwan's official language preservation efforts

**Quality Assessment:** ⭐⭐⭐⭐⭐ (5/5) - Professional, standardized recordings
**Licensing:** Likely government-use/educational license - **requires verification**
**Website:** https://www.moe.gov.tw (教育部)

**Notes:**
- This is one of the most authoritative Hokkien resources
- May have restrictions on commercial use
- Contact: Taiwan Ministry of Education language department
- Dataset may be in Traditional Chinese with Pe̍h-ōe-jī romanization

---

### 1.2 Common Voice (Taiwanese Hokkien)

**Status:** ⚠️ RESEARCH IN PROGRESS

**Historical Information:**
- Mozilla's Common Voice project has included Taiwanese Hokkien
- Crowdsourced native speaker recordings
- Text + audio pairs for validation

**Quality Assessment:** ⭐⭐⭐⭐ (4/5) - Good variety, variable quality control
**Licensing:** CC0 (public domain) or CC-BY
**Website:** https://commonvoice.mozilla.org/tw

**Notes:**
- Verify if Taiwanese Hokkien is actively supported
- May have limited vocabulary coverage
- Excellent for accent diversity

---

### 1.3 ACQDIV Asian Language Datasets

**Status:** ⚠️ RESEARCH IN PROGRESS

**Historical Information:**
- Academic corpus for Asian languages
- May include Southern Min recordings
- Research-grade, carefully transcribed

**Quality Assessment:** ⭐⭐⭐⭐ (4/5) - Academic quality
**Licensing:** Academic/research use - **verify commercial terms**
**Source:** ACQDIV project ( universities )

**Notes:**
- Primarily for linguistic research
- May require academic partnership
- Check current project status

---

### 1.4 OpenSLR - Speech Recognition Resources

**Status:** Worth Investigating

**Quality Assessment:** ⭐⭐⭐ (3/5) - Variable quality
**Licensing:** Varies by dataset
**Website:** https://openslr.org

**Notes:**
- May contain Hokkien/Chinese dialect resources
- Often research-focused
- Check individual dataset licenses

---

## 2. YouTube Channels (for Reference Material)

### 2.1 Hokkien with Steven

**Type:** YouTube Educational Channel
**Focus:** Taiwanese Hokkien learning
**Quality Assessment:** ⭐⭐⭐⭐ (4/5)
**Licensing:** YouTube content - **NOT directly usable** (requires permission)

**Notes:**
- Great for curriculum reference
- Contact creator for licensing opportunities
- Natural, conversational Hokkien

---

### 2.2 Learn Hokkien Naturally

**Type:** YouTube Channel
**Focus:** Hokkien language education
**Quality Assessment:** ⭐⭐⭐ (3/5)
**Licensing:** YouTube content - **NOT directly usable**

**Notes:**
- Beginner-friendly content
- May have accent variations (Taiwan vs. Singapore)
- Good phrase examples for curriculum

---

### 2.3 SG Dialect Academy

**Type:** YouTube/Singapore Organization
**Focus:** Singapore Hokkien
**Quality Assessment:** ⭐⭐⭐⭐ (4/5)
**Licensing:** Contact for licensing

**Notes:**
- Singapore variant of Hokkien
- Useful for Singapore-focused content
- May offer educational partnerships

---

### 2.4 Additional YouTube Resources

- **Hokkien Maestro** - Taiwanese Hokkien lessons
- **Taiwanese Language Academy** - Academic approach
- **Dialects of Singapore** - Singapore variants

**General YouTube Notes:**
- ⚠️ YouTube audio cannot be legally used without explicit permission
- Can serve as reference for pronunciation verification
- May have creators open to licensing deals

---

## 3. Commercial Options

### 3.1 Simply Learn Hokkien (App)

**Type:** Mobile Application
**Quality Assessment:** ⭐⭐⭐ (3/5)
**Licensing:** Proprietary - **unlikely to license**
**Website:** Various app stores

**Notes:**
- Basic phrases and vocabulary
- Limited for advanced use
- Not suitable for licensing

---

### 3.2 Glossika Hokkien

**Type:** Language Learning Platform
**Quality Assessment:** ⭐⭐⭐⭐ (4/5)
**Licensing:** Proprietary subscription - **unlikely to license**
**Website:** glossika.com

**Notes:**
- High-quality native recordings
- Extensive corpus
- Focus on natural speech patterns
- Subscription model, not a licensing partner

---

### 3.3 Pimsleur (Hokkien)

**Type:** Audio Language Course
**Status:** Limited availability
**Quality Assessment:** ⭐⭐⭐⭐ (4/5)
**Licensing:** Proprietary - **unlikely to license**

**Notes:**
- Professional studio recordings
- Focus on practical conversation
- Copyright protected

---

### 3.4 Other Commercial Apps

- **iTranslate** - May have Hokkien audio
- **TripLingo** - Dialect options
- **Drops** - Visual language learning

**Summary:** Commercial apps are **NOT viable** for licensing - their content is proprietary.

---

## 4. User-Generated / Community Options

### 4.1 Recommended MVP Approach: Community Recording

**Strategy:** Record phrases from Vincent's family/friends

**Quality Assessment:** ⭐⭐⭐⭐ (4/5) - Authentic, personal touch
**Licensing:** Owned/controlled by LahLingo
**Timeline:** 1-2 weeks for MVP phrases

**Process:**
1. Create recording script (top 100-200 phrases)
2. Brief volunteer speakers on quality standards
3. Record using phone or better microphone
4. Basic audio processing (normalization, trimming)
5. Store with proper metadata

**Benefits:**
- Authentic, natural Hokkien
- Control over content and quality
- No licensing costs
- Can grow over time

---

### 4.2 Diaspora Community Resources

**Options:**
- Local Hokkien community groups
- Church groups (many have Hokkien services)
- Cultural associations
- Facebook groups (Taiwanese/Singapore Hokkien communities)

**Approach:**
- Post recruitment call
- Offer app credit or recognition
- Record sessions (in-person or remote)

---

### 4.3 University Linguistics Departments

**Institutions to Contact:**
- National Taiwan University (台灣大學)
- National Chengchi University (政治大學)
- Universities with Asian studies programs

**Benefits:**
- Access to student researchers
- Potential academic partnerships
- Quality volunteer speakers

---

## 5. Technical Implementation Notes

### 5.1 Recommended Audio Specifications

| Parameter | Specification |
|-----------|---------------|
| Format | MP3 or WAV |
| Sample Rate | 44.1 kHz |
| Bitrate | 128-192 kbps (MP3) |
| Duration | 2-5 seconds per phrase |
| Normalization | -3dB LUFS |

### 5.2 Recording Setup (Community)

**Minimum Equipment:**
- Quiet room (minimal echo)
- USB microphone ($30-100) or smartphone
- Recording app (Audacity, GarageBand, Voice Recorder)

**Best Practices:**
- Consistent volume across all recordings
- Clear pronunciation
- Brief pause before/after each phrase
- Save with consistent naming convention

---

## 6. Action Items for MVP

### Immediate Next Steps

1. **Week 1:** Contact 3-5 potential community volunteers (family/friends)
2. **Week 1:** Create phrase list (top 100 survival phrases)
3. **Week 2:** Conduct recording sessions
4. **Week 2:** Audio processing and integration

### Future Expansion (Post-MVP)

1. Research Taiwan Ministry of Education corpus licensing
2. Explore academic partnerships
3. Build community contributor platform
4. Consider AI TTS options (elevenlabs, azure neural voices - limited Hokkien support)

---

## 7. Resource Summary Table

| Resource | Quality | Licensing | Recommended |
|----------|---------|-----------|-------------|
| Community Recordings | ⭐⭐⭐⭐ | Owned | ✅ YES (MVP) |
| Taiwan MoE Corpus | ⭐⭐⭐⭐⭐ | Verify | Future |
| Common Voice TW | ⭐⭐⭐⭐ | CC0 | ✅ YES (verify) |
| YouTube Channels | ⭐⭐⭐⭐ | Permission req. | Reference only |
| Commercial Apps | ⭐⭐⭐⭐ | Proprietary | ❌ No |
| ACQDIV | ⭐⭐⭐⭐ | Academic | Future |

---

## 8. Key Contacts & Links

### To Research Further
- Taiwan Ministry of Education: https://www.moe.gov.tw
- Common Voice: https://commonvoice.mozilla.org
- Mozilla Taiwan: community involvement

### Community Channels
- Facebook: "Taiwanese Language" groups
- Reddit: r/linguistics, r/taiwan
- Discord: Language learning servers

---

## Conclusion

**For the LahLingo MVP, the most practical approach is community-recorded audio.** This provides:
- Authentic Hokkien pronunciation
- Full control and ownership
- Quick implementation timeline
- Zero licensing concerns

After MVP launch, explore formal datasets (Taiwan MoE, Common Voice) for expansion and consider building a community contribution system for long-term growth.

---

*Document prepared for LahLingo Dialect App development*
*Last updated: February 2025*
