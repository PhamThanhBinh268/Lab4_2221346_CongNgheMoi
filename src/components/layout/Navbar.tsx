import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/auth/actions/auth-actions'
import { Button } from '@/components/ui/button'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-background sticky top-0 z-40 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-black italic">
            S
          </div>
          Simple Blog
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="sm">Home</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm">About</Button>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
              <form action={async () => {
                'use server'
                await signOut()
              }}>
                <Button variant="outline" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
