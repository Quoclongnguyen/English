# 📋 LEXIS English — Product Requirements Document (PRD)

Tài liệu này chứa toàn bộ các tính năng, danh sách màn hình, mô hình dữ liệu và các giới hạn phạm vi của dự án.

## 1. 🎯 Tính Năng — Checklist Đầy Đủ

### 🔐 Auth
- 🔲 Đăng nhập Google (OAuth)
- 🔲 Đăng nhập Apple (Sign In with Apple)
- ✅ Đăng nhập Email + Password
- ✅ JWT + Refresh Token
- ✅ Persistent session (không phải đăng nhập lại)

### 📱 Onboarding (chạy 1 lần)
- ✅ Chọn mục tiêu: IELTS / TOEIC / Business / Giao tiếp
- ✅ Chọn daily target: 5 / 7 / 10 từ/ngày
- ✅ Placement Test 5 câu → xác định trình độ A1→B2. Format: 5 câu Multiple Choice, khó dần.
- ✅ Kết quả trình độ + lộ trình cá nhân hóa cơ bản.

### 📚 Vocabulary
- ✅ Daily vocab: Gemini sinh 5/7/10 từ theo level + goal + mini-story
- ✅ Flashcard lật 3D + phát âm TTS
- ✅ Đánh giá: "Biết rồi ✓" / "Cần ôn 🔁"
- 🔄 Vocab Bank đã có; Filter & Search cho danh sách từ chính chưa hoàn chỉnh

### 🔁 Smart Review
- ✅ SM-2 Spaced Repetition algorithm
- 🔄 Quiz: Multiple Choice đã có; Fill-in-blank và Listen & Type chưa có
- ✅ **Luôn giải thích khi chọn sai** (giải thích tĩnh trong Review Quiz)
- ✅ XP reward

### 📷 Camera Vocabulary
- ✅ Chụp/Chọn ảnh → Gemini Vision phân tích
- ✅ Trả về list từ → User dùng checklist để chọn từ muốn lưu (không auto-save)
- ✅ Mini-story sinh ra từ bối cảnh bức ảnh
- ✅ Photo Deck trong Vocab Bank

### 🎧 Listening & 📰 Reading & 📝 Grammar
- ✅ Listening MVP: Audio player, speed control, transcript EN/VI ẩn hiện.
- ✅ Reading MVP: Bài đọc song ngữ, AI giải thích section, tóm tắt bài.
- ✅ Grammar MVP: Danh sách chủ điểm, bài giảng lý thuyết, bài tập MCQ/fill blank và giải thích khi sai.
- 🔄 Tap từ khó → Listening đã có xem nghĩa + lưu; Reading chưa có.

### 🧪 Beta test với real users
- ✅ Feedback form thủ công ở cuối Home: chọn module, rating 1–5, nhập message.
- ✅ Backend lưu feedback vào MongoDB để review sau.
- ✅ Checklist test thủ công trong `docs/BETA_TEST.md`.

### 🎮 Gamification & 🔔 Notifications
- ✅ Streak đếm ngày + Streak Freeze
- 🔄 XP points đã có; Level progression chưa hoàn chỉnh
- ✅ Milestone Badges
- ✅ Daily Goal Ring (vòng tiến độ)
- 🔲 Push Notification: Word of the Day, Review Reminder, Streak Alert

---

## 2. 📱 Màn Hình (Screens)

### Auth & Onboarding
- `SplashScreen`
- `LoginScreen`, `RegisterScreen`
- `OnboardingGoalScreen`, `OnboardingTargetScreen`, `PlacementTestScreen`, `PlacementResultScreen`

### Main Tabs
- 🏠 `HomeScreen` (Dashboard, streak, modules)
- 📖 `VocabBankScreen` (Danh sách từ đã học)
- 📷 `CameraScreen` (Scan ảnh)
- 📝 Home hiện đóng vai trò Learn Hub; chưa có `LearnHubScreen` riêng
- 👤 `ProfileScreen` (Thống kê, badges)

### Flows
- **Vocabulary:** `DailyVocabScreen`, `FlashcardScreen`, `ReviewQuizScreen` (explanation hiển thị cùng màn).
- **Camera:** `CameraChecklistScreen`.
- **Learn:** `ListeningPlayerScreen`, `ReadingScreen`, `GrammarTopicListScreen`, `GrammarTheoryScreen`, `GrammarExerciseScreen`.
- **Beta:** `FeedbackScreen` mở từ cuối `HomeScreen`.

---

## 3. 🗄️ Data Models (MongoDB)

### User
```typescript
{
  _id: ObjectId, name: string, email: string, passwordHash?: string,
  googleId?: string, appleId?: string, avatar?: string,
  level: 'A1'|'A2'|'B1'|'B2'|'C1', goal: 'ielts'|'toeic'|'business'|'daily',
  dailyTarget: 5|7|10, xp: number, streak: number, streakFreezeCount: number,
  lastStudyDate: Date, createdAt: Date
}
```

### Word
```typescript
{
  _id: ObjectId, word: string, phonetic: string, type: string,
  meaning_vi: string, example: string, story?: string,
  audioUrl?: string, topic: string, level: string,
  source: 'daily'|'camera'|'listening', photoRef?: string,
  lessonRef?: ObjectId, createdAt: Date
}
```

### UserWordProgress (SM-2)
```typescript
{
  _id: ObjectId, userId: ObjectId, wordId: ObjectId,
  status: 'new'|'learning'|'reviewing'|'mastered',
  nextReviewDate: Date, reviewCount: number, easeFactor: number,
  interval: number, lastResult: 'correct'|'wrong'
}
```

### Lesson & AudioTrack
`Lesson` lưu metadata bài Listening. `AudioTrack` lưu URL audio, nguồn
`upload|gemini_tts|third_party`, transcript EN/VI và timestamp theo segment/word.

### ReadingPassage & ReadingExplanationCache
`ReadingPassage` lưu các section EN/VI và summary. Explanation từ Gemini được cache
theo passage, section và trình độ người học.

### PhotoScan
Lưu ảnh Camera Vocabulary, mini-story, detected words, saved words và XP.

### GrammarTopic & GrammarExercise
`GrammarTopic` lưu chủ điểm, theory, usages, structures, notes. `GrammarExercise` lưu câu hỏi
multiple choice/fill blank, đáp án đúng, accepted answers và explanation pre-written.

### Feedback
Lưu feedback beta test gồm `userId`, `module`, `rating`, `message`, thông tin thiết bị cơ bản
và trạng thái xử lý `new|reviewed|resolved`.

### Badge
Ghi nhận huy hiệu user đạt được (`streak_7`, `words_100`...).

---

## 4. 🚫 Ngoài Phạm Vi (Out of Scope — v1.0)
- ❌ Speaking / Pronunciation module (quá phức tạp)
- ❌ Chatbot AI (thay bằng AI Explain đơn giản cho bài đọc)
- ❌ Leaderboard (cần đông users)
- ❌ Offline mode đầy đủ
- ❌ Social features (friend, share)
- ❌ In-app purchase / subscription
- ❌ Web version (cho người dùng) — chỉ có Admin web

---

## 5. 🖥️ Admin Dashboard (Web)

> **Mô tả:** Web app quản trị riêng tại `/admin/`. Chỉ user có `role: "admin"` trong MongoDB mới truy cập được.
> **Tech:** React (Vite) + TypeScript. Dùng chung backend Node.js.
> **URL:** admin.lexis.app

### 5.1 Quản lý Người dùng
- 🔲 Xem danh sách users: tên, email, level, goal, streak, từ đã học, tiến độ, trạng thái
- 🔲 Thống kê: tổng users, active hôm nay, users mới tuần này, số bị block
- 🔲 Block / Unblock user vi phạm
- 🔲 Xem tiến độ học của từng user
- 🔲 Xử lý báo cáo vi phạm (xem, block, bỏ qua)

### 5.2 Quản lý Nội dung
- 🔲 **Từ vựng:** Thêm/sửa/xóa từ, filter theo topic và level
  - AI Auto-Fill: chỉ nhập "Word" → Generate by Gemini → tự điền IPA, Meaning, Example
  - Bulk Import/Export: nhập hàng loạt từ file Excel/CSV
  - Audio Preview: nghe thử TTS trước khi lưu
- 🔲 **Bài học (Listening + Reading):** Thêm/sửa/xóa bài, trạng thái Published/Draft
  - Interactive Editor: "Tag" từ vựng ngay trong bài đọc → user click → hiện nghĩa + lưu Vocab Bank
  - Question Bank: quản lý kho câu hỏi MCQ riêng, gắn vào bài học tùy ý
- 🔲 **Ngữ pháp:** Danh sách chủ điểm, số bài, số bài tập, lượt học

### 5.3 Thống kê & Analytics
- 🔲 Dashboard: tổng users, active hôm nay, từ đã học, 7-day retention
- 🔲 Biểu đồ lượt học theo ngày (Vocabulary vs Bài học)
- 🔲 Phân bố trình độ: A1/A2/B1/B2/C1 (donut chart)
- 🔲 Retention Rate: D1/D3/D7/D14/D30
- 🔲 Tính năng phổ biến nhất theo lượt dùng
- 🔲 Popular Words: từ nào được lưu nhiều nhất / sai nhiều nhất
- 🔲 New users — 30 ngày

### 5.4 Quản lý Notifications
- 🔲 Soạn thông báo: tiêu đề, nội dung, loại (Word of Day / Streak / Review / Custom)
- 🔲 Segmentation: gửi theo level (A1, B1...) hoặc goal (IELTS, TOEIC) hoặc điều kiện (chưa học hôm nay, streak sắp gãy)
- 🔲 Preview thông báo trên màn hình giả lập điện thoại
- 🔲 Scheduled Push: lên lịch gửi tự động (ví dụ: 8h tối hàng ngày)
- 🔲 Lịch sử gửi: tiêu đề, đối tượng, đã gửi, tỷ lệ mở, tỷ lệ click

### 5.5 Cài đặt Hệ thống
- 🔲 Cấu hình: tên app, Gemini API key, max daily words, maintenance mode
- 🔲 Log System: theo dõi yêu cầu gửi đến Gemini API (chi phí, lỗi)
- 🔲 User Reports Handling: khu vực phản hồi báo cáo lỗi / thắc mắc từ users

### 5.6 Phân quyền
- Chỉ user có `role: "admin"` trong MongoDB mới truy cập được Admin Dashboard
- Backend middleware kiểm tra role trước khi xử lý bất kỳ `/api/admin/*` request nào
