'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin role required')
  }

  return user
}

export async function createPost(formData: FormData) {
  const user = await checkAdmin()
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const categoryId = formData.get('categoryId') as string
  const status = formData.get('status') as 'draft' | 'published'

  const { data, error } = await supabase.from('posts').insert({
    author_id: user.id,
    title,
    content,
    excerpt,
    category_id: categoryId || null,
    status,
  }).select().single()

  if (error) {
    console.error('Error creating post:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/posts')
  revalidatePath('/')
  redirect('/dashboard/posts')
}

export async function updatePost(postId: string, formData: FormData) {
  const user = await checkAdmin()
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const excerpt = formData.get('excerpt') as string
  const categoryId = formData.get('categoryId') as string
  const status = formData.get('status') as 'draft' | 'published'

  const { error } = await supabase.from('posts').update({
    title,
    content,
    excerpt,
    category_id: categoryId || null,
    status,
  }).eq('id', postId).eq('author_id', user.id)

  if (error) {
    console.error('Error updating post:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/posts')
  revalidatePath('/')
  revalidatePath(`/posts/${postId}`) 
  redirect('/dashboard/posts')
}

export async function deletePost(postId: string) {
  const user = await checkAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from('posts').delete().eq('id', postId).eq('author_id', user.id)

  if (error) {
    console.error('Error deleting post:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/posts')
  revalidatePath('/')
}

export async function createComment(postId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to comment')
  }

  const { error } = await supabase.from('comments').insert({
    post_id: postId,
    author_id: user.id,
    content,
  })

  if (error) {
    console.error('Error creating comment:', error)
    return { error: error.message }
  }

  // Realtime will handle UI update, but we revalidate for safety/SEO
  revalidatePath(`/posts/${postId}`)
}
