 # Japanese Grammar Flashcard Application - Walkthrough

## Overview
Dựa trên yêu cầu và nội dung từ `Flashcard.txt`, một ứng dụng Web (HTML/CSS/JS) học ngữ pháp tiếng Nhật đã được xây dựng thành công. 

Ứng dụng cho phép bạn xem thông tin ngữ pháp dưới dạng Thẻ lật (Flashcard) trực quan, đẹp mắt và dễ học.
- **Mặt trước:** Hiển thị tựa đề ngữ pháp `〜っこない`.
- **Mặt sau:** Trình bày chi tiết về: Ý nghĩa, Cách dùng, Lưu ý và 2 ví dụ (kể cả phiên âm Hiragana trên ví dụ).

## File Structure
Source code được lưu tại thư mục `/Users/locnm/Downloads/Code/antigravity/japanese_flashcard/` bao gồm:
- `index.html`: Cấu trúc thẻ 3D (`front`, `back`).
- `style.css`: Hệ thống thiết kế màu sắc, layout flexbox, typography tiếng Nhật và đặc biệt là animation lật thẻ bằng property `transform: rotateY()`.
- `script.js`: Xử lý click lật thẻ (Thêm/xoá class `.flipped`). Database thẻ được mô hình hoá dưới dạng mảng JSON `flashcardsData` để dễ định dạng sau này cho nhiều ngữ pháp khác.

## Các Tính Năng Được Cập Nhật (Ngày 06/03)

### 1. Nút Theo Dõi & Lọc Trạng Thái Học (Filter Logic)
- **Đánh dấu thẻ**: Nút "Đánh dấu Đã thuộc ✅" phía dưới giúp bạn phân biệt ngữ pháp này mình đã ghi nhớ lâu chưa.
- **Huy hiệu (Badge) thời gian thực**: Góc mặt trước sẽ luôn hiển thị trạng thái `🔴 Chưa thuộc` hoặc `✅ Đã thuộc` tuỳ vào thiết lập của bạn.
- **Lưu LocalStorage**: Dữ liệu trạng thái thuộc bài được lưu tại trình duyệt web nên nếu bạn đóng web và mở lại, nó vẫn còn lưu.
- **Bộ Lọc**: Phía trên cùng có một Menu Dropdown giúp bạn tập trung chỉ vào những thẻ "Chưa thuộc" để ôn tập hiệu quả.

### 2. Tải Ảnh Mạng Xã Hội (Export to Image 📸)
Để thuận tiện chia sẻ kiến thức lên Story (Facebook, Instagram, TikTok), ứng dụng nay có thêm tính năng "Chụp lại thẻ".
- **Cách thức hoạt động**: Thay vì chụp riêng lẻ mặt trước (mất giải nghĩa) hay mặt sau (vắng tựa đề), ứng dụng tự ngầm định tạo ra một thiết kế **Bố cục dạng thẻ vuông chuẩn đẹp** chứa đồng thời Ngữ pháp nổi bật và Nội dung ngay phía dưới.
- **html2canvas**: Thư viện này tự động render thẻ ẩn này thành ảnh `PNG` độ nét cao `x2` và tải tự động về máy với tên chuẩn chỉ như `TuVung_*.png`.

### 3. Hỗ trợ Cài đặt App (PWA 📲)
Vừa được cập nhật! Bây giờ bạn có thể mang ứng dụng Flashcard này lên điện thoại của mình để học mọi lúc mọi nơi như một ứng dụng Native, hỗ trợ cả lúc mất mạng (Offline).
- **Trên iPhone/iPad (iOS)**: 
  - Mở trang web này bằng trình duyệt Safari.
  - Bấm vào nút **Chia sẻ (Share)** ở dưới đáy màn hình.
  - Chọn **Thêm vào MH chính (Add to Home Screen)**.
- **Trên Android**: 
  - Mở web bằng Chrome.
  - Sẽ có một popup hiện lên gợi ý **"Thêm Flashcard vào Màn hình chính"**, chỉ cần ấn Cài đặt.
  - Nếu không có popup, bấm vào menu 3 chấm ở góc phải ⇨ Chọn **Cài đặt ứng dụng / Thêm vào màn hình chính**.
- Ứng dụng sẽ có một Icon chữ "あ" cực dễ thương trên màn hình điện thoại của bạn!

## Verification
- ✅ Trạng thái Load/Lưu LocalStorage hoạt động ổn định.
- ✅ Bố cục chia sẻ lên hình không bị lỗi FONT.
- ✅ Service Worker (sw.js) và manifest đã được thiết lập đúng chuẩn PWA.

## How to Try It
Nếu đang dùng máy tính:
```bash
open /Users/locnm/Downloads/Code/antigravity/japanese_flashcard/index.html
```
