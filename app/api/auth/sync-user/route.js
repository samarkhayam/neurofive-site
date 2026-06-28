import { auth } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const email = session.user.email
  const avatar_url = session.user.image

  // Check if user already exists
  const { data: existing } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    // User exists — return their data (don't overwrite full_name)
    return NextResponse.json({ user: existing })
  }

  // New user — insert them
  const { data: inserted, error } = await supabase
    .from('users')
    .insert({ email, avatar_url })
    .select('id, full_name, avatar_url')
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ user: inserted })
}