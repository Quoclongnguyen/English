# 📱 LEXIS English — Project Master File

> **Mục tiêu:** Ứng dụng học tiếng Anh toàn diện trên mobile (iOS & Android)
> **Tech Stack:** React Native (Expo) · TypeScript · Node.js · MongoDB
> **Trạng thái dự án:** 🟡 Phase 1 đang thực hiện
> **Cập nhật lần cuối:** 2026-06-03

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
└── admin/                    ← Web app quản trị (React)
    ├── src/
    │   ├── pages/            ← Dashboard, Users, Vocab, Lessons...
    │   ├── components/       ← Shared UI components
    │   ├── services/         ← API calls đến backend
    │   ├── stores/           ← Zustand stores (auth, filters)
    │   └── types/            ← TypeScript types
    └── package.json
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
- ✅ Kết nối MongoDB Atlas
- ✅ Model `User` + index
- ✅ `POST /api/auth/register` — hash password bcrypt
- ✅ `POST /api/auth/login` — trả JWT + Refresh Token
- ✅ `POST /api/auth/refresh` — cấp lại access token
- ✅ `GET /api/auth/me` — middleware xác thực
- ✅ Test API thủ công: Register `201`, Login `200`, Me `200`
- 🔲 Google OAuth (`passport-google-oauth20`) — tạm hoãn

#### 1.4 Auth Screens (Mobile)
- ✅ `SplashScreen` — logo LEXIS + animation fade in
- ✅ `LoginScreen` — hero LEXIS + nút Apple / Google / Email, form email/password
- ✅ `RegisterScreen` — hero LEXIS + nút Apple / Google / Email, form email/password
- ✅ Zustand `authStore` — lưu token, user info
- ✅ Axios interceptor — tự refresh token khi hết hạn
- ✅ `src/services/authService.ts` — wrap API calls
- ✅ `src/navigation/AuthNavigator.tsx` — Stack navigator
- ✅ `src/navigation/AppNavigator.tsx` — Bottom Tab navigator
- ✅ `src/navigation/index.tsx` — Root Navigator (Auth/App switch)

#### 1.5 Onboarding
- ✅ `OnboardingGoalScreen` — chọn mục tiêu (4 lựa chọn)
- ✅ `OnboardingTargetScreen` — chọn 5 / 7 / 10 từ/ngày
- ✅ `PlacementTestScreen` — 5 câu MCQ tăng dần độ khó
- ✅ `PlacementResultScreen` — hiển thị level + lộ trình
- ✅ API `POST /api/onboarding/placement-result`
- ✅ Logic: chỉ show onboarding 1 lần (lưu AsyncStorage)

#### 1.6 Home Dashboard
- 🔄 `HomeScreen` layout: header streak, daily goal ring, module grid
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
5. docs/CHANGELOG.md  ← Check trước để biết đang làm đến đâu, tránh làm lại

before generating code.

Then follow **Git Workflow** below before writing any code.

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
- write Admin code inside /mobile/ or vice versa — Admin web app nằm trong /admin/

---

## Extra Rules

- Check CHANGELOG.md trước khi code để biết đã làm gì rồi, tránh làm lại
- Sau khi xong mỗi task, đề xuất update CHANGELOG.md
- Admin web app nằm trong /admin/, không lẫn với /mobile/
- Admin dùng design riêng: font Geist, Dark only, Minimal & data-dense (xem DESIGN.md Section 6)

---

## 🌿 Git Workflow (Bắt buộc cho mọi task)

### Quy tắc
Mỗi task / nhiệm vụ = 1 branch riêng. **Không code trực tiếp trên `main`.**

### Quy ước đặt tên branch
```
feat/<tên-tính-năng>      ← Tính năng mới
fix/<mô-tả-bug>           ← Sửa bug
chore/<việc-khác>         ← Config, docs, refactor
admin/<tên-module>        ← Riêng cho Admin web app
```

Ví dụ:
- `feat/auth-screens` — làm Login/Register Screen
- `feat/daily-vocab` — làm Daily Vocabulary
- `admin/dashboard` — làm Admin Dashboard
- `fix/refresh-token-loop` — sửa lỗi refresh token

### Quy trình cụ thể

**Bước 1 — Trước khi bắt đầu:**
```bash
git checkout main
git pull origin main
git checkout -b feat/<tên-task>
```

**Bước 2 — Trong quá trình làm, commit thường xuyên:**
```bash
git add .
git commit -m "<loại>(<scope>): <mô tả>"
```

Ví dụ commit message:
- `feat(auth): add LoginScreen with email/password form`
- `feat(vocab): implement SM-2 spaced repetition algorithm`
- `fix(api): handle 401 refresh token loop`
- `chore(docs): update CHANGELOG.md`

**Bước 3 — Sau khi xong task:**
```bash
git add .
git commit -m "chore(docs): update CHANGELOG.md"
git push origin feat/<tên-task>
```

> ✅ Sau đó tạo Pull Request trên GitHub và merge vào `main`.

### Lưu ý quan trọng
- **Luôn** tạo branch trước khi bắt đầu viết code
- **Luôn** update `CHANGELOG.md` trước lần commit cuối
- **Không** push thẳng lên `main`
- Mỗi commit nên nhỏ và rõ ý nghĩa (1 việc = 1 commit)
