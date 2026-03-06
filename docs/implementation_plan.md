# Ứng dụng Flashcard Học Tiếng Nhật

Tạo một trang web (HTML/CSS/JS) để học ngữ pháp tiếng Nhật từ file `Flashcard.txt`. Ứng dụng sẽ có giao diện thẻ bài (flashcard) có thể lật (flip) để xem mặt trước và mặt sau, giúp người dùng ghi nhớ ngữ pháp hiệu quả.

## User Review Required
Bạn có đồng ý với thiết kế sau không?
- **Mặt trước:** Tên ngữ pháp (Ví dụ: `〜っこない`)
- **Mặt sau:** Ý nghĩa, Cách dùng, và các Ví dụ đi kèm.
- **Giao diện:** Đẹp, hiện đại, có hiệu ứng lật thẻ 3D khi click chuột. Màu sắc thân thiện, dễ nhìn.

## Proposed Changes

Khu vực làm việc sẽ nằm trong thư mục `/Users/locnm/Downloads/Code/antigravity/japanese_flashcard/`.

---

### Bộ source code ứng dụng

#### [NEW] [index.html](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/index.html)
Thiết lập cấu trúc HTML cho flashcard container, nút điều hướng (nếu có nhiều thẻ), và bao gồm các file CSS/JS.

#### [NEW] [style.css](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/style.css)
Định dạng cho flashcard, sử dụng CSS properties như `perspective`, `transform-style`, `backface-visibility`, và `rotateY` để tạo hiệu ứng lật 3D mượt mà.

#### [NEW] [script.js](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/script.js)
Logic xử lý sự kiện click để thêm/bỏ class lật thẻ. Dữ liệu từ `Flashcard.txt` sẽ được mã hóa tĩnh (hardcoded) vào mảng JavaScript ban đầu để dễ dàng chạy trực tiếp trên trình duyệt mà không cần server.

## Verification Plan

### Manual Verification
1. Dùng lệnh Terminal `open /Users/locnm/Downloads/Code/antigravity/japanese_flashcard/index.html` để mở trang web.
2. Click vào thẻ trên giao diện, kiểm tra xem nó có lật lại và hiển thị đúng chi tiết ngữ pháp, ý nghĩa, cách dùng và ví dụ không.
3. Kiểm tra xem thẻ có lật về mặt trước khi click lần nữa không.

---

# Tính năng mới: Tải ảnh Flashcard để chia sẻ

## Yêu cầu
Người dùng muốn tải nội dung thẻ học dưới dạng Ảnh để chia sẻ lên Facebook, TikTok. Nội dung ảnh cần có bao gồm: Ngữ pháp, Ý nghĩa (và có thể là ví dụ tiêu biểu) trên cùng một khung hình.

## User Review Required
Bạn có đồng ý với thiết kế sau không?
- Thay vì chỉ chụp mặt trước hoặc mặt sau (vốn dĩ độc lập), ứng dụng sẽ tạo ra một layout **"Ảnh chia sẻ"** ẩn. Layout này sẽ chứa đồng thời cả Tên ngữ pháp và Ý nghĩa để ảnh tải xuống có đầy đủ thông tin nhất.
- Nút bấm `📸 Tải ảnh thẻ này` sẽ được đặt bên dưới các nút điều hướng.
- Sử dụng thư viện `html2canvas` để biến thẻ HTML thành file ảnh `.png` và tự động tải về thiết bị.

## Proposed Changes

### [MODIFY] [index.html](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/index.html)
- Tích hợp CDN của thư viện `html2canvas`.
- Thêm một thẻ div `#exportTemplate` (có thể bị ẩn đi khỏi màn hình chính nhưng chứa đầy đủ thiết kế đẹp mắt của cả Title và Meaning).
- Thêm nút Download.

### [MODIFY] [style.css](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/style.css)
- Thiết kế style cho khối `#exportTemplate` sao cho giống một tấm Card hoàn chỉnh phù hợp để làm ảnh story TikTok/FB (tỷ lệ đẹp hoặc khung vuông đẹp).

### [MODIFY] [script.js](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/script.js)
- Thêm hàm xử lý sự kiện click vào nút Download.
- Đồng bộ dữ liệu hiện hành vào `#exportTemplate` trước khi gọi `html2canvas` chụp màn hình khối đó.

## Verification Plan
1. Lại thao tác click vào nút thẻ tải ảnh.
2. Kiểm tra log và file `.png` rơi vào thư mục local (hoặc trình tự động mở Download dialogue trên trình duyệt).
3. Xác nhận ảnh sắc nét, có đủ Ngữ pháp và Ý nghĩa.

---

# Đưa ứng dụng lên Android, iOS và Web (PWA)

## Yêu cầu
Để một trang web HTML/CSS/JS thông thường có thể cài đặt như một ứng dụng Native trên điện thoại (xuất hiện icon trên màn hình chính của Android/iOS, có thể mở full màn hình không hiện thanh địa chỉ trình duyệt, và hoạt động mượt mà), cách tối ưu và nhanh nhất là biến nó thành một **Progressive Web App (PWA)**.

## User Review Required
Bạn có đồng ý với phương pháp PWA này không?
- **PWA (Progressive Web App)** cho phép người dùng Android (qua Chrome) và iOS (qua Safari) mở menu web và chọn mục `"Thêm vào màn hình chính" (Add to Home Screen)`.
- Ứng dụng sẽ có Icon app riêng.
- Ứng dụng sẽ có thể hoạt động **Offline** (không cần mạng) nhờ Service Worker.

## Proposed Changes

Khu vực làm việc sẽ tiếp tục tại `japanese_flashcard/`.

### [NEW] [Xây dựng Icon]
- Tạo ra các file icon `icon-192x192.png` và `icon-512x512.png` bằng SVG/Canvas cho ứng dụng để nhận diện trên màn hình điện thoại.

### [NEW] [manifest.json](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/manifest.json)
- Khai báo tên ứng dụng ("Flashcard Tiếng Nhật"), màu chủ đạo (theme color), và danh sách các Icon.
- Khai báo chế độ `display: standalone` để app chạy full màn hình y như app thật.

### [NEW] [sw.js](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/sw.js)
- Thêm Service Worker để cache (lưu trữ) lại toàn bộ file `index.html`, `style.css`, `script.js` và `Flashcard.txt`. Nếu sau này không có wifi/4G, app vẫn mở được.

### [MODIFY] [index.html](file:///Users/locnm/Downloads/Code/antigravity/japanese_flashcard/index.html)
- Khai báo thẻ `<link rel="manifest" href="manifest.json">`.
- Khai báo các thẻ Meta quan trọng cho iOS (`apple-mobile-web-app-capable`).
- Viết một đoạn script nhỏ cuối trang để đăng ký Service Worker.

## Verification Plan
1. Chạy trên trình duyệt, xem console xem Service Worker đã được cài đặt thành công không.
2. Nếu mở bằng thiết bị giả lập/hoặc Chrome, sẽ thấy biểu tượng tải xuống App trên thanh tìm kiếm.
