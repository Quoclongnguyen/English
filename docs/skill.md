# 📱 LEXIS English — Project Master File

> **Mục tiêu:** Ứng dụng học tiếng Anh toàn diện trên mobile (iOS & Android)
> **Tech Stack:** React Native (Expo) · TypeScript · Node.js · MongoDB
> **Trạng thái dự án:** 🟡 Khởi động — Giai đoạn lên kế hoạch
> **Cập nhật lần cuối:** 2026-05-21

---

## 🗺️ Hướng Dẫn Đọc File Này

File này dùng để AI theo dõi toàn bộ dự án.
**Mỗi khi bắt đầu cuộc trò chuyện mới, paste file này vào trước.**

**Quy ước trạng thái:**
| Ký hiệu | Ý nghĩa |
|---|---|
| ✅ | Hoàn thành |
| 🔄 | Đang làm |
| 🔲 | Chưa bắt đầu |
| ❌ | Tạm hoãn / Bỏ |

---

## 🛠️ Tech Stack

### Mobile (Frontend)
- **Framework:** React Native + Expo SDK
- **Language:** TypeScript
- **Navigation:** React Navigation v6
- **State Management:** Zustand
- **Animations:** React Native Reanimated 3
- **Audio (TTS + playback):** Expo AV + Expo Speech
- **Camera:** Expo Camera + Expo Image Picker
- **Notifications:** Expo Notifications
- **Storage (local):** AsyncStorage

### Backend
- **Runtime:** Node.js + Express
- **Language:** TypeScript
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + Refresh Token + Google OAuth + Apple Sign In
- **Cloud Storage:** Cloudinary (audio, images)
- **AI:** Gemini API (Google) — sinh từ vựng, story, Vision, giải thích

### DevOps / Tools
- **IDE:** Google Antigravity
- **Version Control:** Git + GitHub
- **Package Manager:** npm
- **Deployment Backend:** Railway / Render

---

## 📁 Cấu Trúc Thư Mục

```
English/
├── docs/
│   ├── skill.md              ← File AI đọc mỗi đầu chat (file này)
│   ├── PRD.md                ← Toàn bộ tính năng đã phân tích
│   ├── DESIGN.md             ← Design system, màu sắc, font
│   ├── API.md                ← Tất cả API endpoints
│   └── CHANGELOG.md          ← Log mỗi lần làm xong gì
├── mobile/
│   ├── src/
│   │   ├── screens/          ← Các màn hình
│   │   ├── components/       ← Components tái sử dụng
│   │   ├── navigation/       ← Cấu hình navigation
│   │   ├── stores/           ← Zustand stores
│   │   ├── hooks/            ← Custom hooks
│   │   ├── services/         ← API calls + Gemini
│   │   ├── utils/            ← SM-2, helpers
│   │   ├── constants/        ← Colors, fonts, routes
│   │   └── types/            ← TypeScript types
│   ├── assets/
│   │   ├── images/
│   │   ├── sounds/
│   │   └── animations/       ← Lottie files
│   └── app.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── services/         ← Gemini service, SM-2
│   │   └── utils/
│   └── package.json
```

---

## 🎨 Design System

> Chi tiết màu sắc (HEX) và font chữ, vui lòng xem tại file: **`docs/DESIGN.md`**

---

## 🎯 Yêu Cầu Sản Phẩm (PRD)

> Bao gồm Tính Năng, Screens, Data Models (MongoDB) và Giới Hạn Phạm Vi.
> Chi tiết toàn bộ yêu cầu dự án xem tại file: **`docs/PRD.md`**

---

## 🔌 API & Prompt Templates

> Danh sách toàn bộ Endpoint của Backend và Template gửi cho Gemini.
> Chi tiết xem tại file: **`docs/API.md`**

---

## 📅 Lộ Trình Phát Triển

> Mỗi task = 1 PR / 1 commit rõ ràng. Tick ✅ khi xong, ghi vào CHANGELOG.md.

---

### 🏗️ Phase 1 — Foundation (Tháng 1)

#### 1.1 Setup Project
- ✅ `npx create-expo-app mobile --template expo-template-blank-typescript`
- ✅ Cài dependencies: React Navigation, Zustand, Reanimated 3, AsyncStorage
- ✅ Cấu hình ESLint + Prettier
- ✅ Setup folder structure theo cây thư mục ở trên

#### 1.2 Design System
- ✅ File `constants/colors.ts` — toàn bộ bảng màu hex
- ✅ File `constants/typography.ts` — font Nunito + Space Mono
- ✅ Component `Button` (primary / secondary / ghost)
- ✅ Component `Card` (bo tròn, shadow)
- ✅ Component `Badge` (level badge, status label)
- ✅ Dark / Light theme provider

#### 1.3 Backend Setup
- ✅ `npm init` + cài Express, Mongoose, TypeScript, dotenv
- ✅ Kết nối MongoDB Atlas (code ready, cần điền `MONGODB_URI` thật vào `.env`)
- ✅ Model `User` + index
- ✅ `POST /api/auth/register` — hash password bcrypt
- ✅ `POST /api/auth/login` — trả JWT + Refresh Token
- ✅ `POST /api/auth/refresh` — cấp lại access token
- ✅ `GET /api/auth/me` — middleware xác thực
- 🔲 Google OAuth (`passport-google-oauth20`) — tạm hoãn

#### 1.4 Auth Screens (Mobile)
- 🔄 `SplashScreen` — logo LEXIS + animation fade in
- 🔄 `LoginScreen` — nút Google / Apple / Email
- 🔄 `RegisterScreen` — form email + password
- ✅ Zustand `authStore` — lưu token, user info
- ✅ Axios interceptor — tự refresh token khi hết hạn
- ✅ `src/services/authService.ts` — wrap API calls
- ✅ `src/navigation/AuthNavigator.tsx` — Stack navigator
- 🔄 `src/navigation/AppNavigator.tsx` — Bottom Tab navigator
- 🔄 `src/navigation/index.tsx` — Root Navigator (Auth/App switch)

#### 1.5 Onboarding
- 🔲 `OnboardingGoalScreen` — chọn mục tiêu (4 lựa chọn)
- 🔲 `OnboardingTargetScreen` — chọn 5 / 7 / 10 từ/ngày
- 🔲 `PlacementTestScreen` — 5 câu MCQ tăng dần độ khó
- 🔲 `PlacementResultScreen` — hiển thị level + lộ trình
- 🔲 API `POST /api/onboarding/placement-result`
- 🔲 Logic: chỉ show onboarding 1 lần (lưu AsyncStorage)

#### 1.6 Home Dashboard
- 🔲 `HomeScreen` layout: header streak, daily goal ring, module grid
- 🔲 Component `StreakBanner` — hiển thị streak + flame icon
- 🔲 Component `DailyGoalRing` — vòng tròn progress animated
- 🔲 Component `ModuleCard` — 5 module (Vocab, Camera, Listen, Read, Grammar)

---

### 📚 Phase 2 — Vocabulary Core (Tháng 2)
- 🔲 Daily Vocab + Gemini API integration
- 🔲 Flashcard screen (lật 3D + TTS)
- 🔲 SM-2 algorithm
- 🔲 Review Quiz (3 dạng + giải thích sai/đúng)
- 🔲 Vocab Bank + status labels
- 🔲 Streak + XP + Notifications

### Phase 3 — Differentiator (Tháng 3)
- 🔲 Camera Vocabulary (Gemini Vision + checklist)
- 🔲 Photo Deck
- 🔲 Streak Freeze
- 🔲 Milestone Badges
- 🔲 Profile + Progress screens

### Phase 4 — Content (Tháng 4–5)
- 🔲 Listening module (player + transcript + tap-to-save)
- 🔲 Reading module (song ngữ + AI explain + summary)
- 🔲 Grammar module (theory + exercise + giải thích sai)
- 🔲 Beta test với real users

### Phase 5 — Launch (Tháng 6)
- 🔲 Bug fixes + performance
- 🔲 App Store submission (iOS)
- 🔲 Google Play submission (Android)

---

## 📝 Quyết Định Quan Trọng

| Ngày | Quyết định |
|---|---|
| 2026-05-21 | Dùng MongoDB thay Supabase — quen thuộc hơn |
| 2026-05-21 | Dùng Gemini API (free) thay OpenAI/Claude |
| 2026-05-21 | IDE: Google Antigravity |
| 2026-05-21 | Khi quiz sai: BẮT BUỘC giải thích tại sao sai + đáp án đúng |
| 2026-05-21 | Camera vocab dùng checklist filter — không auto-save |
| 2026-05-21 | Design: Bold & Playful, Dark + Light mode |

---

## 🐛 Known Issues

*(Chưa có — dự án chưa bắt đầu code)*

---

## 🔗 Tài Liệu Tham Khảo

- [Expo Docs](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [SM-2 Algorithm](https://www.supermemo.com/en/archives1990-2015/english/ol/sm2)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Google Antigravity](https://antigravity.google.com)



---

# 🤖 AI Working Rules

## Before Coding
Always read:
1. docs/skill.md
2. docs/PRD.md
3. docs/DESIGN.md
4. docs/API.md

before generating code.

---

## Coding Rules

- Use TypeScript only
- Functional components only
- No inline styles
- Reusable components
- Reusable hooks
- Keep components small
- Feature-based architecture
- Avoid duplicated code
- Use absolute imports
- Use Zustand for global state
- Follow existing folder structure

---

## Output Rules

When generating code:
- Explain important decisions briefly
- Separate files clearly
- Include TypeScript types
- Avoid overengineering
- Prioritize maintainability

---

## Important

Do NOT:
- change architecture without approval
- introduce Redux
- introduce unnecessary libraries
- generate giant files (>300 lines) unless necessary