import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const state = requestUrl.searchParams.get('state')

  console.log('Auth callback URL:', requestUrl.toString())
  console.log('Auth callback params:', { 
    code: code ? `${code.substring(0, 10)}...` : null, 
    error, 
    errorDescription,
    state: state ? `${state.substring(0, 10)}...` : null
  })

  if (error) {
    console.error('OAuth error:', error, errorDescription)
    // Redireciona para login com erro
    const redirectUrl = new URL('/login', requestUrl.origin)
    redirectUrl.searchParams.set('error', error)
    redirectUrl.searchParams.set('error_description', errorDescription || '')
    return NextResponse.redirect(redirectUrl)
  }

  if (code) {
    try {
      const supabase = createRouteHandlerClient({ cookies })
      
      console.log('Attempting to exchange code for session...')
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        const redirectUrl = new URL('/login', requestUrl.origin)
        redirectUrl.searchParams.set('error', 'session_exchange_failed')
        redirectUrl.searchParams.set('error_description', exchangeError.message)
        return NextResponse.redirect(redirectUrl)
      }

      console.log('Successfully exchanged code for session:', data)
      
    } catch (err) {
      console.error('Unexpected error in auth callback:', err)
      const redirectUrl = new URL('/login', requestUrl.origin)
      redirectUrl.searchParams.set('error', 'unexpected_error')
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    console.error('No code received in callback')
    const redirectUrl = new URL('/login', requestUrl.origin)
    redirectUrl.searchParams.set('error', 'no_code_received')
    redirectUrl.searchParams.set('error_description', 'No authorization code received from Google')
    return NextResponse.redirect(redirectUrl)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin)
} 