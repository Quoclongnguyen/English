# 🎨 LEXIS English — Design System

> Hệ thống thiết kế này được trích xuất trực tiếp từ bản thiết kế `figma.txt`. Đây là chuẩn mực bắt buộc để tạo UI cho các Component trong ứng dụng React Native.

## 1. Phong cách & Chủ đạo
- **Style:** Bold & Playful — màu sắc tươi sáng, độ tương phản cao, góc bo tròn lớn, giao diện trẻ trung, năng động.
- **Theme:** Hỗ trợ Dark Mode (mặc định) & Light Mode.

## 2. Typography
- **Font chính (Headings, Body):** `Nunito` (tròn trịa, thân thiện, dùng cho font-weight: 400, 600, 700, 800, 900).
- **Font phụ (Monospace):** `Space Mono` (dùng cho phiên âm IPA, số liệu đếm, tags, và thông số kỹ thuật).

## 3. Bảng Màu (Color Palette)

### 3.1. Core Brand Colors (Màu chủ đạo)
| Tên | Hex | Background Opacity (12%) | Border Opacity (25%) | Chức năng / Dùng cho |
|---|---|---|---|---|
| **Green** | `#00D68F` | `rgba(0,214,143, 0.12)` | `rgba(0,214,143, 0.25)` | Primary action, Vocabulary, trạng thái "Correct", Mastered. |
| **Orange** | `#FF6B35` | `rgba(255,107,53, 0.12)` | `rgba(255,107,53, 0.25)` | Streak banner, Review (Ôn tập), trạng thái "Wrong". |
| **Purple** | `#8B5CF6` | `rgba(139,92,246, 0.12)` | `rgba(139,92,246, 0.25)` | Camera Vocabulary, Grammar Hub, level badges. |
| **Blue** | `#3B82F6` | `rgba(59,130,246, 0.12)` | `rgba(59,130,246, 0.25)` | Listening Hub, player, Audio actions. |
| **Yellow** | `#FBBF24` | `rgba(251,191,36, 0.12)` | `rgba(251,191,36, 0.25)` | Điểm XP, Highlights trong văn bản, trạng thái "Learning". |
| **Pink** | `#F472B6` | `rgba(244,114,182, 0.12)`| `rgba(244,114,182, 0.25)`| Hiển thị Badges (Thành tựu). |
| **Teal** | `#14B8A6` | `rgba(20,184,166, 0.12)` | `rgba(20,184,166, 0.25)` | Reading Module, Tóm tắt AI. |

### 3.2. Background & Surface Colors
*Chú ý: Ứng dụng tập trung thiết kế nổi bật (elevated surfaces) với viền nhẹ.*

**Dark Mode:**
- Background (`--bg`): `#0F0F14`
- Surface 1 (`--surface`): `#1A1A24` (Dùng cho Card, Input nền chính)
- Surface 2 (`--surface2`): `#22222F` (Dùng cho Hover/Pressed, Card lồng bên trong)
- Surface 3 (`--surface3`): `#2A2A3A`
- Border: `rgba(255, 255, 255, 0.07)`
- Text 1 (Primary): `#F0EEF8`
- Text 2 (Secondary): `#9A97B0`
- Text 3 (Muted): `#5C5A72`

**Light Mode:**
- Background (`--bg`): `#F4F2FF`
- Surface 1 (`--surface`): `#FFFFFF`
- Surface 2 (`--surface2`): `#F0EEF8`
- Surface 3 (`--surface3`): `#E8E5F5`
- Border: `rgba(0, 0, 0, 0.07)`
- Text 1 (Primary): `#1A1830`
- Text 2 (Secondary): `#6B6885`
- Text 3 (Muted): `#A09DBF`

## 4. Hình Khối & Kích Thước (Geometry & Spacing)
- **Border Radius:** Rất lớn, bo tròn nhiều.
  - Large (`--r`): `24px` (Dùng cho màn hình, Bottom Sheet)
  - Standard (`--rsm`): `16px` (Dùng cho Cards, Buttons)
  - Small (`--rxs`): `10px` (Dùng cho Badges, Tags nhỏ)
- **Button Padding:** `17px` (to, dễ bấm), scale `0.98` khi nhấn (active).
- **Icons & Emoji:** Dùng Emoji chuẩn hoặc Vector Icon (FontAwesome/Feather) nhưng ưu tiên kích thước lớn, màu sắc rực rỡ hoặc có khối hộp nền nhạt bao quanh.

## 5. UI Patterns (Thành phần phổ biến)
1. **Glassmorphism (Kính mờ):** Dùng ở Header hoặc Tabbar. Ví dụ: `rgba(10, 10, 16, 0.92)` với `backdrop-filter: blur(20px)`.
2. **Gradient Backgrounds:** Thường xuyên dùng linear-gradient chéo góc (`135deg` hoặc `145deg`) cho Hero banners, Streak, Profile. Ví dụ:
   - *Splash:* `linear-gradient(145deg, #6366F1, #8B5CF6 40%, #00D68F)`
   - *Streak:* `linear-gradient(135deg, #FF6B35, #FF8C42)`
   - *Grammar:* `linear-gradient(135deg, #7C3AED, #4F46E5)`
3. **Pill Tags:** Text cực nhỏ (`10px`), font `Space Mono`, chữ hoa (Uppercase), khoảng cách chữ (letter-spacing `0.08em` tới `0.1em`). Thường dùng làm nhãn level, trạng thái.
4. **Flashcard 3D:** Hiệu ứng xoay mặt trước (cfront) và mặt sau (cback) dọc trục Y (`rotateY(180deg)`), sử dụng `backface-visibility: hidden`.
5. **Tiến trình (Progress Bar):** Rất hay dùng gradient. Ví dụ: `linear-gradient(90deg, #00D68F, #52FFB8)`.
