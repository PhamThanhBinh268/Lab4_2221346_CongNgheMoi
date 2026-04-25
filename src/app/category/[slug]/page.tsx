import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Clock, Tag, FileText, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  // 1. Fetch category info
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  // 2. Fetch posts in this category
  const { data: posts } = await supabase
    .from('posts')
    .select('*, profiles(display_name), categories(name)')
    .eq('status', 'published')
    .eq('category_id', category.id)
    .order('published_at', { ascending: false })

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-16 space-y-6">
        <Link href="/" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-indigo-600">
            <Tag className="w-6 h-6" />
            <span className="font-black uppercase tracking-[0.2em] text-sm">Topic Discovery</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            {category.name}
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium leading-relaxed italic">
            {category.description || `Exploring the depths of ${category.name}. Read our latest insights and guides.`}
          </p>
        </div>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="text-center py-32 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50">
          <p className="text-2xl font-bold text-slate-300 italic">No articles found in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <div key={post.id} className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
               <div className="h-64 bg-slate-100 relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/10 to-purple-50/10" />
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
          ))}
        </div>
      )}
    </div>
  )
}
