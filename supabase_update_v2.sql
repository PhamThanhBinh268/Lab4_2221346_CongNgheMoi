-- Thêm cột category vào bảng posts nếu chưa có
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General';
