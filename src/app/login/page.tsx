import Link from 'next/link'
import { login, signInWithGitHub } from '@/app/auth/actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string }>
}) {
  const { message, error } = await searchParams

  const handleLogin = async (formData: FormData) => {
    'use server'
    await login(formData)
  }

  const handleGitHubLogin = async () => {
    'use server'
    await signInWithGitHub()
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form action={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
            {message && (
              <p className="text-sm font-medium text-green-600">{message}</p>
            )}
            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or join us
              </span>
            </div>
          </div>
          <div className="text-sm text-center text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary underline-offset-4 hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 italic text-xs text-center text-muted-foreground">
          Built with Next.js & Supabase
        </CardFooter>
      </Card>
    </div>
  )
}
