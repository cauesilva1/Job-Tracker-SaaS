import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  console.log('=== GOOGLE OAUTH INITIATION ===')
  console.log('Environment variables:')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
  console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
  
  const supabase = createRouteHandlerClient({ cookies })

  try {
    console.log('Creating OAuth URL...')
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://job-tracker-saas-five.vercel.app'}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return NextResponse.redirect(new URL('/login?error=oauth_failed', process.env.NEXT_PUBLIC_SITE_URL || 'https://job-tracker-saas-five.vercel.app'))
    }

    console.log('OAuth URL created successfully:', data.url)
    return NextResponse.redirect(data.url)
  } catch (err) {
    console.error('Unexpected error in Google OAuth:', err)
    return NextResponse.redirect(new URL('/login?error=oauth_failed', process.env.NEXT_PUBLIC_SITE_URL || 'https://job-tracker-saas-five.vercel.app'))
  }
} 