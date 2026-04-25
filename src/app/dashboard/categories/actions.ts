'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function checkAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Forbidden')
  return user
}

export async function createCategory(formData: FormData) {
  await checkAdmin()
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string || name.toLowerCase().replace(/ /g, '-')
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('categories')
    .insert({ name, slug, description })

  if (error) {
    console.error('Error creating category:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  await checkAdmin()
  const supabase = await createClient()

  const name = formData.get('name') as string
  const slug = formData.get('slug') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('categories')
    .update({ name, slug, description })
    .eq('id', id)

  if (error) {
    console.error('Error updating category:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
  redirect('/dashboard/categories')
}

export async function deleteCategory(id: string) {
  await checkAdmin()
  const supabase = await createClient()

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/categories')
}
