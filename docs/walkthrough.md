# Antigravity Japanese Flashcard - Bách Khoa Toàn Thư (Walkthrough)

## 📌 Khái quát Dự án (Overview)
Từ một tài liệu `Flashcard.txt` dạng văn bản thô, ứng dụng này đã được xây dựng và biến hình thành một cỗ máy học Ngữ Pháp Tiếng Nhật N2 đầy mạnh mẽ mang tên **Antigravity**. Hệ thống hiện nay phát triển đầy đủ các tính năng Học Tương Tác, Kiểm tra và Quản lý Lớp học thời gian thực (Real-time).

Người dùng (User) có thể lướt xem thẻ, lật mặt sau (`rotateY`), ôn tập trắc nghiệm và tải ảnh ra nền tảng mạng xã hội khoe thành quả. Trong khi Quản trị viên (Admin) được cấp quyền theo dõi hành vi, phê duyệt lệnh tải và xóa dữ liệu những người dùng ngừng hoạt động.

## 📁 Cấu Trúc File Chính (Core Files)
- `index.html`: Bộ xương HTML phân chia thành 4 View (`Flashcard View`, `Quiz View`, `JLPT View` và `Admin View`). Tích hợp Firebase SDK (`app`, `auth`, `database`).
- `style.css`: Quản trị UI/UX của toàn bộ ứng dụng. Kéo dãn thiết kế theo Responsive Mobile:
  - Gradient Backgrounds sang trọng (`#3e6e9b` -> `#464479`, `Xanh Lá Quiz`, Đỏ Cảnh Báo).
  - Khung ẩn Tải thẻ dọc (Portrait TikTok) kích cỡ `720px * 800px` mượt mà, viền trắng mờ `blur(10px)` (Kỹ thuật Glassmorphism).
- `script.js`: Bộ não vận hành với các hàm kéo thả thẻ, xác thực Auth, bộ đếm điểm, lặp vòng (Loop) sinh ảnh và sắp xếp Dashboard (Sort / Filter User).
- `data.js`: Kho Dữ Liệu Ngữ Pháp Nhật-Việt (Array of Objects) đi kèm hệ thống phiên âm Furigana động.

## 🚀 Các Tính Năng Đỉnh Cao Kỹ Thuật Số (Feature Walkthrough)

### 1. Tinder-Swipe & Random Motivation
Khi đang xem giải nghĩa ở mặt sau thẻ, người học chỉ cần dùng ngón tay Vuốt thẻ sang Trái (Failed - Quên Từ) hoặc Phải (Passed - Thuộc Từ). Hiệu ứng tem đánh giá (`swipe-stamp.red/green`) sẽ nghiêng 15 độ, hiển thị ngay trên mặt thẻ cùng tên của Cấu trúc ngữ pháp để "Đóng dấu" vào não bộ. Các câu Slogan (như "ĐỈNH CỦA CHÓP", "CỐ LÊN NÀO!") liên tục xáo trộn (Math.random()) để chống lại sự nhàm chán.

### 2. Export Card (Mạng Xã Hội TikTok/Facebook Layer)
Học viên có thể tải thẻ bài đã học về máy thông qua Engine `html2canvas`. Khung hình lưu về không bị lệch hoặc méo nhờ chế độ Scale x2, mang một layout hình chữ nhật dọc `9:16`. Tên Ngữ Pháp nằm chễm chệ to bự với font `2.8rem`, đỏ rực, cùng thiết kế bảng Ý Nghĩa, Ví Dụ bo góc tinh tế nằm sát phần ghi nguồn Website & TikTok Footer.

### 3. Dynamic Quiz System (Hệ Thống Trắc Nghiệm Động)
Ở thẻ "Trắc Nghiệm 🎯", thuật toán JS sẽ lấy **Ngữ Pháp chính (Core Grammar)** ở Day/Week mà bạn chọn làm Đích, đồng thời nhặt Random 3 cấu trúc Ngữ Pháp không liên quan để tạo thành 4 nút đáp án. Màu xanh lá chuối sẽ hiện ra nếu bạn chọn đúng, hoặc Đỏ còi báo động nếu sai. Sau khi submit, nút **"Câu tiếp theo ❯" (Xanh Rêu đậm `btn-quiz-next`)** sẽ hiện ra.

### 4. Bảng Quản Trị Hệ Thống Nâng Cao (Admin Dashboard)
Chỉ những Account có gắn mác `role: 'admin'` trên Database mới nhìn thấy màn hình này (Gia tăng Tính Bảo Mật).
- **Trạng thái Real-time (Active Status)**: Server đọc dấu mốc `lastLogin` của UID. Báo `'🔴 Ngoại tuyến'` trực tiếp nếu quá 24h không mở App.
- **Bộ Lọc Siêu Tốc (Super Filters UI)**: Nhờ sự kết hợp của `.filter()` và `.sort()` JS Array Function:
  - Khả năng Lọc người xin phép Tải Card (`Pending / Approved`). Dễ dàng phê duyệt cho thành viên VIP (Nút "Duyệt tải" màu cam).
  - Khả năng Điểm Danh Top những học sinh Xuất Sắc hoặc Lười nhác thông qua thao tác xổ Dropdown Sắp xếp ("Tải/Học Nhiều Nhất").
- **Nhấn Lệnh Tải Hàng Loạt (Bulk Image Download Button)**: Admins có thể bấm Tải một nhát là máy tự động sinh và đẻ ra toàn bộ số Lượng Thẻ của Ngày (DAY_X) đang đứng và Auto-save xuống ổ cứng Máy Tính.

## 📲 Chuẩn PWA (Cài đặt Offline trên Điện thoại)
Với 2 file `manifest.json` và `sw.js` (Service Worker), người dùng hoàn toàn có thể "Thêm vào màn hình chính" (Add to Homescreen) từ trình duyệt Google Chrome/Safari trên Android và iPhone. Ứng dụng biến hóa giao diện toàn màn hình, không bị lộ URL và có dung lượng nhẹ như chiếc lông vũ!

## 🔧 How to Run it (Tự tay chạy Source)
Máy chủ ảo (Local Server) là điều bắt buộc để html2canvas không bị dính chấu CORS khi vẽ hình ảnh:
```bash
# MacOS / Linux mở Terminal và phi thẳng lệnh này:
python3 -m http.server 8000
```
Sau đó truy cập **[http://localhost:8000](http://localhost:8000)** và tận hưởng cỗ máy học thuật Nhật Bản này! Mở Log trình duyệt F12 nếu muốn soi Data Firebase trả về.
