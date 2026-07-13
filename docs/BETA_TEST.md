# LEXIS English — Beta Test Checklist

> Mục tiêu: thu thập feedback thật từ người dùng, phát hiện lỗi flow học chính và ghi lại cảm nhận trước khi tích hợp analytics/crash reporting bên thứ ba.

## 1. Chuẩn bị trước khi test

- Cài app trên thiết bị thật hoặc Expo Go.
- Backend đang chạy và mobile trỏ đúng `API_BASE_URL`.
- User test có thể đăng ký/đăng nhập bằng email.
- Seed content đã có:
  - Listening sample
  - Reading sample
  - Grammar topics: Present Simple, Past Simple

## 2. Checklist theo flow

| Flow | Kỳ vọng | Result | Notes |
|---|---|---|---|
| Register/Login | User vào được app, token lưu ổn định |  |  |
| Onboarding | Chọn goal, daily target, placement xong vào Home |  |  |
| Daily Vocab | Lấy từ mới, xem story, mở flashcard |  |  |
| Review Quiz | Làm quiz, thấy giải thích đúng/sai |  |  |
| Camera Vocabulary | Chụp/chọn ảnh, Gemini detect từ, user chọn từ để lưu |  |  |
| Photo Deck | Xem lại ảnh đã scan và từ đã lưu |  |  |
| Listening | Phát audio, pause/seek/speed, transcript highlight |  |  |
| Listening tap-to-save | Tap từ, xem popup nghĩa, lưu vào Vocab Bank |  |  |
| Reading | Đọc bài EN/VI, gọi AI explain, xem summary |  |  |
| Grammar | Chọn Present/Past Simple, đọc theory, làm exercise |  |  |
| Feedback | Gửi rating + message từ Home cuối màn hình |  |  |

## 3. Mẫu ghi nhận tester

| Tester | Device | App build | Date | Overall rating | Biggest issue |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 4. Feedback form MVP

Feedback được lưu qua:

```http
POST /api/feedback
GET  /api/feedback/my
```

Fields chính:

- `module`: `general`, `vocabulary`, `camera`, `listening`, `reading`, `grammar`
- `rating`: 1–5
- `message`: nội dung góp ý
- `platform`: iOS/Android/web test
- `status`: `new`, `reviewed`, `resolved`

## 5. Chưa tích hợp trong MVP

- Sentry crash reporting
- Firebase Analytics / Mixpanel
- Admin dashboard để review feedback
- Screenshot attachment

Các phần này chỉ nên thêm sau khi feedback form thủ công đã có dữ liệu thật từ vài tester đầu tiên.
