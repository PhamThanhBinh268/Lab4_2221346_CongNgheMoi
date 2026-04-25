import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
  }

  // 1. Create Mock Categories first
  const mockCategories = [
    { name: 'Technology', slug: 'technology', description: 'Latest tech news and trends.' },
    { name: 'Lifestyle', slug: 'lifestyle', description: 'Daily life stories and tips.' },
    { name: 'Programming', slug: 'programming', description: 'Coding guides and architecture.' },
    { name: 'Education', slug: 'education', description: 'Learning resources for students.' },
  ]

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .upsert(mockCategories, { onConflict: 'slug' })
    .select()

  if (catError) {
    return NextResponse.json({ error: catError.message }, { status: 500 })
  }

  const catMap = Object.fromEntries(categories.map(c => [c.name, c.id]))

  // 2. Create Mock Posts linked to categories
  const mockPosts = [
    {
      author_id: user.id,
      title: 'Khám phá sức mạnh của Next.js 15',
      content: 'Next.js 15 mang đến nhiều cải tiến vượt bậc về hiệu năng và trải nghiệm lập trình viên. Với việc hỗ trợ React 19 và các tính năng mới như tối ưu hóa caching, việc xây dựng ứng dụng web hiện đại chưa bao giờ dễ dàng hơn thế.',
      excerpt: 'Tìm hiểu những điểm mới nhất trong phiên bản Next.js 15 và cách nâng cấp ứng dụng của bạn.',
      category_id: catMap['Technology'],
      status: 'published',
    },
    {
      author_id: user.id,
      title: 'Bí quyết làm chủ Supabase cho người mới',
      content: 'Supabase là sự thay thế mã nguồn mở hoàn hảo cho Firebase. Nó cung cấp đầy đủ các tính năng từ Database (PostgreSQL), Authentication, Storage cho đến Realtime. Bài viết này sẽ hướng dẫn bạn từng bước xây dựng dự án đầu tiên.',
      excerpt: 'Hướng dẫn toàn tập về hệ sinh thái Supabase và các ứng dụng thực tế của nó.',
      category_id: catMap['Technology'],
      status: 'published',
    },
    {
      author_id: user.id,
      title: 'Lối sống tối giản trong kỷ nguyên số',
      content: 'Trong một thế giới đầy rẫy những thông báo và sự xao nhãng, việc áp dụng lối sống tối giản giúp chúng ta lấy lại sự tập trung và bình yên. Hãy cùng khám phá cách "dọn dẹp" không gian số của bạn.',
      excerpt: 'Làm thế nào để duy trì sự cân bằng giữa cuộc sống và công nghệ thông qua tư duy tối giản.',
      category_id: catMap['Lifestyle'],
      status: 'published',
    },
    {
      author_id: user.id,
      title: 'Top 5 thư viện UI tốt nhất cho React năm 2026',
      content: 'Việc lựa chọn thư viện UI phù hợp quyết định đến 50% sự thành công của dự án. Shadcn/ui, Radix UI và Tailwind CSS tiếp tục dẫn đầu xu hướng nhờ khả năng tùy biến cực cao và hiệu năng ấn tượng.',
      excerpt: 'Đánh giá chi tiết các thư viện giao diện đang được ưa chuộng nhất hiện nay.',
      category_id: catMap['Programming'],
      status: 'published',
    },
    {
      author_id: user.id,
      title: 'Hành trình từ Zero đến Full-stack Developer',
      content: 'Trở thành lập trình viên Full-stack không phải là chuyện một sớm một chiều. Nó đòi hỏi sự kiên trì, nỗ lực và một lộ trình học tập đúng đắn. Hãy bắt đầu từ nền tảng HTML/CSS và không ngừng thử thách bản thân.',
      excerpt: 'Chia sẻ lộ trình học tập và những kinh nghiệm quý báu cho các bạn sinh viên IT.',
      category_id: catMap['Education'],
      status: 'published',
    },
  ]

  const { data, error } = await supabase
    .from('posts')
    .insert(mockPosts)
    .select()

  if (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: data.length })
}
