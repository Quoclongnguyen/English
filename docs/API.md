# 🔌 LEXIS English — API Documentation

> Các endpoint bên dưới phản ánh code thực tế trong `backend/src/routes`.
> Tất cả endpoint ngoài Auth public đều cần `Authorization: Bearer <accessToken>`.

## 1. Authentication (`/api/auth`)
```http
POST   /api/auth/register       # Đăng ký Email + Password
POST   /api/auth/login          # Đăng nhập, trả Access Token + Refresh Token
POST   /api/auth/refresh        # Làm mới Access Token
POST   /api/auth/logout         # Đăng xuất
GET    /api/auth/me             # Lấy User hiện tại (cần JWT)
```

> Google OAuth và Apple Sign In hiện mới có UI placeholder, chưa có backend endpoint.

## 2. Onboarding (`/api/onboarding`)
```http
POST   /api/onboarding/placement-result   # Lưu goal, dailyTarget và level A1-B2
```

## 3. Vocabulary & SM-2 (`/api/words`)
```http
GET    /api/words/daily                   # Sinh/lấy từ hôm nay bằng Gemini
GET    /api/words/bank                    # Lấy Vocab Bank của User
GET    /api/words/review                  # Lấy SM-2 review queue đến hạn
POST   /api/words/progress                # Cập nhật SM-2 theo quality

POST   /api/words/camera-scan             # Gemini Vision phân tích ảnh, chưa lưu từ
POST   /api/words/camera                  # Lưu các từ được chọn từ Camera Scan
GET    /api/words/photo-deck              # Lấy Photo Deck, search/sort/pagination
```

### `POST /api/words/progress`
```json
{
  "wordId": "ObjectId",
  "quality": 4
}
```

### `POST /api/words/camera-scan`
```json
{
  "base64Image": "...",
  "mimeType": "image/jpeg"
}
```

### `POST /api/words/camera`
```json
{
  "photoScanId": "ObjectId",
  "selectedWords": [
    {
      "word": "keyboard",
      "phonetic": "/ˈkiːbɔːrd/",
      "meaning_vi": "bàn phím",
      "example": "She typed on the keyboard."
    }
  ]
}
```

### `GET /api/words/photo-deck`
```http
GET /api/words/photo-deck?sort=recent&search=&page=1&limit=10
```

## 4. Listening (`/api/listening`)
```http
GET    /api/listening/lessons/:lessonId         # Lấy bài nghe published + audio + transcript
POST   /api/listening/lessons/:lessonId/words   # Lưu từ transcript vào Vocab Bank + SM-2
```

### `POST /api/listening/lessons/:lessonId/words`
```json
{
  "segmentId": "segment-1",
  "wordId": "word-2"
}
```

Response:
```json
{
  "word": {},
  "progress": {},
  "alreadySaved": false
}
```

Endpoint có tính idempotent: lưu lại cùng một từ không tạo progress trùng và không reset SM-2.

### Listening content scripts
```bash
npm run seed:listening
npm run generate:listening-audio
```

- `seed:listening`: tạo một bài Listening mẫu từ JSON.
- `generate:listening-audio`: dùng Gemini TTS tạo WAV, cập nhật duration/timestamp và AudioTrack.
- Có Cloudinary credentials: upload vào `lexis/listening`.
- Thiếu Cloudinary credentials: lưu trong `backend/public/uploads` và trả URL `/uploads/...`.

## 5. Reading (`/api/reading`)
```http
GET    /api/reading/passages/:passageId          # Lấy bài đọc song ngữ published
POST   /api/reading/passages/:passageId/explain  # Gemini giải thích một section
POST   /api/reading/passages/:passageId/summary  # Lấy hoặc generate summary EN/VI
```

### `POST /api/reading/passages/:passageId/explain`
```json
{
  "sectionId": "section-1"
}
```

Response:
```json
{
  "explanationVi": "Giải thích tiếng Việt...",
  "simplifiedEnglish": "Simplified English...",
  "difficultWords": [
    {
      "word": "lasting",
      "meaningVi": "lâu dài"
    }
  ],
  "grammarNotes": [],
  "fromCache": false
}
```

Explanation được cache theo `passageId + sectionId + user level`.

### `POST /api/reading/passages/:passageId/summary`
```json
{
  "english": "English summary...",
  "vietnamese": "Tóm tắt tiếng Việt...",
  "fromCache": false
}
```

Summary được generate một lần rồi lưu trong `ReadingPassage`.

### Reading content script
```bash
npm run seed:reading
```

## 6. Grammar (`/api/grammar`)
```http
GET    /api/grammar/topics                      # Danh sách chủ điểm Grammar published
GET    /api/grammar/topics/:topicId             # Lấy theory của một chủ điểm
GET    /api/grammar/topics/:topicId/exercises   # Lấy bài tập, không trả đáp án đúng
POST   /api/grammar/exercises/:exerciseId/submit # Chấm đáp án và trả giải thích
```

### `POST /api/grammar/exercises/:exerciseId/submit`
```json
{
  "answer": "b"
}
```

Response:
```json
{
  "exerciseId": "ObjectId",
  "isCorrect": false,
  "submittedAnswer": "go",
  "correctAnswer": "b",
  "correctAnswerText": "goes",
  "explanation": {
    "rule": "Quy tắc ngữ pháp...",
    "correctReason": "Vì sao đáp án đúng...",
    "mistakeReason": "Lỗi sai thường gặp..."
  }
}
```

### Grammar content script
```bash
npm run seed:grammar
```

## 7. Beta Feedback (`/api/feedback`)
```http
POST   /api/feedback                            # Gửi feedback beta test
GET    /api/feedback/my                         # Lấy 30 feedback gần nhất của user hiện tại
```

### `POST /api/feedback`
```json
{
  "module": "grammar",
  "rating": 5,
  "message": "Topic selection works well.",
  "platform": "android",
  "appVersion": "dev",
  "deviceModel": "Pixel"
}
```

Response:
```json
{
  "feedback": {
    "id": "ObjectId",
    "module": "grammar",
    "rating": 5,
    "message": "Topic selection works well.",
    "status": "new",
    "createdAt": "2026-07-13T..."
  }
}
```

## 8. User & Gamification (`/api/users`)
```http
GET    /api/users/stats                         # XP, streak, vocabulary, badges, weekly progress
PUT    /api/users/profile                       # Cập nhật displayName/avatarUrl
POST   /api/users/streak-freeze/buy             # Mua 1 freeze bằng XP
POST   /api/users/streak-freeze/use-manual      # Dùng freeze thủ công
```

## 9. Gemini AI Integration

Gemini hiện được gọi nội bộ qua Vocabulary, Camera và Reading APIs, không có router `/api/gemini` public.

Các model đang dùng:
- `gemini-2.5-flash`: Daily Vocab, Camera Vision, Reading Explain, Reading Summary.
- `gemini-2.5-flash-preview-tts`: tạo audio Listening.

## 10. Chưa triển khai

Các nhóm endpoint sau vẫn thuộc kế hoạch, chưa có trong code:

```http
POST   /api/auth/google
POST   /api/auth/apple
GET    /api/onboarding/roadmap

POST   /api/notifications/register-token
DELETE /api/notifications/token

/api/admin/*
```

---

## 🤖 Gemini Prompt Templates

### Prompt 1: Daily Vocabulary
Sinh 5/7/10 từ theo level, goal và danh sách từ đã học. Structured output gồm:
`word`, `phonetic`, `type`, `meaning_vi`, `example` và `story`.

### Prompt 2: Camera Vision
Phân tích ảnh và trả structured output gồm danh sách từ cùng mini-story. User chọn từ trước khi lưu.

### Prompt 3: Reading Explain
Giải thích section theo level bằng tiếng Việt, tạo English đơn giản hơn, từ khó và ghi chú ngữ pháp.

### Prompt 4: Reading Summary
Tóm tắt toàn bài thành 2-3 câu English phù hợp level và bản tiếng Việt tương ứng.

### Prompt 5: Listening TTS
Đọc chính xác transcript bằng giọng English rõ ràng, tốc độ phù hợp người học A2; output audio PCM được đóng gói thành WAV.
