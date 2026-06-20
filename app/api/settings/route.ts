import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Public - returns site settings
export async function GET() {
  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['resume_url'])

  const resume_url = data?.find(s => s.key === 'resume_url')?.value ?? null
  return NextResponse.json({ resume_url })
}