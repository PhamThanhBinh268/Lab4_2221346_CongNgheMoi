import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. PUBLIC PATHS: Everyone can access
  const isPublicPath = 
    request.nextUrl.pathname === '/' || 
    request.nextUrl.pathname.startsWith('/posts') ||
    request.nextUrl.pathname === '/about' ||
    request.nextUrl.pathname.startsWith('/category') ||
    request.nextUrl.pathname.startsWith('/auth')

  // 2. AUTH PATHS: Only for non-logged in users
  const isAuthPath = 
    request.nextUrl.pathname.startsWith('/login') || 
    request.nextUrl.pathname.startsWith('/register')

  // 3. ADMIN PATHS: Only for logged in users with 'admin' role
  const isAdminPath = request.nextUrl.pathname.startsWith('/dashboard')

  if (!user) {
    if (isAdminPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  } else {
    // User is logged in
    if (isAuthPath) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    if (isAdminPath) {
      // Check role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        url.searchParams.set('error', 'unauthorized')
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
