# 📝 LEXIS English — Changelog

> Ghi chú lại những thay đổi lớn, tính năng đã hoàn thành theo thời gian để dễ theo dõi.

## [Unreleased]
### Kế hoạch tiếp theo (Phase 1)
- Setup MongoDB Atlas Connection ở Backend.
- Bắt tay vào làm Auth Screens & Auth Routes.

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
