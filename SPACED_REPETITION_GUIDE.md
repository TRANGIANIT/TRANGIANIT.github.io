# 📚 Hướng Dẫn Ôn Tập Ngắt Quãng (Spaced Repetition) - Anki Style

## Tổng Quan
Hệ thống Ôn Tập Ngắt Quãng (Spaced Repetition) trong Antigravity được thiết kế dành riêng cho **Admin Users** để học ngoại ngữ một cách khoa học và hiệu quả, tương tự như ứng dụng Anki nổi tiếng.

## Cơ Chế Hoạt Động

### 1. Trạng Thái Thẻ (Card States)
Mỗi thẻ flashcard có một trong bốn trạng thái:

| Trạng Thái | Mô Tả | Kỳ Vọng |
|-----------|------|--------|
| **🆕 Mới** | Thẻ chưa từng được học | Xem lần đầu tiên |
| **📚 Đang Học** | Thẻ đang được học lần đầu | Phải ôn tập 1-3 ngày |
| **📖 Ôn Tập** | Thẻ đã được xác nhân | Ôn tập theo lịch trình khoa học |
| **⏸️ Tạm Dừng** | Thẻ được tạm dừng tạm thời | Không xuất hiện trong lịch ôn |

### 2. Hệ Thống Phản Hồi Chất Lượng
Khi ôn tập mỗi thẻ, bạn sẽ chọn một trong 4 mức độ khó:

```
❌ Again (1 ngày)      → Không nhớ, phải học lại ngày mai
😐 Hard (3 ngày)       → Khó nhưng nhớ được, ôn sau 3 ngày
😊 Good (7 ngày)       → Bình thường, ôn sau 7 ngày
😃 Easy (21 ngày)      → Rất dễ, ôn sau 21 ngày
```

### 3. Thuật Toán SM-2
Hệ thống sử dụng **SM-2 Algorithm** (Super Memory 2), được phát triển bởi Piotr Wozniak:

#### Công Thức Tính Ease Factor (EF)
```
EF_new = EF + (0.1 - (5 - q) × 0.08)
```

Trong đó:
- `EF` = Ease Factor hiện tại (bắt đầu = 2.5)
- `q` = Chất lượng phản hồi (0-4)
- `EF_min` = 1.3 (không bao giờ nhỏ hơn)

#### Ví Dụ Tính EF
```
Trường hợp 1: Người dùng ấn "Again" (q=0)
- EF_cũ = 2.5
- EF_mới = 2.5 + (0.1 - (5-0) × 0.08) = 2.5 - 0.3 = 2.2

Trường hợp 2: Người dùng ấn "Easy" (q=4)
- EF_cũ = 2.5
- EF_mới = 2.5 + (0.1 - (5-4) × 0.08) = 2.5 + 0.02 = 2.52
```

#### Công Thức Tính Interval (Khoảng Cách Ôn)
```
Interval_mới = Interval_cũ × EF
```

Các interval tối thiểu:
- **Again**: 1 ngày (luôn)
- **Hard**: 3 ngày
- **Good**: 7 ngày
- **Easy**: 21 ngày

## Cách Sử Dụng

### Bước 1: Truy Cập Admin Panel
1. Đăng nhập với tài khoản Admin
2. Chuyển đến tab **"🛡️ Admin"** ở dưới cùng
3. Nhấn nút **"🧠 Ôn Tập Ngắt Quãng"**

### Bước 2: Xem Dashboard
Dashboard sẽ hiển thị 4 thống kê quan trọng:
```
📊 Thẻ Mới:        0  ← Số thẻ chưa học
📊 Cần Ôn Hôm Nay: 2  ← Số thẻ cần ôn hôm nay (ưu tiên)
📊 Đang Học:      15  ← Số thẻ đang được học
📊 Ôn Tập:        43  ← Số thẻ đã học xong
```

### Bước 3: Chọn Bài Học & Bắt Đầu
1. Chọn bài học từ dropdown **"📅 Tất cả Bài"** (hoặc chọn bài cụ thể)
2. Nhấn **"▶️ Bắt Đầu Ôn Tập"**
3. Các thẻ cần ôn hôm nay sẽ được tải

### Bước 4: Ôn Tập Thẻ
Mỗi thẻ hiển thị:
```
┌─────────────────────────────┐
│  Ngày 5 - Mẫu 12           │
│                             │
│        ～ている            │  ← Nhấn để xem chi tiết
│                             │
│                             │
└─────────────────────────────┘

Chi tiết sau khi nhấn:
📖 Ý Nghĩa: "Đang trong quá trình..."
🛠️ Cách Dùng: "Diễn tả hành động đang diễn ra"
💡 Ví Dụ: "彼は本を読んでいます" (Anh ấy đang đọc sách)
```

### Bước 5: Chọn Mức Độ Phản Hồi
Sau khi xem chi tiết, chọn một nút:

| Nút | Ý Nghĩa | Lịch Ôn Tiếp Theo |
|-----|---------|-------------------|
| ❌ Again | "Tôi không nhớ" | Ngày mai (1 ngày) |
| 😐 Hard | "Tôi khó nhớ" | Sau 3 ngày |
| 😊 Good | "Tôi bình thường nhớ" | Sau 7 ngày |
| 😃 Easy | "Tôi dễ nhớ" | Sau 21 ngày |

### Bước 6: Hoàn Thành Phiên Ôn Tập
- Hệ thống tự động chuyển sang thẻ tiếp theo
- Sau khi ôn xong tất cả thẻ, bạn sẽ nhận được thông báo:
  ```
  ✨ Hoàn thành! Bạn đã ôn tập 15 thẻ.
  ```
- Nhấn **"← Quay Lại Dashboard"** để quay về màn hình chính

## Cơ Sở Dữ Liệu Firebase

### Cấu Trúc Lưu Trữ
```
users/{uid}/
├── card_progress/
│   └── day5_grammar12/
│       ├── status: "review"
│       ├── interval: 7
│       ├── ease_factor: 2.52
│       ├── due_date: 1678876800000
│       ├── review_count: 5
│       ├── created_at: 1678012800000
│       └── last_reviewed: 1678790400000
│
└── review_history/
    └── review_001/
        ├── card_id: "day5_grammar12"
        ├── response: "good"
        ├── interval: 7
        ├── ease_factor: 2.52
        └── timestamp: 1678790400000
```

### Giải Thích Các Trường
- **status**: Trạng thái hiện tại của thẻ
- **interval**: Khoảng cách ôn (ngày) tính từ lần ôn cuối
- **ease_factor**: Chỉ số độ khó (càng cao = càng dễ nhớ)
- **due_date**: Ngày nên ôn lại tiếp theo (milliseconds)
- **review_count**: Số lần đã ôn tập
- **response**: Phản hồi chất lượng ("again"/"hard"/"good"/"easy")

## Ví Dụ Kịch Bản Thực Tế

### Phiên Ôn Tập Ngày 1
```
Thẻ: "～ている"

Hôm nay (Ngày 1):
→ Người dùng xem lần đầu
→ Ấn "Good" (Tôi bình thường nhớ)
→ EF mới = 2.5 + (0.1 - (5-3)×0.08) = 2.5 - 0.06 = 2.44
→ Interval mới = 1 × 2.44 = 2-3 ngày (được set = 7 ngày theo quy tắc)
→ Due date = Ngày 8
```

### Phiên Ôn Tập Ngày 8
```
Thẻ: "～ている" (lần ôn thứ 2)

Hôm nay (Ngày 8):
→ Thẻ xuất hiện (do_date <= hôm nay)
→ Người dùng ấn "Easy" (Tôi dễ nhớ)
→ EF mới = 2.44 + (0.1 - (5-4)×0.08) = 2.44 + 0.02 = 2.46
→ Interval mới = 7 × 2.46 ≈ 17 ngày (được set = 21 ngày theo quy tắc)
→ Due date = Ngày 29
```

### Phiên Ôn Tập Nếu Quên
```
Thẻ: "～ている" (nếu ôn lại ngày 10 vì quên)

Hôm nay (Ngày 10):
→ Người dùng không nhớ, ấn "Again"
→ EF mới = 2.46 + (0.1 - (5-0)×0.08) = 2.46 - 0.3 = 2.16
→ Interval mới = 1 ngày (luôn)
→ Due date = Ngày 11 (phải ôn lại ngày mai)
```

## Lợi Ích Của Spaced Repetition

### 🧠 Khoa Học
- Dựa trên nghiên cứu "Forgetting Curve" của Hermann Ebbinghaus
- Tối ưu hóa thời gian học để nhớ lâu dài
- Tránh lãng quên bằng cách ôn tập đúng lúc

### ⏱️ Tiết Kiệm Thời Gian
- Chỉ ôn những thẻ thực sự cần ôn
- Không lãng phí thời gian vào những thẻ đã nhớ vững
- Tập trung vào những phần yếu

### 📈 Hiệu Quả
- Học được lâu dài (retention rate cao)
- Retention rate lên tới 90% sau 1 tháng ôn theo Anki
- Giảm thời gian học so với phương pháp truyền thống

### 🎯 Động Lực
- Theo dõi tiến độ rõ ràng
- Nhìn thấy số thẻ "Cần Ôn" giảm dần
- Cảm giác hoàn thành khi ôn xong toàn bộ

## Mẹo & Thủ Thuật

### 1. Ôn Tập Hàng Ngày
- Luôn kiểm tra dashboard vào buổi sáng
- Chỉ mất 5-10 phút để ôn những thẻ cần thiết
- Tạo thói quen học tập

### 2. Chọn Mức Độ Phản Hồi Chính Xác
- **Again**: Khi hoàn toàn không nhớ hoặc nhớ sai
- **Hard**: Khi cần suy nghĩ lâu hoặc nhớ mơ hồ
- **Good**: Khi nhớ được nhưng phải suy nghĩ một chút
- **Easy**: Khi nhớ ngay lập tức mà không suy nghĩ

### 3. Bắt Đầu Với Bài Cơ Bản
- Luôn học bài "Ngày 1" trước khi bài khác
- Nền tảng vững sẽ giúp học bài tiếp theo dễ hơn
- Tránh tình trạng học "lệch lạc"

### 4. Theo Dõi Tiến Độ
- Ghi chú số thẻ "Cần Ôn" mỗi ngày
- Quan sát xu hướng (tăng/giảm)
- Điều chỉnh chiến lược học nếu cần

### 5. Đặt Mục Tiêu Hàng Tuần
- "Tôi muốn hoàn thành tất cả thẻ Ngày 1-5 tuần này"
- Giúp duy trì động lực
- Tạo cấu trúc cho việc học

## Khắc Phục Sự Cố

### Vấn đề: Dashboard không hiển thị số lượng thẻ
**Giải pháp:**
1. Làm mới trang (Ctrl+R hoặc Cmd+R)
2. Kiểm tra kết nối Firebase
3. Đảm bảo đang đăng nhập với tài khoản Admin

### Vấn đề: Thẻ không xuất hiện trong phiên ôn
**Giải pháp:**
1. Kiểm tra dropdown bài học (chọn "Tất cả Bài")
2. Một số thẻ có thể chưa đến hạn ôn tập
3. Kiểm tra trạng thái thẻ (New/Learning/Review)

### Vấn đề: Dữ liệu không lưu vào Firebase
**Giải pháp:**
1. Kiểm tra kết nối internet
2. Đảm bảo Firebase được khởi động đúng
3. Xem console browser để tìm lỗi

## API & Tích Hợp

### Các Hàm JavaScript Chính
```javascript
// Khởi tạo
initSpacedRepetition()

// Dashboard
loadSpacedRepDashboard()

// Bắt đầu ôn tập
startSpacedRepStudy()

// Ghi lại phản hồi
recordResponse(quality)  // quality: 'again'|'hard'|'good'|'easy'

// Thoát
exitSpacedRepStudy()
```

### Events
```javascript
// Nhấn thẻ để xem chi tiết
#spacedRepFlashcard.click

// Chọn mức độ
#spacedRepAgain.click
#spacedRepHard.click
#spacedRepGood.click
#spacedRepEasy.click
```

## Tham Khảo & Tài Liệu

1. **Anki** - https://apps.ankiweb.net/
2. **SM-2 Algorithm** - https://en.wikipedia.org/wiki/Spaced_repetition
3. **Ebbinghaus Forgetting Curve** - https://en.wikipedia.org/wiki/Forgetting_curve
4. **Piotr Wozniak's Research** - https://www.supermemo.com/

---

**Phiên bản**: 1.0 | **Ngày cập nhật**: 2024 | **Tác giả**: Antigravity Spaced Repetition Engine
