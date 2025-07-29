import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas que requerem autenticação
  const protectedRoutes = ['/', '/add', '/edit', '/profile']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Rotas de autenticação (não devem ser acessadas se já logado)
  const authRoutes = ['/login', '/register']
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Pular middleware para rotas de callback OAuth
  if (req.nextUrl.pathname.startsWith('/auth/callback') || req.nextUrl.pathname.startsWith('/auth/google')) {
    return res
  }

  // Se não está autenticado e tenta acessar rota protegida
  if (!session && isProtectedRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
  }

  // Se está autenticado e tenta acessar rota de auth
  if (session && isAuthRoute) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - test-session (test page)
     */
    '/((?!_next/static|_next/image|favicon.ico|test-session|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 