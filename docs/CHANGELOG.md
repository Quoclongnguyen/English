# 📝 LEXIS English — Changelog

> Ghi chú lại những thay đổi lớn, tính năng đã hoàn thành theo thời gian để dễ theo dõi.

## [Unreleased]
### Vocabulary topic taxonomy
- ✅ **Mobile**: Thêm nút quay về Home trong `VocabBankScreen`, topic filter chips và topic badge trên word cards.
- ✅ **Backend**: Chuẩn hóa `Word.topic` theo curated topic list và gắn `topicSource`.
- ✅ **Backend**: Camera words được Gemini classify topic khi lưu selected words, không đổi UI Camera.
- ✅ **Backend**: Thêm `npm run backfill:word-topics` để phân loại lại dữ liệu cũ theo batch.
- ✅ **Verification**: Backend build pass, mobile TypeScript pass.

### Beta fixes from real-user testing
- ✅ **Auth**: Khi access token hết hạn trả 401/403, mobile thử refresh; nếu refresh token fail thì clear session local để quay về Login thay vì kẹt trong app.
- ✅ **Camera**: Sau khi lưu từ từ ảnh, user có lựa chọn rõ `Vocab Bank`, `Chụp tiếp`, `Về Home`; header cũng có shortcut về Home.
- ✅ **Docs**: Ghi lại beta findings đã xử lý và các vấn đề cần phân tích tiếp trong `docs/BETA_TEST.md`.

### Phase 4 Beta Test (Feedback MVP)
- ✅ **Backend**: Thêm `Feedback` model và API `POST /api/feedback`, `GET /api/feedback/my` để thu thập góp ý real users.
- ✅ **Mobile**: Thêm `FeedbackScreen` với module picker, rating 1–5 và message; đặt entry point ở cuối `HomeScreen`.
- ✅ **Docs**: Thêm `docs/BETA_TEST.md` làm checklist test thủ công cho real users.
- ✅ **Verification**: Backend build pass, mobile TypeScript pass, test API feedback bằng user thật/local token thành công.

### Phase 4 Listening — Gemini TTS
- ✅ **Backend**: Thêm `generate:listening-audio` dùng `gemini-2.5-flash-preview-tts` tạo PCM và đóng gói WAV.
- ✅ **Backend**: Hỗ trợ upload audio lên Cloudinary khi có credentials; fallback sang `/public/uploads` khi chạy local.
- ✅ **Backend**: Đồng bộ duration của Lesson/AudioTrack và scale timestamp transcript theo audio được generate.
- ✅ **Mobile**: Resolve được cả Cloudinary URL và relative backend URL khi phát audio.
- ✅ **Verification**: Generate audio English 9.611 giây; file WAV và Listening API trả dữ liệu thành công.

### Phase 4 Reading (Backend)
- ✅ **Backend**: Thêm `ReadingPassage` chứa các section EN/VI và summary được cache.
- ✅ **Backend**: Thêm `ReadingExplanationCache` theo passage, section và user level.
- ✅ **Backend**: Thêm API lấy passage, Gemini explain section và generate summary song ngữ.
- ✅ **Backend**: Thêm `seed:reading` để tạo bài mẫu từ JSON.
- ✅ **Verification**: Test API thật với MongoDB Atlas và Gemini; request sau trả explanation/summary từ cache.

### Phase 4 Reading (Mobile)
- ✅ **Mobile**: Thêm `ReadingScreen` mở bài mẫu trực tiếp từ Home.
- ✅ **Mobile**: Hiển thị English mặc định và toggle bản dịch Việt dưới từng section.
- ✅ **Mobile**: Nhấn giữ section để mở `ExplainModal` với giải thích, simplified English, từ khó và grammar notes.
- ✅ **Mobile**: Thêm `SummaryModal` hiển thị summary EN/VI.
- ✅ **Mobile**: Tách `readingService`, `readingStore` và các component theo feature.
- ✅ **Verification**: TypeScript mobile pass.

### Phase 4 Listening (Backend)
- ✅ **Backend**: Thêm `Lesson` và `AudioTrack` với transcript theo segment/word timestamp.
- ✅ **Backend**: Thêm API lấy bài Listening published và lưu từ transcript vào `Word`, `User.vocabulary`, `UserWordProgress`.
- ✅ **Backend**: Tap-to-save idempotent, không tạo queue trùng và không reset tiến trình SM-2.
- ✅ **Backend**: Thêm `seed:listening` để tạo bài mẫu.
- ✅ **Verification**: Test API thật với MongoDB Atlas; lần lưu đầu `alreadySaved=false`, lần lặp `true`.

### Phase 4 Listening (Mobile)
- ✅ **Mobile**: Thêm Audio Player bằng `expo-audio`: play/pause, seek, tua ±10 giây và tốc độ 0.75x–1.5x.
- ✅ **Mobile**: Thêm transcript EN/VI, highlight theo timestamp và đánh dấu từ đã lưu.
- ✅ **Mobile**: Tap từ mở popup nghĩa; chỉ lưu vào Vocab Bank khi user xác nhận.
- ✅ **Mobile**: Tách `listeningService`, `listeningStore` và các component theo feature.
- ✅ **Verification**: TypeScript mobile pass.

### Phase 3 Photo Deck (Mobile)
- ✅ **Mobile**: Thêm tab Photo Deck trong Vocab Bank với search debounce, sort và pagination.
- ✅ **Mobile**: Thêm grid ảnh 2 cột và `PhotoDetailModal` hiển thị story cùng flashcard chạm để lật.
- ✅ **Mobile**: Chuẩn hóa URL ảnh cho cả local uploads và Cloudinary.
- ✅ **Backend**: Chỉ trả scan đã lưu từ và dùng cùng filter cho dữ liệu lẫn tổng pagination.
- ✅ **Verification**: TypeScript mobile và backend build đều pass.

### Phase 3 Camera Vocabulary (Mobile)
- ✅ **Mobile**: Thêm `CameraScreen` dùng Expo Camera, capture ảnh và gallery fallback cho emulator.
- ✅ **Mobile**: Thêm `CameraChecklistScreen` hiển thị ảnh, mini-story và checklist từ Gemini trước khi lưu.
- ✅ **Mobile**: Mở rộng `vocabStore` và `wordService` cho scan ảnh, lưu từ đã chọn, loading/error và kết quả XP.
- ✅ **Mobile**: Thêm Camera tab, camera flow navigation và permission config cho iOS/Android.
- ✅ **Verification**: TypeScript mobile và backend build đều pass.

### Phase 3 Profile & Gamification (Mobile)
- ✅ **Mobile**: Thêm `ProfileScreen` với thông tin người dùng, streak, freeze, XP theo level và thống kê từ vựng.
- ✅ **Mobile**: Thêm `WeeklyChart`, `BadgeGrid`, pull-to-refresh và các trạng thái loading/error.
- ✅ **Mobile**: Kết nối `GET /api/users/stats`, `POST /api/users/streak-freeze/buy` qua `userAPI` và Zustand `userStore`.
- ✅ **Mobile**: Thêm tab Profile vào `AppNavigator`.
- ✅ **Verification**: `npm.cmd exec -- tsc --noEmit` pass trong thư mục `mobile`.

### Phase 2 Vocabulary Core (Mobile)
- ✅ **Mobile**: Khởi tạo `wordService.ts` và Zustand `vocabStore.ts` xử lý global state cho từ vựng.
- ✅ **Mobile**: Tạo `VocabBankScreen` và thêm tab "Vocab" vào `AppNavigator`.
- ✅ **Mobile**: Xây dựng `DailyVocabScreen` hiển thị tiến trình loading từ Gemini, fetch 5/7/10 từ và mini-story.
- ✅ **Mobile**: Cài đặt `expo-speech` và dùng `react-native-reanimated` thiết kế `FlashcardScreen` (lật 3D + Text-to-Speech).
- ✅ **Mobile**: Xây dựng `ReviewQuizScreen` lấy hàng đợi (Queue) SM-2 từ backend và làm Quiz multiple choice. Có hiển thị phần giải thích (Explanation).
- ✅ **Mobile**: Tạo `MainNavigator` mới gộp `AppNavigator` (Tabs) và các screens dạng Modal như Flashcard.
- ✅ **Mobile**: Update `HomeScreen` dẫn hướng các nút Vocabulary và Review tới màn hình học tương ứng.
- ✅ **Verification**: Chạy `npx tsc --noEmit` pass không còn lỗi.

### Phase 2 Vocabulary Core (Backend)
- ✅ **Backend**: Thêm model `Word` và `UserWordProgress` hỗ trợ thuật toán SM-2.
- ✅ **Backend**: Viết logic `sm2Service.ts` tính toán `interval` và `easeFactor` chuẩn theo SM-2.
- ✅ **Backend**: Tích hợp `geminiService.ts` sử dụng `@google/generative-ai`; model hiện tại là Gemini 2.5 Flash.
- ✅ **Backend**: Thêm `wordController.ts` và route `/api/words/daily`, `/api/words/bank`, `/api/words/review`, `/api/words/progress`.
- ✅ **Verification**: `npx.cmd tsc --noEmit` pass trong thư mục `backend`.

### Phase 1.6 Home Dashboard
- ✅ **Mobile**: Cập nhật `HomeScreen` từ placeholder sang dashboard với header user, badge level/goal, streak, daily goal và module grid.
- ✅ **Mobile**: Thêm component tái sử dụng `StreakBanner`, `DailyGoalRing`, `ModuleCard`.
- ✅ **Mobile**: Ẩn native header của tab Home để dashboard dùng header riêng.
- ✅ **Verification**: `npx.cmd tsc --noEmit` pass trong thư mục `mobile`.

### Phase 1.5 Onboarding
- ✅ **Mobile**: Thêm flow onboarding sau đăng nhập gồm chọn mục tiêu, chọn daily target, placement test 5 câu và màn kết quả level.
- ✅ **Mobile**: Tạo `onboardingStore` lưu trạng thái hoàn thành onboarding bằng AsyncStorage để chỉ hiển thị một lần.
- ✅ **Mobile**: Cập nhật `RootNavigator` để user đã đăng nhập nhưng chưa onboarding đi qua onboarding trước khi vào app.
- ✅ **Backend**: Thêm `POST /api/onboarding/placement-result` để lưu `goal`, `dailyTarget`, `level` vào user hiện tại.
- ✅ **Mobile**: Nối màn kết quả onboarding với API placement result trước khi đánh dấu hoàn thành local.
- ✅ **Verification**: `npx.cmd tsc --noEmit` pass trong thư mục `mobile`; `npm.cmd run build` pass trong thư mục `backend`.

### Kế hoạch tiếp theo
- Test mobile end-to-end: Register/Login từ app → lưu token → RootNavigator chuyển vào App.
- Cân nhắc làm Google OAuth / Apple Sign In sau khi email auth đã test end-to-end ổn định.
- Sau khi Auth xong → bắt đầu Phase 1.5 Onboarding

## [2026-06-03] - Phase 1.3 Backend Auth API Tested
- ✅ **Backend**: Test `POST /api/auth/register` thành công, trả `201 Created`.
- ✅ **Backend**: Test `POST /api/auth/login` thành công, trả `200 OK`.
- ✅ **Backend**: Test `GET /api/auth/me` với Bearer access token thành công, trả `200 OK`.
- ✅ **Backend**: Xác nhận response auth trả `accessToken`, `refreshToken` và thông tin user.
- ✅ **Backend**: Xác nhận MongoDB Atlas đã kết nối bằng dữ liệu user thật.

## [2026-06-03] - Phase 1.4 Auth UI Polish
- ✅ **Mobile**: Cập nhật `LoginScreen` theo design: hero LEXIS, nền tím/xanh, copy tiếng Việt.
- ✅ **Mobile**: Thêm lựa chọn đăng nhập bằng Apple, Google và Email trên `LoginScreen`.
- ✅ **Mobile**: Cập nhật `RegisterScreen` cùng phong cách với Login: hero LEXIS, Apple / Google / Email.
- ✅ **Mobile**: Bấm Email mới mở form email/password hoặc form đăng ký.
- ℹ️ **Mobile**: Google / Apple hiện là UI placeholder và hiển thị thông báo, OAuth backend chưa cấu hình.
- ✅ **Verification**: `npx.cmd tsc --noEmit` pass trong thư mục `mobile`.

## [2026-06-02] - Phase 1.4 Mobile Auth (Completed)
- ✅ **Mobile**: Tạo component `Input` dùng chung.
- ✅ **Mobile**: Dựng UI màn hình `SplashScreen` với animation fade-in.
- ✅ **Mobile**: Dựng UI màn hình `LoginScreen` và `RegisterScreen`, gọi các hàm trong `authStore`.
- ✅ **Mobile**: Tạo `AppNavigator` làm Bottom Tab Navigator với tab `Home` tạm.
- ✅ **Mobile**: Tạo `RootNavigator` (`index.tsx`) chuyển luồng dựa trên biến `isAuthenticated`.
- ✅ **Mobile**: Cập nhật `App.tsx` sử dụng `RootNavigator`.
## [2026-05-25] (Lần 6) - Phase 1.4 Mobile Auth (Partial)
- ✅ **Mobile**: Tạo `src/types/index.ts` — interfaces `User`, `AuthState`, `AuthResponse`, `ApiResponse<T>`.
- ✅ **Mobile**: Tạo `src/constants/config.ts` — `API_BASE_URL`, `API_TIMEOUT`.
- ✅ **Mobile**: Tạo `src/services/api.ts` — Axios instance với request interceptor (gắn Bearer token) và response interceptor (tự refresh khi 401, queue pattern).
- ✅ **Mobile**: Tạo `src/services/authService.ts` — wrap `register`, `login`, `refresh`, `logout`.
- ✅ **Mobile**: Tạo `src/stores/authStore.ts` (Zustand) — lưu token vào AsyncStorage, actions: `login`, `register`, `logout`, `loadFromStorage`.
- ✅ **Mobile**: Tạo `src/navigation/AuthNavigator.tsx` — Stack: Splash → Login → Register.
- 🔄 **Mobile**: `AppNavigator`, `RootNavigator`, Auth Screens đang thực hiện.

## [2026-05-25] (Lần 5) - Phase 1.3 Backend Auth

- ✅ **Backend**: Tạo `src/types/index.ts` — interfaces `JwtPayload`, `AuthRequest`, `RegisterBody`, `LoginBody`.
- ✅ **Backend**: Tạo `src/utils/jwt.ts` — `signAccessToken`, `signRefreshToken`, `verifyAccessToken`, `verifyRefreshToken`.
- ✅ **Backend**: Tạo `src/models/User.ts` — Mongoose Schema đầy đủ theo PRD, indexes cho `email`, `googleId`, `appleId`.
- ✅ **Backend**: Tạo `src/models/index.ts` — barrel export.
- ✅ **Backend**: Tạo `src/middleware/auth.ts` — `authenticateToken` middleware verify Bearer JWT.
- ✅ **Backend**: Tạo `src/controllers/authController.ts` — `register`, `login`, `refresh`, `logout`, `getMe`.
- ✅ **Backend**: Tạo `src/routes/auth.ts` — mount 5 auth routes.
- ✅ **Backend**: Cập nhật `src/index.ts` — enable MongoDB connect, mount `/api/auth` router, thêm 404 handler.
- ✅ **Backend**: Tạo file `.env` template với `MONGODB_URI`, `JWT_SECRET`, `JWT_REFRESH_SECRET`.

## [2026-05-21] (Lần 4) - Xây dựng Design System
- ✅ **Mobile**: Cài đặt font `Nunito` và `Space Mono`.
- ✅ **Mobile**: Tạo `ThemeStore` (Zustand) hỗ trợ Dark/Light mode chuẩn xác theo cấu hình Figma.
- ✅ **Mobile**: Dựng Component `Button` hỗ trợ nhiều variant (primary, outline) và màu (green, purple, etc.).
- ✅ **Mobile**: Dựng Component `Card` và `Badge` tái sử dụng, tương thích giao diện dark/light.
- ✅ **Mobile**: Cập nhật `App.tsx` để render thử các component này.

## [2026-05-21] (Lần 3) - Cấu hình Code Quality
- ✅ **Mobile**: Cài đặt ESLint, Prettier.
- ✅ **Mobile**: Cấu hình file `.eslintrc.js`, `.prettierrc`, `.eslintignore`.
- ✅ **Mobile**: Cập nhật lệnh `lint` và `format` trong `package.json`.

## [2026-05-21] (Lần 2) - Bắt đầu Phase 1 Setup
- ✅ **Mobile**: Khởi tạo project React Native Expo với `blank-typescript`.
- ✅ **Mobile**: Cài đặt React Navigation, Zustand, Reanimated và AsyncStorage (hiện dùng React Navigation 7, Reanimated 4).
- ✅ **Mobile**: Khởi tạo cấu trúc thư mục `src` và thêm `constants/colors.ts`, `constants/typography.ts`.
- ✅ **Backend**: Khởi tạo Node.js project với `package.json`, `tsconfig.json`.
- ✅ **Backend**: Cài đặt Express, Mongoose, TypeScript, dotenv, bcrypt.
- ✅ **Backend**: Tạo file entry `src/index.ts`.

## [2026-05-21] - Khởi tạo dự án
- Lên ý tưởng và đặt tên ứng dụng: **LEXIS English**.
- Xác định Tech Stack: React Native, Expo, TypeScript, Node.js, MongoDB, Gemini API.
- Viết tài liệu tổng quan (`skill.md`).
- Tách tài liệu thành các file nhỏ: `PRD.md`, `DESIGN.md`, `API.md`, `CHANGELOG.md`.
- Chốt thuật toán Spaced Repetition (SM-2).
- Chốt định dạng Placement Test.
- Định nghĩa MongoDB Schema và các Index cần thiết.
