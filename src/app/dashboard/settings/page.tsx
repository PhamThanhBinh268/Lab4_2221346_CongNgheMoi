import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from './actions'
import { Badge } from '@/components/ui/badge'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const handleUpdate = async (formData: FormData) => {
    'use server'
    await updateProfile(formData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-muted-foreground font-medium">
          Manage your account settings and profile information.
        </p>
      </div>

      <Card className="max-w-2xl border-none shadow-xl shadow-slate-200/50 rounded-[2rem] overflow-hidden">
        <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
          <CardTitle className="text-xl font-black">Profile Information</CardTitle>
          <CardDescription className="font-medium">
            This information will be displayed publicly as the author of your posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <form action={handleUpdate} className="space-y-8">
            <div className="space-y-3">
              <Label className="text-xs font-black uppercase tracking-widest text-slate-400">Current Role</Label>
              <div>
                <Badge variant="secondary" className="capitalize text-sm px-4 py-1.5 rounded-xl bg-indigo-50 text-indigo-600 border-none font-bold">
                  {profile?.role || 'user'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-medium italic">
                Your role determines your permissions within the system.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="displayName" className="text-xs font-black uppercase tracking-widest text-slate-400">Display Name</Label>
              <Input 
                id="displayName" 
                name="displayName" 
                defaultValue={profile?.display_name || ''} 
                placeholder="Your full name"
                className="py-6 px-5 rounded-xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 font-bold transition-all"
                required 
              />
              <p className="text-xs text-slate-400 font-medium italic">
                Fixes the "Anonymous" author issue on your blog posts.
              </p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="avatarUrl" className="text-xs font-black uppercase tracking-widest text-slate-400">Avatar URL</Label>
              <Input 
                id="avatarUrl" 
                name="avatarUrl" 
                defaultValue={profile?.avatar_url || ''} 
                placeholder="https://example.com/avatar.jpg"
                className="py-6 px-5 rounded-xl border-slate-100 bg-slate-50 focus-visible:bg-white focus-visible:ring-indigo-500 font-medium transition-all"
              />
            </div>

            <div className="h-px bg-slate-100 w-full" />

            <div className="space-y-3">
              <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-slate-400 text-rose-400">Security: Manual Role Override</Label>
              <select 
                id="role" 
                name="role" 
                defaultValue={profile?.role || 'user'}
                className="flex h-14 w-full rounded-xl border border-slate-100 bg-slate-50 px-5 py-2 text-sm font-bold ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all appearance-none"
              >
                <option value="user">User (Standard Access)</option>
                <option value="admin">Admin (Full Control)</option>
              </select>
              <p className="text-[10px] text-rose-400 font-black uppercase tracking-tighter italic">Warning: changing role might lock you out of this dashboard.</p>
            </div>

            <Button type="submit" className="w-full rounded-xl py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-lg shadow-indigo-100 active:scale-95 transition-all">
              Save Profile Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
