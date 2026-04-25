import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PlusCircle, Search, FileText, Eye, Edit3, Trash2, Calendar, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { deletePost } from '@/app/posts/actions/post-actions'
import { cn } from '@/lib/utils'

export default async function PostsListPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('*, categories(name)')
    .eq('author_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Post Management</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Review and refine your digital stories.
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95 font-bold">
            <PlusCircle className="w-5 h-5" />
            Write New Story
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 max-w-md bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Search your articles..."
            className="pl-12 border-none bg-transparent focus-visible:ring-0 text-lg py-6"
          />
        </div>
      </div>

      {!posts || posts.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem] p-20 text-center">
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Your desk is empty</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Time to share your thoughts with the world. Start writing your first article now.</p>
            </div>
            <Link href="/dashboard/posts/new">
              <Button variant="outline" className="rounded-xl px-8 py-6 border-slate-200 hover:bg-white transition-all">Start Writing</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div key={post.id} className="group bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row md:items-center gap-8">
              <div className="w-full md:w-48 h-32 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors shrink-0 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5" />
                 <FileText className="w-10 h-10 text-slate-200 group-hover:text-indigo-200 transition-colors relative z-10" />
              </div>
              
              <div className="flex-1 space-y-4 min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-black text-2xl text-slate-900 truncate group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                    <span className={cn(
                      "text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest",
                      post.status === 'published' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                    )}>
                      {post.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-6 text-sm font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-4 h-4 text-indigo-400" />
                      <span className="text-slate-600">{(post.categories as any)?.name || 'Uncategorized'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-slate-500 line-clamp-1 font-medium italic">
                  {post.excerpt || 'No summary available for this article.'}
                </p>
              </div>

              <div className="flex items-center gap-3 md:border-l md:pl-8 border-slate-100">
                <Link href={`/posts/${post.slug}`} target="_blank">
                  <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 shadow-sm border border-transparent hover:border-indigo-100">
                    <Eye className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href={`/dashboard/posts/edit/${post.id}`}>
                  <Button variant="ghost" size="icon" className="w-12 h-12 rounded-xl hover:bg-amber-50 hover:text-amber-600 shadow-sm border border-transparent hover:border-amber-100">
                    <Edit3 className="w-5 h-5" />
                  </Button>
                </Link>
                <form action={async () => {
                  'use server'
                  await deletePost(post.id)
                }}>
                  <Button variant="ghost" size="icon" type="submit" className="w-12 h-12 rounded-xl hover:bg-rose-50 hover:text-rose-600 shadow-sm border border-transparent hover:border-rose-100">
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
