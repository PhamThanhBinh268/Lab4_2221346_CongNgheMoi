'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createComment } from '@/app/posts/actions/post-actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'

interface Comment {
  id: string
  content: string
  created_at: string
  author_id: string
  profiles: {
    display_name: string
    avatar_url: string
  }
}

export default function CommentSection({ 
  postId, 
  initialComments, 
  user 
}: { 
  postId: string
  initialComments: Comment[]
  user: any
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    // Subscribe to new comments
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'comments',
          filter: `post_id=eq.${postId}`,
        },
        async (payload) => {
          // Fetch the full comment data including profile
          const { data, error } = await supabase
            .from('comments')
            .select('*, profiles(display_name, avatar_url)')
            .eq('id', payload.new.id)
            .single()
          
          if (data) {
            setComments((prev) => [data as Comment, ...prev])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [postId, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)
    try {
      await createComment(postId, newComment)
      setNewComment('')
    } catch (error) {
      console.error('Failed to post comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[100px]"
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Posting...' : 'Post Comment'}
          </Button>
        </form>
      ) : (
        <Card className="bg-muted">
          <CardContent className="py-6 text-center">
            <p className="text-muted-foreground">
              Please <a href="/login" className="text-primary underline">login</a> to join the conversation.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
              {comment.profiles?.display_name?.[0] || 'U'}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold">{comment.profiles?.display_name || 'Anonymous'}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{comment.content}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No comments yet.</p>
        )}
      </div>
    </div>
  )
}
