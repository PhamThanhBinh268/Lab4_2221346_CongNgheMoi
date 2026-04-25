-- 1. Tạo bảng categories
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Kích hoạt RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 3. Tạo RLS Policies
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Categories are viewable by everyone') THEN
        CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can insert categories') THEN
        CREATE POLICY "Admin can insert categories" ON public.categories FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can update categories') THEN
        CREATE POLICY "Admin can update categories" ON public.categories FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin can delete categories') THEN
        CREATE POLICY "Admin can delete categories" ON public.categories FOR DELETE USING (
            EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
    END IF;
END $$;

-- 4. Thêm category_id vào posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL;

-- 5. Di chuyển dữ liệu cũ (từ text sang table)
INSERT INTO public.categories (name, slug)
SELECT DISTINCT category, lower(replace(category, ' ', '-'))
FROM public.posts 
WHERE category IS NOT NULL AND category != ''
ON CONFLICT (slug) DO NOTHING;

UPDATE public.posts p
SET category_id = c.id
FROM public.categories c
WHERE lower(replace(p.category, ' ', '-')) = c.slug;
