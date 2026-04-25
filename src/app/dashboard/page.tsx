import { createClient } from '@/lib/supabase/server'
import { 
  FileText, 
  MessageSquare, 
  CheckCircle, 
  FileEdit,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Zap,
  Users
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import SeedDataButton from '@/components/dashboard/SeedDataButton'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default async function StatisticsPage() {
  const supabase = await createClient()

  // Lấy thống kê
  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const { count: publishedPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  const { count: draftPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'draft')

  const { count: totalComments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true })

  const stats = [
    {
      title: 'Total Articles',
      value: totalPosts || 0,
      icon: FileText,
      description: 'Your creative impact',
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      trend: '+12%',
      bg: 'bg-indigo-50/50'
    },
    {
      title: 'Live Content',
      value: publishedPosts || 0,
      icon: Zap,
      description: 'Visible to the world',
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600',
      trend: 'Steady',
      bg: 'bg-emerald-50/50'
    },
    {
      title: 'In Progress',
      value: draftPosts || 0,
      icon: FileEdit,
      description: 'Future masterpieces',
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      trend: 'Growing',
      bg: 'bg-amber-50/50'
    },
    {
      title: 'Engagement',
      value: totalComments || 0,
      icon: MessageSquare,
      description: 'Community voices',
      color: 'bg-rose-500',
      textColor: 'text-rose-600',
      trend: '+24%',
      bg: 'bg-rose-50/50'
    },
  ]

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-10 h-10 text-indigo-600" />
            Insights Dashboard
          </h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">
            Welcome back! Here is what's happening with your blog today.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <SeedDataButton />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className={cn(
            "relative group overflow-hidden rounded-[2rem] border border-white shadow-xl shadow-slate-200/40 p-8 transition-all hover:shadow-2xl hover:-translate-y-1 bg-white"
          )}>
            <div className={cn("absolute top-0 right-0 w-32 h-32 rounded-bl-full -mr-10 -mt-10 opacity-20", stat.bg)} />
            
            <div className="relative z-10 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg", stat.color)}>
                  <stat.icon className="h-7 w-7" />
                </div>
                <div className={cn("flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-slate-100", stat.textColor)}>
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.trend}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl font-black text-slate-900">{stat.value}</div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.title}</div>
              </div>
              
              <p className="text-sm font-medium text-slate-500 border-t border-slate-50 pt-4">
                {stat.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-8 pb-0">
            <CardTitle className="text-2xl font-black text-slate-900">Traffic Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px] p-8 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/20 to-transparent pointer-events-none" />
            <div className="flex flex-col items-center gap-4 text-slate-400 relative z-10">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-slate-200">
                <BarChart3 className="w-10 h-10 opacity-30" />
              </div>
              <div className="text-center">
                <p className="font-bold text-slate-900">Visual Analytics</p>
                <p className="text-sm font-medium">Coming soon with real-time tracking.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl shadow-slate-200/40 rounded-[2.5rem] overflow-hidden bg-white">
          <CardHeader className="p-8">
            <CardTitle className="text-2xl font-black text-slate-900">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Users className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-900 truncate">New comment on post #{i}</p>
                    <p className="text-xs font-medium text-slate-400">2 hours ago</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                </div>
              ))}
              <Button variant="ghost" className="w-full text-indigo-600 font-black hover:bg-indigo-50 rounded-xl py-6">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
