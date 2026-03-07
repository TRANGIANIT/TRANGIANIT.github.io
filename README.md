# Antigravity - Thẻ Học Ngữ Pháp Tiếng Nhật 🌸

Chào mừng bạn đến với **Antigravity**. Đây là một dự án Web App học tập Tiếng Nhật tương tác, tập trung vào việc ghi nhớ các mẫu cấu trúc ngữ pháp thông qua phương pháp "thẻ học" (Flashcard 3D) và ôn luyện "trắc nghiệm" (Quiz). Ứng dụng cũng hỗ trợ Quản trị viên (Admin) cấp quyền theo dõi tiến độ người dùng, cũng như xuất và tải ảnh thẻ lên mạng xã hội (TikTok, Facebook).

---

## 🏗 Kiến Trúc & Công Nghệ (Tech Stack)

Dự án này được thiết kế theo hướng **"Vanilla / No Build-tools"** để đảm bảo tốc độ tải cực nhanh, dễ dàng deploy và ai cũng có thể đọc hiểu code mà không cần tốn thời gian cấu hình Webpack hay Node.js cồng kềnh.

- **Frontend (Giao diện Ngôn ngữ Trình duyệt)**:
  - `HTML5`: Layout và cấu trúc ứng dụng (`index.html`).
  - `CSS3`: Phong cách (tệp `style.css`), bao gồm hiệu ứng lật thẻ 3D (`rotateY(180deg)`), hiệu ứng rơi hoa anh đào (Sakura drop), và tùy biến hình dạng Thẻ Xuất Ảnh (thiết kế Portrait kích thước tối ưu mạng xã hội TikTok/Facebook).
  - `JavaScript (ES6+)`: Các logic cốt lõi đóng gói trong `script.js` (Thao tác DOM, Kéo thả thẻ vuốt kiểu Tinder-swipe, Thuật toán sinh Quiz ngẫu nhiên) và `data.js` (Chứa dữ liệu tĩnh của toàn bộ các ngày học Ngữ Pháp/Từ Vựng).
  
- **Backend & Database (Hệ sinh thái Firebase Service)**:
  - **Firebase Authentication (Xác thực)**: Hệ thống quản lý Đăng ký / Đăng nhập ẩn danh (với tài khoản Google, Facebook) hoặc bằng Mật khẩu thông thường bảo mật.
  - **Firebase Realtime Database (Cơ sở dữ liệu đám mây)**: Lưu trữ và đồng bộ hóa tiến độ học (`my_progress`), vai trò của tài khoản (`profile.role`: 'user' hay 'admin'), thống kê lượng truy cập (`profile.loginCount`), đếm số từ đã thuộc, và cập nhật trạng thái xin phép tải ảnh (`profile.downloadStatus`: 'pending', 'approved', 'none').

- **Thư viện Thuộc Đối tác Thứ 3 (Third-party Libraries)**:
  - `html2canvas (v1.4.1)`: Công nghệ (Engine) vẽ màn hình trực tiếp từ các nút HTML sang dữ liệu mã hóa Canvas và xuất hình ảnh `.PNG` vào máy của người dùng.

---

## ✨ Các Chức Năng Cốt Lõi (Core Features)

### 1. Flashcard View (Màn hình Thẻ Học 3D & Swipe) 📇
- Khả năng lọc Ngữ Pháp theo "Từng Ngày (Day) / Bài học". Chế độ **Guest (Chưa Đăng nhập)** chỉ truy cập được duy nhất Ngày 1 nhằm dùng thử. Yêu cầu tạo tài khoản để mở khóa toàn bộ các Ngày còn lại.
- **Tương tác Lật Thẻ**: Học viên nhấp (Click) vào giữa thẻ 3D để thẻ lộn ngược hiển thị form Ý Nghĩa, giải thích Cấu trúc đi kèm, Ghi chú trọng tâm và các câu Ví dụ minh hoạ song ngữ Nhật-Việt kèm hệ thống Furigana (chữ phiên âm).
- **Đánh giá Trực quan Tinder-Swipe**: Khi lật thẻ xem đáp án, học viên sẽ phải vuốt nắm kéo thả chiếc thẻ sang hai bên màn hình:
  - **Vuốt Bên Phải** (Hiện Nhãn "ĐÃ THUỘC" - Kèm lời khen ngợi Random): Đánh dấu mã thẻ đó thành thuộc (Lưu Progress vào Firebase). Cập nhật màu xanh cho nút điều hướng.
  - **Vuốt Bên Trái** (Hiện Nhãn "CHƯA THUỘC" - Kèm lời an ủi Random): Khôi phục nút đỏ, yêu cầu học sinh học lại sau.

### 2. Image Export Feature (Xuất Ảnh Dọc - TikTok / Facebook Format) 📸
- Một mẫu xuất ảnh (`export-template`) với khung nền Hoa Anh Đào (Sakura pattern tĩnh đẹp mắt). Kích thước xuất được tối ưu theo định dạng màn hình dọc Portrait tỉ lệ vàng 9:16 (Resize `720px * Min Height 800px` và Scale gấp 2 lần bằng `html2canvas` để lên Tiktok đạt độ phân giải Full HD (1440x1600)). 
- Hỗ trợ học sinh thiết kế và xuất cấu trúc ngữ pháp chữ màu đổ rõ to, nổi bật thành viên học lập cùng trang web tác giả Roku 76.
- Có khả năng duyệt Tải ảnh hàng loạt (Loop Generate) cho Admin tải cả 1 DAY.

### 3. Quiz View (Kiểm tra Trắc Nghiệm Thông Minh) 🎯
- Tự động xáo trộn kho `data.js` để nhặt ra 4 đáp án (1 đúng, 3 sai random từ các bài học khác).
- Tính năng Lọc các mốc kiểm tra theo Tuần và Bài học. Cung cấp chức năng chữa lỗi, hiển thị màu xanh/đỏ phản hồi nếu người dùng bấm nhầm đáp án, nút "Câu tiếp theo" tự động hiện ra với một màu tương phản dễ phân biệt.

### 4. Admin Dashboard (Bảng Điều khiển Quản trị hệ thống) 🛡️
Bằng cách gán lệnh kiểm tra vai trò `role === 'admin'` trên Database, trang Dashboard quyền lực sẽ xuất hiện với các chức năng tối tân:
- Cho phép xem trực tiếp toàn bộ dữ liệu thống kê của tất cả người tham gia: Hoạt động cuối cùng (Last Login), lượng Login, lượng học thuộc, ảnh tải, trạng thái xin cấp phép...  
- **Tìm kiếm, Bộ lọc & Sắp Xếp Nâng cao (Filter & Sort)**: Sắp giảm dần thành viên hoạt động nhiều, tải nhiều, thuộc nhiều hoặc chia theo Status Pending.
- Toàn quyền cập nhập trạng thái Duyệt (Approve), Thu Hồi Quyền Tải (Revoke), và Xoá rác (Delete Account/Progress).

---

## 🚀 Hướng Dẫn Cấu Hình (Installation & Setup Guide)

Do dự án này theo kiến trúc Client-side serverless (nhẹ nhàng tuyệt đối) nên không cần thiết lập môi trường Node Server phức tạp. Chỉ cần làm theo 4 bước nhỏ dưới đây:

### Bước 1: Clone Source Code Về Trạm Làm Việc (Local)
Sử dụng Git để kéo code gốc về thư mục trên máy của bạn:
```bash
git clone https://github.com/TRANGIANIT/TRANGIANIT.github.io.git
cd TRANGIANIT.github.io
```

### Bước 2: Setup Database trên Firebase Console
Linh hồn của Web App này là Firebase. Bạn bắt buộc cần khai báo chuỗi cấu hình liên kết từ Server Google theo chỉ dẫn sau:
1. Đăng nhập [Firebase Console](https://console.firebase.google.com/).
2. Nhấn nút **Tạo Dự Án mới (Add Project)** (Khuyến nghị không bật Google Analytics cho project test này).
3. Đăng ký dạng Web App (`</>`) để Firebase thiết lập 1 chuỗi tham số SDK mang tên `firebaseConfig`.
4. Mở file `script.js` qua VSCode (tìm dòng lệnh từ 8 -> 17) và **thay thế Object Config** của tôi bằng các thông số dành riêng cho App của bạn:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT.firebaseapp.com",
     databaseURL: "https://YOUR_PROJECT.firebaseio.com", // Đừng quên copy dòng DataBase này
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT.appspot.com",
     messagingSenderId: "SENDER_ID",
     appId: "APP_ID"
   };
   ```

### Bước 3: Tinh chỉnh Quyền Đăng Nhập & Quy Khóa (Security Rules) Firebase
1. Tại thư mục **Build >> Authentication**: Khởi chạy (Get Started) sau đó vào phần `Sign-in methods`, chọn và Bật 2 dịch vụ là `Email/Password` và `Google`. *(Với Google, cần khai báo thêm OAuth client trong Google Cloud nếu domain của bạn sau này đẩy lên Live).*
2. Tại Thư mục **Build >> Realtime Database**: Tạo 1 Test Database ban đầu. Sau đó đi tới thẻ **Quy tắc (Rules)** để đảm bảo người khác không làm loạn hệ thống. Cấu hình bảo mật tốt nhất được gợi ý như sau:
   ```json
   {
     "rules": {
       // Chỉ được truy cập nếu đã login
       ".read": "auth != null", 
       ".write": "auth != null",
       "users": {
           "$uid": {
                // Người dùng chỉ xem/viết Progress của chính họ. Hoặc Admin có quyền xem/viết của tất cả user.
                ".read": "$uid === auth.uid || root.child('users').child(auth.uid).child('profile').child('role').val() === 'admin'",
                ".write": "$uid === auth.uid || root.child('users').child(auth.uid).child('profile').child('role').val() === 'admin'"
           }
       }
     }
   }
   ```
> **Để Thăng Cấp (Promote) Bạn lên làm Quản Trị Viên (Admin Root):** Hãy dùng Email của bạn Đăng Nhập vào web App như một user bình thường. Sau đó truy cập bảng Realtime Database trên trang chủ Firebase -> tìm mũi tên chĩa theo đường dẫn `/users/UID_cua_ban/profile/role` rồi sửa chuỗi giá trị từ chữ `"user"` biến thành `"admin"`. Reload bằng F5 lại web app và trải nghiệm!

### Bước 4: Chạy Máy Chủ Nội Bộ (Khởi động Localhost)
Bạn **KHÔNG NÊN** nhấp đúp click thẳng vào file `index.html` vớ trình duyệt vì cơ chế bảo mật CORS của trình duyệt hiện tại sẽ cản trở thư viện Firebase hoặc `html2canvas` load file ảnh offline.
Thay vào đó:
* **VS Code Editor**: Tải tiện ích Extension **Live Server** và nhấn góc phải dưới chọn `Go Live`.
* **Đối với Terminal (macOS/Linux)**: Chỉ việc đứng vào thư mục codebase và khởi chạy port `8000` với Python3 mặc định:
   ```bash
   python3 -m http.server 8000
   ```
Truy cập qua [http://localhost:8000](http://localhost:8000) để trải nghiệm thành quả 💻.

---
**Chúc các lập trình viên khám phá tốt và nâng cấp hiệu quả Antigravity!** 🌸🇻🇳🇯🇵