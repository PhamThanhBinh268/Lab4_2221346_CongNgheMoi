# Dự án: Simple Blog - Tính năng Real-time Notifications (Thông báo tức thời)

## 1. Tầm nhìn dự án
Nâng cấp trải nghiệm tương tác bằng cách thông báo cho người dùng ngay lập tức khi có các hoạt động mới (bình luận, phản hồi) liên quan đến họ mà không cần tải lại trang.

## 2. Logic nghiệp vụ (Business Logic)
- **Sự kiện kích hoạt**: Khi một dòng mới được thêm vào bảng `comments`.
- **Đối tượng nhận**: Chủ sở hữu bài viết (Author) nhận được thông báo.
- **Trạng thái thông báo**: `unread` (chưa đọc) và `read` (đã đọc).
- **Kỹ thuật**: Sử dụng **Supabase Realtime Listeners** để bắt sự kiện INSERT.

## 3. Thiết kế Cơ sở dữ liệu (Database Schema)
Cần bảng `notifications` để lưu trữ lịch sử thông báo.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Người nhận
  actor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Người gây ra hành động
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chính sách bảo mật RLS
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
```

## 4. Kế hoạch triển khai (Plan)

### Giai đoạn 1: Database & Realtime
- Tạo bảng `notifications` và bật tính năng **Realtime** cho bảng này trong Supabase Dashboard.
- Viết Database Trigger để tự động tạo thông báo khi có `comments` mới.

### Giai đoạn 2: Notification Component
- Tạo một `NotificationBell` component ở thanh Header.
- Sử dụng `supabase.channel()` để lắng nghe các thay đổi thời gian thực.

### Giai đoạn 3: Server Actions
- Tạo action `markAsRead(notificationId)` để cập nhật trạng thái khi người dùng nhấn xem.

---
*Biên soạn bởi AI Assistant - Tài liệu nâng cấp Lab 4 (Version 2)*
