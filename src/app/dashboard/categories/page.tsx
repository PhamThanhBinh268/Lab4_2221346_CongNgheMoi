import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { PlusCircle, Search, Tags, Edit2, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { deleteCategory } from './actions'
import { Card, CardContent } from '@/components/ui/card'

export default async function CategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Categories</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Organize your blog posts into meaningful topics.
          </p>
        </div>
        <Link href="/dashboard/categories/new">
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-6 rounded-2xl shadow-lg shadow-indigo-100 transition-all active:scale-95">
            <PlusCircle className="w-5 h-5" />
            Add New Category
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-4 max-w-md bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="Filter categories..."
            className="pl-12 border-none bg-transparent focus-visible:ring-0 text-lg py-6"
          />
        </div>
      </div>

      {!categories || categories.length === 0 ? (
        <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2rem] p-20 text-center">
          <CardContent className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
              <Tags className="w-10 h-10 text-slate-300" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">No categories found</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Create your first category to start organizing your amazing content.</p>
            </div>
            <Link href="/dashboard/categories/new">
              <Button variant="outline" className="rounded-xl px-8 py-6 border-slate-200 hover:bg-white transition-all">Create Category</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.id} className="group bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-bl-full -mr-10 -mt-10 group-hover:bg-indigo-100/50 transition-colors" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center">
                    <Tags className="w-7 h-7 text-indigo-600" />
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/categories/edit/${category.id}`}>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-indigo-50 hover:text-indigo-600">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <form action={async () => {
                      'use server'
                      await deleteCategory(category.id)
                    }}>
                      <Button variant="ghost" size="icon" className="rounded-xl hover:bg-rose-50 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{category.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-slate-400">Slug:</span>
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded-lg text-indigo-600 font-bold">{category.slug}</code>
                  </div>
                </div>

                <p className="text-slate-500 line-clamp-2 min-h-[3rem] font-medium leading-relaxed italic">
                  {category.description || 'No description provided for this category.'}
                </p>

                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                   <Link href={`/category/${category.slug}`} target="_blank" className="text-sm font-bold text-indigo-600 hover:underline flex items-center gap-1">
                     View Public Page
                   </Link>
                   <span className="text-[10px] font-black uppercase tracking-tighter text-slate-300">
                     ID: {category.id.substring(0, 8)}...
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
