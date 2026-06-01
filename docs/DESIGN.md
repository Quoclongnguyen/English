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

---

## 6. Admin Dashboard Design System

> Admin dùng design system **hoàn toàn riêng** — không áp dụng Nunito, Light Mode, hay Glassmorphism từ mobile.

### 6.1 Phong cách
- **Style:** Minimal & Data-Dense — ưu tiên mật độ thông tin, không dùng hiệu ứng phức tạp.
- **Theme:** Dark only (không cần Light Mode).

### 6.2 Typography (Admin)
- **Font chính:** `Geist` (heading, body, UI) — sans-serif hiện đại, dễ đọc trên màn hình lớn.
- **Font phụ:** `Geist Mono` — dùng cho IPA, số liệu, tag level, timestamp, code.
- Import: `https://fonts.googleapis.com/css2?family=Geist&family=Geist+Mono`

### 6.3 Bảng Màu (Admin)

**Background & Surface:**
| Token | Hex | Dùng cho |
|---|---|---|
| `--bg` | `#080B0F` | Nền toàn trang |
| `--surface` | `#0F1318` | Sidebar, Card |
| `--surface2` | `#161C23` | Input, hover |
| `--surface3` | `#1D2530` | Nested card, pressed |
| `--border` | `rgba(255,255,255,0.06)` | Viền nhẹ |
| `--border2` | `rgba(255,255,255,0.10)` | Viền hover |
| `--text` | `#E8EDF3` | Text chính |
| `--text2` | `#7A8694` | Text phụ |
| `--text3` | `#404852` | Text muted, label |

**Accent Colors (Admin — tông tối hơn mobile):**
| Tên | Hex | Background | Border |
|---|---|---|---|
| Green (Primary) | `#00C97A` | `rgba(0,201,122,0.10)` | `rgba(0,201,122,0.20)` |
| Blue | `#3D8EF0` | `rgba(61,142,240,0.10)` | `rgba(61,142,240,0.20)` |
| Orange | `#F07C3D` | `rgba(240,124,61,0.10)` | `rgba(240,124,61,0.20)` |
| Purple | `#9B6DFF` | `rgba(155,109,255,0.10)` | `rgba(155,109,255,0.20)` |
| Red | `#F04D4D` | `rgba(240,77,77,0.10)` | `rgba(240,77,77,0.20)` |
| Yellow | `#F0C23D` | `rgba(240,194,61,0.10)` | `rgba(240,194,61,0.20)` |

### 6.4 Hình Khối & Kích Thước (Admin)
- **Border Radius:** Nhỏ hơn mobile — `12px` (card), `8px` (button, input), `7px` (small element).
- **Sidebar width:** `240px` — fixed.
- **Topbar:** Sticky, `backdrop-filter: blur(16px)`, `rgba(8,11,15,0.85)`.
- **Button Padding:** `7px 14px` — gọn hơn mobile.

### 6.5 UI Patterns (Admin)
1. **Stat Card:** Background `--surface`, border nhẹ, icon 36×36px có nền màu opacity 10%, số lớn `font-weight: 800`.
2. **Table:** Header `--surface2`, uppercase monospace label, row hover `rgba(255,255,255,0.02)`.
3. **Status Pill:** `font-family: Geist Mono`, font 11px, rounded full — `Active` (green), `Inactive` (surface), `Blocked` (red).
4. **Level Pill:** Monospace, 11px, border-radius 5px — màu theo level: A1(red), A2(orange), B1(blue), B2(green), C1(purple).
5. **Nav Item Active:** Background `rgba(0,201,122,0.10)`, color `#00C97A`, border `1px solid rgba(0,201,122,0.20)`.
6. **Action Buttons:** 28×28px icon button, hover `--surface3`, danger hover `rgba(240,77,77,0.10)`.
