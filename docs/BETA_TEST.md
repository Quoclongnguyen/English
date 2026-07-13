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

## 6. Beta findings đã xử lý

| Date | Finding | Fix |
|---|---|---|
| 2026-07-13 | iOS giữ session cũ nhưng access/refresh token hết hạn làm app kẹt ở trạng thái đã đăng nhập và API Vocabulary lỗi 401/403. | Mobile API interceptor giờ thử refresh với cả 401/403; nếu refresh fail thì clear token + AuthStore session để RootNavigator quay về Login. |
| 2026-07-13 | Camera save thành công nhưng user không có lựa chọn rõ để về Home / xem Vocab Bank / chụp tiếp. | `CameraChecklistScreen` thêm Home action ở header và alert sau lưu với 3 lựa chọn: Vocab Bank, Chụp tiếp, Về Home. |
| 2026-07-13 | Vocabulary chưa có phân loại theo chủ đề như công việc, học tập, gia đình, IT. | Chuẩn hóa `Word.topic`, thêm topic filter/badge ở Vocab Bank, auto-classify Camera words khi lưu, thêm script backfill dữ liệu cũ. |

## 7. Beta findings cần phân tích tiếp

| Finding | Ghi chú |
|---|---|
| User chưa hiểu app nên học theo lộ trình nào. | Cần thiết kế Learning Path MVP trên Home: Today’s path / next best action. |
| Daily Vocabulary chưa cho user chủ động chọn topic muốn học. | Topic taxonomy đã có; cần thiết kế UX chọn/gợi ý topic cho Daily Vocab. |
| Daily Vocabulary có cảm giác lặp lại dữ liệu test ban đầu. | Cần kiểm tra logic exclude learned words, daily cache theo user/ngày và trạng thái sau flashcard. |
