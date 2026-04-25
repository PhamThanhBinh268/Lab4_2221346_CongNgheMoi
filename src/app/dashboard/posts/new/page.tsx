import { createPost } from '@/app/posts/actions/post-actions'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  const handleCreate = async (formData: FormData) => {
    'use server'
    await createPost(formData)
  }

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts" className={buttonVariants({ variant: "ghost", size: "icon" }) + " rounded-xl hover:bg-white"}>
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Create New Post</h1>
          <p className="text-slate-500 font-medium">Draft and publish a new masterpiece to your blog.</p>
        </div>
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
        <CardContent className="p-10">
          <form action={handleCreate} className="grid gap-8">
            <div className="grid gap-3">
              <Label htmlFor="title" className="text-sm font-black uppercase tracking-widest text-slate-400">Article Title</Label>
              <Input id="title" name="title" placeholder="Enter a catchy title..." className="py-7 px-6 rounded-2xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 text-xl font-black transition-all" required />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="categoryId" className="text-sm font-black uppercase tracking-widest text-slate-400">Category</Label>
                  <Link href="/dashboard/categories/new" className="text-xs text-indigo-600 font-bold hover:underline">
                    + Add New Category
                  </Link>
                </div>
                <select 
                  id="categoryId" 
                  name="categoryId" 
                  className="flex h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-2 text-lg font-bold ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all appearance-none"
                >
                  <option value="">-- Uncategorized --</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="status" className="text-sm font-black uppercase tracking-widest text-slate-400">Publishing Status</Label>
                <select 
                  id="status" 
                  name="status" 
                  className="flex h-14 w-full rounded-2xl border border-slate-100 bg-slate-50 px-6 py-2 text-lg font-bold ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all appearance-none"
                  required
                >
                  <option value="draft">Draft (Private)</option>
                  <option value="published">Published (Public)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="excerpt" className="text-sm font-black uppercase tracking-widest text-slate-400">Short Summary</Label>
              <Input id="excerpt" name="excerpt" placeholder="A brief hook to grab attention..." className="py-7 px-6 rounded-2xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 font-medium transition-all" />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="content" className="text-sm font-black uppercase tracking-widest text-slate-400">Content</Label>
              <Textarea 
                id="content" 
                name="content" 
                placeholder="Start writing your story here..." 
                className="min-h-[400px] p-8 rounded-[2rem] border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 text-lg leading-relaxed transition-all" 
                required 
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-50">
              <Link href="/dashboard/posts" className={buttonVariants({ variant: "ghost" }) + " rounded-xl px-8 py-6 font-bold text-slate-400 hover:text-slate-900"}>
                Cancel
              </Link>
              <Button type="submit" className="rounded-2xl px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                Publish Masterpiece
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
