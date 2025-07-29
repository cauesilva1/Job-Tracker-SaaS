import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const state = requestUrl.searchParams.get('state')

  console.log('=== AUTH CALLBACK DEBUG ===')
  console.log('Request URL:', requestUrl.toString())
  console.log('Origin:', requestUrl.origin)
  console.log('Code received:', !!code)
  console.log('Error:', error)
  console.log('Error description:', errorDescription)
  console.log('State:', state)

  if (error) {
    console.error('OAuth error:', error, errorDescription)
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

      console.log('Successfully exchanged code for session')
      console.log('Session data:', data)
      console.log('User ID:', data?.user?.id)
      console.log('User email:', data?.user?.email)
      
      // Aguarda um pouco para garantir que a sessão foi salva
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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

  console.log('Redirecting to:', requestUrl.origin)
  return NextResponse.redirect(requestUrl.origin)
} 