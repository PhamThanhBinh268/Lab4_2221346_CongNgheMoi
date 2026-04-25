# Dự án: Simple Blog - Tính năng Bookmarks (Bài viết yêu thích)

## 1. Mục tiêu
Cho phép người dùng đã đăng nhập có thể lưu (bookmark) các bài viết mà họ quan tâm để xem lại sau trong trang cá nhân hoặc dashboard.

## 2. Phân tích yêu cầu
- **Phía người dùng**: Có nút "Lưu bài viết" ở mỗi thẻ bài viết hoặc trang chi tiết bài viết.
- **Quản lý**: Một trang hiển thị danh sách các bài viết đã lưu.
- **Tính năng**: 
    - Thêm vào danh sách yêu thích.
    - Xóa khỏi danh sách yêu thích.
    - Kiểm tra trạng thái bài viết đã được lưu hay chưa.

## 3. Thiết kế Database (Supabase)
Cần tạo thêm bảng `bookmarks` để lưu trữ quan hệ giữa người dùng và bài viết.

```sql
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Bật RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Chính sách: Người dùng chỉ có thể xem/thêm/xóa bookmark của chính mình
CREATE POLICY "Users can view their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);
```

## 4. Kế hoạch triển khai (Plan)

### Bước 1: Cập nhật Database
- Chạy script SQL tạo bảng `bookmarks` và thiết lập RLS trên Supabase Dashboard.

### Bước 2: Tạo Server Actions
- Tạo file `src/app/actions/bookmarkActions.ts` (hoặc tương đương) để xử lý logic Server-side:
    - `toggleBookmark(postId)`: Thêm hoặc xóa bookmark tùy vào trạng thái hiện tại.
    - `isBookmarked(postId)`: Kiểm tra trạng thái đã lưu.

### Bước 3: Phát triển UI Components
- **BookmarkButton**: Một component nhỏ (Client Component) sử dụng icon `lucide-react` (Heart hoặc Bookmark).
- Tích hợp `BookmarkButton` vào `PostCard` và trang chi tiết bài viết.

### Bước 4: Trang danh sách yêu thích
- Tạo route mới `/bookmarks` hoặc thêm tab "Yêu thích" trong `/dashboard`.
- Fetch dữ liệu từ bảng `bookmarks` join với bảng `posts`.

### Bước 5: Kiểm thử (Testing)
- Đăng nhập với nhiều tài khoản khác nhau để kiểm tra tính riêng tư (RLS).
- Kiểm tra hiệu ứng UI khi nhấn nút (optimistic updates).

---
*Biên soạn bởi AI Assistant - Kế hoạch nâng cấp Lab 4*
