# 🔌 LEXIS English — API Documentation

## 1. Authentication (`/api/auth`)
```http
POST   /api/auth/register       # Đăng ký (Email + Password)
POST   /api/auth/login          # Đăng nhập (Email + Password) -> Trả về JWT
POST   /api/auth/google         # Đăng nhập bằng Google OAuth
POST   /api/auth/apple          # Đăng nhập bằng Apple Sign In
POST   /api/auth/refresh        # Làm mới Access Token bằng Refresh Token
POST   /api/auth/logout         # Đăng xuất
GET    /api/auth/me             # Lấy thông tin User hiện tại (cần JWT)
```

## 2. Onboarding (`/api/onboarding`)
```http
POST   /api/onboarding/placement-result   # Lưu kết quả test đầu vào (quyết định level A1-B2)
GET    /api/onboarding/roadmap            # Trả về lộ trình học theo level + mục tiêu
```

## 3. Vocabulary & SM-2 (`/api/words`)
```http
GET    /api/words/daily                   # Sinh/Lấy từ vựng hôm nay (qua Gemini)
POST   /api/words/progress                # Cập nhật SM-2 (Ease Factor, Interval) sau khi Review
GET    /api/words/bank                    # Lấy toàn bộ từ trong Vocab Bank của User (hỗ trợ filter)
GET    /api/words/review                  # Lấy danh sách từ cần ôn trong hôm nay (SM-2 queue)
POST   /api/words/camera                  # Lưu từ vựng được chọn từ quá trình Camera Scan
```

## 4. Gemini AI Integration (`/api/gemini`)
```http
POST   /api/gemini/daily-words            # Yêu cầu Gemini sinh từ vựng + mini-story
POST   /api/gemini/camera-scan            # Yêu cầu Gemini Vision phân tích ảnh -> List từ vựng
POST   /api/gemini/explain                # Yêu cầu Gemini giải thích câu/ngữ pháp khó (tiếng Việt)
POST   /api/gemini/summarize              # Yêu cầu Gemini tóm tắt nội dung bài đọc
```

## 5. Lessons (Listening/Reading) (`/api/lessons`)
```http
GET    /api/lessons?type=listening&level=B1  # Lấy danh sách bài học theo loại và level
GET    /api/lessons/:id                      # Xem chi tiết bài học (transcript, audio, questions)
POST   /api/lessons/:id/complete             # Đánh dấu hoàn thành bài học, nhận XP
```

## 6. Grammar (`/api/grammar`)
```http
GET    /api/grammar/topics                # Lấy danh sách các chủ điểm ngữ pháp
GET    /api/grammar/topics/:id            # Xem chi tiết lý thuyết và bài tập
POST   /api/grammar/topics/:id/submit     # Nộp bài tập và chấm điểm
```

## 7. User & Gamification (`/api/users`)
```http
GET    /api/users/stats                   # Lấy thống kê: XP, chuỗi ngày (streak), số từ đã học
GET    /api/users/badges                  # Lấy danh sách huy hiệu (earned & locked)
PUT    /api/users/profile                 # Cập nhật thông tin profile (avatar, tên)
POST   /api/users/streak-freeze/use       # Sử dụng vật phẩm "Streak Freeze" (bảo vệ chuỗi)
```

## 8. Notifications (`/api/notifications`)
```http
POST   /api/notifications/register-token  # Lưu Expo push token của device
DELETE /api/notifications/token           # Xóa token khi đăng xuất
```

---

## 9. Admin — Chỉ role: "admin" (`/api/admin`)

### 9.1 Dashboard & Analytics
```http
GET    /api/admin/stats                        # Tổng quan: total users, active hôm nay, từ học, retention
GET    /api/admin/stats/daily?days=7           # Lượt học theo ngày (Vocab vs Lesson)
GET    /api/admin/stats/level-distribution     # Phân bố trình độ user (A1/A2/B1/B2/C1)
GET    /api/admin/stats/retention              # Retention D1/D3/D7/D14/D30
GET    /api/admin/stats/popular-features       # Tính năng phổ biến theo lượt dùng
GET    /api/admin/stats/popular-words          # Từ được lưu nhiều nhất / sai nhiều nhất
GET    /api/admin/stats/new-users?days=30      # Số user đăng ký mỗi ngày trong 30 ngày
GET    /api/admin/activity                     # Feed hoạt động gần đây
```

### 9.2 Quản lý Users
```http
GET    /api/admin/users?page=&limit=&level=&status=   # Danh sách users (có filter)
GET    /api/admin/users/:id                           # Chi tiết user + tiến độ học
PUT    /api/admin/users/:id/block                     # Block user
PUT    /api/admin/users/:id/unblock                   # Unblock user
```

### 9.3 Báo cáo vi phạm
```http
GET    /api/admin/reports                # Lấy danh sách báo cáo vi phạm chưa xử lý
PUT    /api/admin/reports/:id/resolve    # Đánh dấu đã xử lý (kèm action: block/ignore)
```

### 9.4 Quản lý Từ vựng
```http
GET    /api/admin/words?topic=&level=    # Danh sách từ trong hệ thống
POST   /api/admin/words                 # Thêm từ mới (hoặc dùng AI auto-fill từ Gemini)
PUT    /api/admin/words/:id             # Sửa từ
DELETE /api/admin/words/:id             # Xóa từ
POST   /api/admin/words/bulk-import     # Nhập hàng loạt từ file CSV/Excel
GET    /api/admin/words/export          # Export toàn bộ từ ra CSV
POST   /api/admin/words/ai-fill         # Gemini tự sinh IPA, Meaning, Example cho 1 từ
```

### 9.5 Quản lý Bài học
```http
GET    /api/admin/lessons?type=&level=  # Danh sách bài học (Listening/Reading)
POST   /api/admin/lessons               # Tạo bài học mới
PUT    /api/admin/lessons/:id           # Sửa bài học
DELETE /api/admin/lessons/:id           # Xóa bài học
PUT    /api/admin/lessons/:id/publish   # Xuất bản / gỡ xuất bản bài học
```

### 9.6 Quản lý Ngữ pháp
```http
GET    /api/admin/grammar/topics           # Danh sách chủ điểm ngữ pháp
POST   /api/admin/grammar/topics           # Tạo chủ điểm mới
PUT    /api/admin/grammar/topics/:id       # Sửa chủ điểm
DELETE /api/admin/grammar/topics/:id       # Xóa chủ điểm
```

### 9.7 Quản lý Notifications (Admin gửi)
```http
POST   /api/admin/notifications/send         # Gửi push notification ngay
POST   /api/admin/notifications/schedule     # Lên lịch gửi tự động
GET    /api/admin/notifications/history      # Lịch sử đã gửi (kèm tỷ lệ mở, click)
DELETE /api/admin/notifications/:id          # Hủy lịch thông báo chưa gửi
```

### 9.8 Cài đặt
```http
GET    /api/admin/settings                   # Lấy cấu hình app
PUT    /api/admin/settings                   # Cập nhật cấu hình (Gemini key, max words, maintenance)
GET    /api/admin/logs/gemini?limit=          # Log các yêu cầu đã gửi đến Gemini API
```

---

## 🤖 Gemini Prompt Templates

### Prompt 1: Sinh từ vựng hàng ngày (Daily Vocabulary)
```text
Bạn là giáo viên tiếng Anh.
User: level={level}, goal={goal}, daily_target={n} từ
Từ đã học (không lặp lại): {learned_words_list}

Tạo {n} từ vựng phù hợp:
- Đúng trình độ {level}, không vượt quá 1 bậc.
- Liên quan đến {goal}.
- Mỗi từ: word, IPA, type, meaning_vi, example.
- 1 mini-story 4-5 câu dùng HẾT các từ trên, bối cảnh {goal}.

Trả về JSON theo schema sau:
{
  "words": [
    {
      "word": "ambitious",
      "phonetic": "/æmˈbɪʃəs/",
      "type": "adjective",
      "meaning_vi": "tham vọng",
      "example": "She is ambitious."
    }
  ],
  "story": "Mini-story text..."
}
```

### Prompt 2: Phân tích ảnh từ Camera (Camera Scan)
```text
Phân tích bức ảnh này.
Liệt kê 8-12 vật thể/khái niệm trong ảnh.
Mỗi vật: word (tiếng Anh), IPA, meaning_vi, example_sentence.
Sinh 1 đoạn văn ngắn (4-5 câu) lấy bối cảnh từ ảnh, dùng các từ trên.

Trả về JSON theo schema:
{
  "words": [
    {
      "word": "keyboard",
      "phonetic": "/ˈkiːbɔːrd/",
      "meaning_vi": "bàn phím",
      "example": "She typed quickly."
    }
  ],
  "story": "Story text..."
}
```

### Prompt 3: Giải thích câu khó (AI Explain)
```text
Giải thích câu sau bằng tiếng Việt đơn giản, dễ hiểu:
"{sentence}"
Tập trung vào: cấu trúc ngữ pháp, từ vựng khó, cách dùng.
Ngắn gọn, tối đa 3-4 câu.
```
