-- 1. Tables Setup

-- Bảng profiles: Mở rộng từ auth.users
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bảng posts: Lưu trữ bài viết
CREATE TYPE post_status AS ENUM ('draft', 'published');

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  status post_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Bảng comments: Lưu trữ bình luận
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Functions & Triggers

-- Trigger tự động tạo profile khi có user mới
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Hàm tạo slug từ title
CREATE OR REPLACE FUNCTION public.slugify(text)
RETURNS text AS $$
DECLARE
  result text;
BEGIN
  result := lower(unaccent($1));
  result := regexp_replace(result, '[^a-z0-9\-]+', '-', 'g');
  result := regexp_replace(result, '^-+|-+$', '', 'g');
  RETURN result;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger tự động tạo slug cho bài viết
CREATE OR REPLACE FUNCTION public.handle_post_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug text;
  final_slug text;
  counter integer := 1;
BEGIN
  base_slug := public.slugify(new.title);
  final_slug := base_slug;
  
  -- Kiểm tra trùng lặp slug (ngoại trừ chính nó khi update)
  WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = final_slug AND id != new.id) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  new.slug := final_slug;
  
  -- Cập nhật published_at nếu chuyển sang published
  IF new.status = 'published' AND (old.status IS NULL OR old.status = 'draft') THEN
    new.published_at := NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_post_insert_update_slug
  BEFORE INSERT OR UPDATE OF title, status ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_post_slug();

-- Trigger cập nhật updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_post_updated
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 3. Row Level Security (RLS)

-- Bật RLS cho các bảng
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Policies cho profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Policies cho posts
CREATE POLICY "Published posts are viewable by everyone" 
  ON public.posts FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view all their own posts" 
  ON public.posts FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authenticated users can create posts" 
  ON public.posts FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can update own posts" 
  ON public.posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts" 
  ON public.posts FOR DELETE USING (auth.uid() = author_id);

-- Policies cho comments
CREATE POLICY "Comments are viewable by everyone for published posts" 
  ON public.comments FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.posts WHERE id = post_id AND status = 'published'));

CREATE POLICY "Authenticated users can insert comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authors can delete own comments" 
  ON public.comments FOR DELETE USING (auth.uid() = author_id);

-- 4. Enable Realtime
-- Cho phép realtime trên bảng comments
ALTER PUBLICATION supabase_realtime ADD TABLE comments;
