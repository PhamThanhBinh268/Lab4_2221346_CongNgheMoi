import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/comments/CommentSection'

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  
  // Fetch post details
  const { data: post } = await supabase
    .from('posts')
    .select('*, profiles(display_name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (!post) {
    notFound()
  }

  // Fetch comments
  const { data: comments } = await supabase
    .from('comments')
    .select('*, profiles(display_name, avatar_url)')
    .eq('post_id', post.id)
    .order('created_at', { ascending: false })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <article className="prose prose-slate lg:prose-xl mx-auto">
        <header className="mb-8 not-prose">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>By {post.profiles?.display_name || 'Anonymous'}</span>
            <span>•</span>
            <span>{new Date(post.published_at).toLocaleDateString()}</span>
          </div>
          {post.excerpt && (
            <p className="mt-4 text-xl text-muted-foreground italic">
              {post.excerpt}
            </p>
          )}
        </header>

        <div className="whitespace-pre-wrap leading-relaxed text-lg">
          {post.content}
        </div>
      </article>

      <hr className="my-12" />

      <CommentSection 
        postId={post.id} 
        initialComments={comments || []} 
        user={user} 
      />
    </div>
  )
}
