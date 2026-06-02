# 📝 LEXIS English — Changelog

> Ghi chú lại những thay đổi lớn, tính năng đã hoàn thành theo thời gian để dễ theo dõi.

## [Unreleased]
### Kế hoạch tiếp theo
- Test end-to-end: Register → Login → navigate vào App.
- Điền `MONGODB_URI` thật vào `.env` và kết nối MongoDB Atlas.
- Sau khi Auth xong → bắt đầu Phase 1.5 Onboarding

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
- ✅ **Mobile**: Cài đặt React Navigation, Zustand, Reanimated 3, AsyncStorage.
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
