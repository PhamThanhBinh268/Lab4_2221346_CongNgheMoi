import { createClient } from '@/lib/supabase/server'
import { updateCategory } from '../../actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) notFound()

  const handleUpdate = async (formData: FormData) => {
    'use server'
    await updateCategory(category.id, formData)
  }

  return (
    <div className="space-y-10 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/categories" className={buttonVariants({ variant: "ghost", size: "icon" }) + " rounded-xl hover:bg-white"}>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Edit Category</h1>
          <p className="text-slate-500 font-medium">Update the details for your category topic.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
        <CardContent className="p-10">
          <form action={handleUpdate} className="grid gap-8">
            <div className="grid gap-3">
              <Label htmlFor="name" className="text-sm font-black uppercase tracking-widest text-slate-400">Category Name</Label>
              <Input id="name" name="name" defaultValue={category.name} className="py-7 px-6 rounded-2xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 text-lg font-bold transition-all" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="slug" className="text-sm font-black uppercase tracking-widest text-slate-400">Slug</Label>
              <Input id="slug" name="slug" defaultValue={category.slug} className="py-7 px-6 rounded-2xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 font-mono transition-all" required />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="description" className="text-sm font-black uppercase tracking-widest text-slate-400">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                defaultValue={category.description || ''} 
                className="min-h-[150px] p-6 rounded-2xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 text-lg transition-all" 
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-50">
              <Link href="/dashboard/categories" className={buttonVariants({ variant: "ghost" }) + " rounded-xl px-8 py-6 font-bold text-slate-400 hover:text-slate-900"}>
                Cancel
              </Link>
              <Button type="submit" className="rounded-2xl px-10 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                Update Category
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
