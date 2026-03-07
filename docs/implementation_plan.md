# Ứng dụng Antigravity - Flashcard Học Tiếng Nhật

## Tổng Quan Kiến Trúc Nền Tảng (Architecture Overview)

Dự án ban đầu được thiết kế từ một thẻ tĩnh đơn giản trong `/japanese_flashcard/` và phát triển lên thành một hệ thống **Học tập Tương tác Toàn diện (Interactive Learning System)** kết nối thời gian thực với Cơ sở dữ liệu Firebase.

### Các Hệ Thống (Sub-systems) Đã Hoàn Thiện:
1. **Core Flashcard Engine & Swipe Component (`index.html`, `style.css`, `script.js`):**
    - Sử dụng các thuộc tính CSS 3D (`perspective`, `transform-style: preserve-3d`, `rotateY`) để giải lập chiếc Thẻ hai mặt.
    - Xây dựng cử chỉ vuốt Touch/Mouse Drag-and-Drop (kéo-thả). Khi tọa độ ngón tay > 10px, giao diện bắt đầu lật theo ngón tay, và khi thả ra nó sẽ phán đoán Hướng Vuốt: Trái (Quên), Phải (Thuộc).
    - Các nhãn dán Text 2 bên được lập trình **Random (ngẫu nhiên)** giữa 10 từ khóa khích lệ (Ví dụ: "TUYỆT VỜI!", "THỬ LẠI NHÉ!") kèm theo tiêu đề Ngữ pháp hiện tại để ghim chặt vào não bộ.

2. **Smart Quiz Generator (Hệ thống Câu Hỏi Trắc Nghiệm Thông Minh):**
    - Xây dựng lưới giao diện `<div id="quiz-view">`.
    - Sinh tự động câu hỏi dựa trên mảng Object JSON `flashcardsData` trong `data.js`.
    - Thuật toán tạo 1 câu Đúng và trộn lẫn với 3 lựa chọn Sai lấy từ các bài khác.
    - Hỗ trợ xem kết quả tức thì (màu Xanh đúng/ Đỏ sai) cùng nút "Câu tiếp theo" được cấu hình màu tương phản tách rời hoàn toàn với màn hình Flashcard.

3. **Export Canvas Layer (Bộ Động Hình Chụp Ảnh Mạng Xã Hội):**
    - Một template CSS Flex Box (`#exportTemplate`) với khung ảnh `720px` x `min-height 800px` được ngầm cấu hình trong HTML/CSS.
    - Template sử dụng tông màu Gradient Navy/Indigo, loại bỏ phong nền xung quanh khối Ngữ Pháp lõi (`.export-grammar`), phóng to phông chữ Vietsub (`1.25rem - 1.4rem`) để Tối ưu hiển thị cho TikTok/Reels Portrait (9:16).
    - Thư viện Cốt lõi: `html2canvas` vẽ (render) DOM HTML ẩn sang định dạng ảnh PNG và truyền về Local. Cấu hình scale sắc nét x2.

4. **Hệ Thống Phân Quyền Nâng Cao (Firebase Authentication & Admin Role):**
    - Gắn `firebase.auth().onAuthStateChanged((user))`. User Login thông qua các giao thức `signInWithPopup(Google/Facebook)` hoặc `signInWithEmailAndPassword`.
    - Tiến độ thuộc thẻ `my_progress` được đẩy lên `Realtime Database`.
    - **Admin Dashboard**: Cụm code chỉ kích hoạt (Render Table HTML) nếu biến `role === 'admin'`. Quản trị viên theo dõi hàng loạt `uid` người dùng, số lượt logouts, số ảnh Downloads.
    - **Logic Sorting & Filtering**: Kết hợp mảng Javascript Array `.sort()` (cho Login, Download, Learned) và `.filter()` (cho Pending/Approved requests). Thao tác cập nhật tức thì khi đổi Dropdown Status.

## Verification / Validation Checklists

Dự án đã trải qua các đợt kiểm thử sau (Manual Verification):
1. ✅ Giao diện đã đổi: Avatar Facebook hoạt động trơn tru. `guestWarning` ẩn đi khi đăng nhập.
2. ✅ Sắp xếp Admin: Dropdown Menu chọn 'Thời gian' hay 'Số bài đã thuộc' đều thay đổi trật tự xếp hạng trên table thành công ngay lập tức.
3. ✅ Download Button: Giao diện thẻ tải dọc 9:16 (TikTok) hoạt động, phông chữ lớn, chữ Ngữ Pháp về lại màu đỏ nguyên gốc (Red Natural). Nút `Bulk Download` hoạt động mượt mà cho các tài khoản Quản trị.
4. ✅ Quiz View: Nút "Câu tiếp theo" có màu xanh rêu (`#2f855a`), không đụng chạm đến màu của nút Export Flashcard.

## PWA & Tương lai
- Code đã tối ưu cho ứng dụng PWA (`manifest.json` và `sw.js`). Có khả năng cài đặt App Web Cứng vào màn hình Màn hình thiết bị Android/iOS.
- Nền móng Source Code (Vanilla JS + Firebase) sẵn sàng để bổ sung thêm chức năng JLPT View (Thi Thử 120 phút N2) với Timer đếm ngược ở Phrase tiếp theo.
