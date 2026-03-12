# Spaced Repetition (Lặp lại Ngắt Quãng) - Kiểu Anki

## Cơ chế Hoạt Động

### 1. Trạng Thái Thẻ
- **New** (Mới): Chưa từng ôn
- **Learning** (Đang Học): Đánh dấu sai, chờ ôn lại
- **Review** (Ôn Tập): Đã học, chờ ôn tập định kỳ
- **Suspended** (Tạm Dừng): Bỏ qua ôn tập

### 2. Interval (Khoảng Cách Ôn Tập)
- Khi trả lời **Again** (Sai): Interval = 1 ngày
- Khi trả lời **Hard** (Khó): Interval = 3 ngày
- Khi trả lời **Good** (Bình Thường): Interval = 7 ngày
- Khi trả lời **Easy** (Dễ): Interval = 21 ngày

### 3. Ease Factor (Hệ Số Dễ)
- Ban đầu: EF = 2.5 (Mặc định)
- Công thức tính: `EF_new = EF + (0.1 - (5 - q) * 0.08)`
- Nếu EF < 1.3 → EF = 1.3

Trong đó `q` là quality của câu trả lời:
- 0: Lại (Again)
- 1: Khó (Hard)
- 3: Bình Thường (Good)
- 4: Dễ (Easy)

### 4. Due Date (Ngày Đáo Hạn Ôn Tập)
- `next_due = today + interval`

### 5. Database Schema

```javascript
card_progress: {
  [cardId]: {
    status: 'new' | 'learning' | 'review' | 'suspended',
    interval: 1,          // Số ngày
    ease_factor: 2.5,     // Hệ số dễ
    due_date: 1678977600, // Timestamp
    review_count: 0,      // Số lần ôn tập
    last_reviewed: null,  // Timestamp lần ôn cuối
    created_at: 1678977600
  }
}

review_history: {
  [reviewId]: {
    card_id: 'card_1',
    response: 'again' | 'hard' | 'good' | 'easy',
    interval: 1,
    ease_factor: 2.5,
    timestamp: 1678977600
  }
}
```

### 6. Tính Năng Chính
- Dashboard: Xem số thẻ cần ôn hôm nay
- Study Mode: Hiển thị thẻ + nút Again/Hard/Good/Easy
- Stats: Thống kê tiến độ ôn tập
- Calendar: Xem lịch ôn tập

