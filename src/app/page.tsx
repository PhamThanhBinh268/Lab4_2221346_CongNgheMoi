import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, BookOpen, Clock, Tag, AlertCircle, FileText } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BookmarkButton } from '@/components/posts/BookmarkButton'
import { isPostBookmarked } from '@/app/posts/actions/bookmark-actions'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const supabase = await createClient()
  
  // Lấy bài viết mới nhất
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(display_name), categories(name, slug)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  // Lấy tất cả danh mục từ bảng categories
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="flex flex-col gap-16 pb-16">
      {error === 'unauthorized' && (
        <div className="container mx-auto px-4 mt-8">
          <Alert variant="destructive" className="rounded-2xl border-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="font-black">Truy cập bị từ chối</AlertTitle>
            <AlertDescription className="font-medium">
              Bạn không có quyền truy cập vào Trang quản trị. Khu vực này chỉ dành riêng cho Quản trị viên (Admin).
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-[#f8fafc] py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-black mb-8 animate-bounce">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            NEW UPDATES RELEASED
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Insightful stories for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">modern thinkers.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
            Explore a world of technology, lifestyle, and creative ideas through our curated articles.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="#latest">
              <Button size="lg" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-8 rounded-2xl text-lg font-black shadow-xl shadow-indigo-100 transition-all active:scale-95">
                Start Exploring <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-10 py-8 rounded-2xl text-lg font-black border-2 border-slate-200 hover:bg-white transition-all active:scale-95 text-slate-600">
                Our Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600">
              <Tag className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-xs">Categories</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Popular Topics</h2>
          </div>
          <p className="text-slate-500 font-medium max-w-xs md:text-right italic">Find exactly what interests you the most.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {categories?.map((cat) => (
            <Link key={cat.id} href={`/category/${cat.slug}`}>
              <Button variant="secondary" className="rounded-2xl px-8 py-7 text-lg font-bold bg-white border border-slate-100 shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all">
                {cat.name}
              </Button>
            </Link>
          ))}
          {(!categories || categories.length === 0) && <p className="text-slate-400 italic">No categories created yet.</p>}
        </div>
      </section>

      {/* Latest Posts */}
      <section id="latest" className="container mx-auto px-4 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600">
              <BookOpen className="w-5 h-5" />
              <span className="font-black uppercase tracking-widest text-xs">Articles</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fresh Stories</h2>
          </div>
          <Link href="/posts" className="text-indigo-600 font-black hover:underline flex items-center gap-2 group">
            View Archive <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-32 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
            <p className="text-2xl font-bold text-slate-300">Quiet for now. New articles coming soon!</p>
          </div>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map(async (post: any) => {
              const isBookmarked = await isPostBookmarked(post.id)
              
              return (
                <div key={post.id} className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="h-64 bg-slate-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                    <div className="absolute top-6 left-6 z-20 flex justify-between w-[calc(100%-3rem)] items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-indigo-600 px-3 py-1.5 rounded-full shadow-lg">
                          {post.categories?.name || 'General'}
                        </span>
                        <BookmarkButton postId={post.id} initialIsBookmarked={isBookmarked} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-700">
                        <FileText className="w-24 h-24 text-indigo-300" />
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-6 flex-1">
                    <div className="space-y-3">
                      <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="text-slate-500 line-clamp-3 font-medium leading-relaxed">
                        {post.excerpt || (post.content ? post.content.substring(0, 150) + '...' : 'No description.')}
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                          {post.profiles?.display_name?.[0] || 'A'}
                        </div>
                        <span className="font-bold text-slate-900">{post.profiles?.display_name || 'Admin'}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(post.published_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

