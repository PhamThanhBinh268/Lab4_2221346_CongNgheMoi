# Hướng dẫn cấu hình môi trường phát triển (Dev) cho Dự án Simple Blog

Chào bạn! Chào mừng bạn đến với thế giới của Next.js và Supabase. Tài liệu này được biên soạn dành riêng cho các bạn sinh viên mới bắt đầu, giúp bạn thiết lập dự án từ con số 0 một cách dễ dàng nhất.

---

## 1. Yêu cầu chuẩn bị
Trước khi bắt đầu, hãy đảm bảo máy tính của bạn đã cài đặt:
*   **Node.js**: Phiên bản 18.0 trở lên (Khuyên dùng v20+).
*   **Trình soạn thảo mã nguồn**: Visual Studio Code (VS Code).
*   **Trình duyệt**: Chrome, Edge hoặc Firefox.

---

## 2. Bước 1: Thiết lập dự án trên máy cục bộ (Local)
1.  **Tải mã nguồn**: Nếu bạn nhận dự án qua Git, hãy dùng lệnh `git clone`. Nếu nhận thư mục, hãy mở thư mục `simple-blog` bằng VS Code.
2.  **Cài đặt thư viện**: Mở terminal trong VS Code (Ctrl + `) và chạy lệnh:
    ```bash
    npm install
    ```

---

## 3. Bước 2: Thiết lập Backend với Supabase (Cực kỳ quan trọng)
Supabase đóng vai trò là Cơ sở dữ liệu và Hệ thống đăng nhập của bạn.

1.  **Tạo tài khoản & Dự án**:
    *   Truy cập [supabase.com](https://supabase.com/) và đăng ký tài khoản (miễn phí).
    *   Nhấn **New Project**, chọn tên dự án (ví dụ: `My Simple Blog`) và đặt mật khẩu cho Database. Đợi khoảng 1-2 phút để dự án khởi tạo.
2.  **Thiết lập bảng (Database Setup)**:
    *   Trong giao diện Supabase, tìm mục **SQL Editor** (biểu tượng `>_` ở cột bên trái).
    *   Nhấn **New query**.
    *   Mở file `supabase_setup.sql` trong dự án của bạn, copy toàn bộ nội dung và dán vào ô SQL Editor này.
    *   Nhấn **Run**. Lệnh này sẽ tự động tạo các bảng `profiles`, `posts`, `comments` và thiết lập các quy tắc bảo mật (RLS).
3.  **Lấy thông tin kết nối**:
    *   Vào mục **Project Settings** (biểu tượng bánh răng) -> **API**.
    *   Copy **Project URL** và **anon public key**.

---

## 4. Bước 3: Cấu hình biến môi trường (.env)
Dự án cần các thông tin từ Supabase để hoạt động.

1.  Trong thư mục gốc dự án, bạn sẽ thấy file `.env.local`. Nếu chưa có, hãy tạo mới.
2.  Dán thông tin bạn vừa copy ở Bước 3 vào:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=dán_url_của_bạn_vào_đây
    NEXT_PUBLIC_SUPABASE_ANON_KEY=dán_key_của_bạn_vào_đây
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    ```

---

## 5. Bước 4: Chạy dự án
Quay lại terminal trong VS Code và chạy lệnh:
```bash
npm run dev
```
Bây giờ, hãy mở trình duyệt và truy cập: [http://localhost:3000](http://localhost:3000).

---

## 6. Một số lưu ý cho người mới bắt đầu
*   **Đăng ký tài khoản**: Bạn có thể vào trang `/register` để tạo tài khoản đầu tiên. Sau khi đăng ký, hãy kiểm tra mục **Authentication** trên Supabase Dashboard để thấy user mới.
*   **RLS (Row Level Security)**: Đây là tính năng bảo mật của Supabase. Nó đảm bảo rằng "Chỉ có bạn mới được sửa bài viết của chính bạn". Nếu bạn không thể sửa bài, hãy kiểm tra lại các chính sách RLS trong file SQL.
*   **Server Actions**: Dự án sử dụng Next.js Server Actions (các file trong thư mục `actions/`) để xử lý dữ liệu. Đây là cách hiện đại giúp bạn viết code xử lý Backend ngay trong dự án Next.js mà không cần tạo thêm API riêng biệt.
*   **Shadcn/UI**: Các thành phần giao diện như Button, Input nằm trong `src/components/ui`. Bạn có thể tùy chỉnh CSS của chúng bằng Tailwind CSS.

---

Chúc bạn có những trải nghiệm học tập thú vị với dự án này! Nếu gặp lỗi, hãy kiểm tra kỹ terminal xem có thông báo lỗi màu đỏ nào không nhé.