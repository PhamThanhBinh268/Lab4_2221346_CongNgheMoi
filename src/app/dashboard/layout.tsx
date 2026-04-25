import Link from 'next/link'
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  PlusCircle, 
  Home, 
  LogOut,
  Tags,
  BarChart3,
  User,
  ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { signOut } from '@/app/auth/actions/auth-actions'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 border-r bg-white shadow-sm">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 font-black text-2xl tracking-tight text-slate-900">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span>Admin<span className="text-indigo-600">Core</span></span>
          </Link>
        </div>
        
        <div className="px-6 mb-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-lg shadow-md shrink-0 border-2 border-white">
              {profile?.display_name?.[0] || 'A'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-slate-900 truncate leading-tight">{profile?.display_name || 'Administrator'}</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-[11px] text-slate-500 uppercase font-extrabold tracking-widest">{profile?.role || 'user'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-6">
            <div>
              <h2 className="mb-3 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Main Menu
              </h2>
              <div className="space-y-1">
                <DashboardNavLink href="/dashboard" icon={LayoutDashboard} label="Statistics" activeColor="text-indigo-600" activeBg="bg-indigo-50" />
                <DashboardNavLink href="/dashboard/posts" icon={FileText} label="Manage Posts" activeColor="text-emerald-600" activeBg="bg-emerald-50" />
                <DashboardNavLink href="/dashboard/categories" icon={Tags} label="Categories" activeColor="text-amber-600" activeBg="bg-amber-50" />
              </div>
            </div>
            
            <div>
              <h2 className="mb-3 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Quick Actions
              </h2>
              <div className="space-y-1">
                <DashboardNavLink href="/dashboard/posts/new" icon={PlusCircle} label="Create Post" activeColor="text-purple-600" activeBg="bg-purple-50" />
              </div>
            </div>

            <Separator className="mx-4 opacity-50" />
            
            <div>
              <h2 className="mb-3 px-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                Settings
              </h2>
              <div className="space-y-1">
                <DashboardNavLink href="/dashboard/settings" icon={Settings} label="Profile & Security" activeColor="text-slate-900" activeBg="bg-slate-100" />
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t mt-auto space-y-3">
          <Link href="/" target="_blank">
            <Button variant="outline" className="w-full justify-between gap-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all rounded-xl py-6">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span>Visit Website</span>
              </div>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </Button>
          </Link>
          <form action={async () => {
            'use server'
            await signOut()
          }}>
            <Button variant="ghost" className="w-full justify-start gap-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 transition-all rounded-xl py-6">
              <LogOut className="w-5 h-5" />
              <span className="font-bold">Logout System</span>
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:pl-72 transition-all duration-300">
        <div className="min-h-screen">
          <div className="container mx-auto p-6 md:p-10 max-w-7xl">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

function DashboardNavLink({ href, icon: Icon, label, activeColor, activeBg }: { href: string, icon: any, label: string, activeColor: string, activeBg: string }) {
  return (
    <Link href={href}>
      <Button variant="ghost" className={cn(
        "w-full justify-start gap-3 rounded-xl py-6 transition-all duration-200 hover:bg-slate-100 font-semibold text-slate-600",
        // Logic check active route would be here in a client component, but since it's a server component
        // we keep it simple or pass it from parent. For now, just styling.
      )}>
        <Icon className={cn("w-5 h-5 opacity-80", activeColor)} />
        {label}
      </Button>
    </Link>
  )
}
