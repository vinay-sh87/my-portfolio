import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()

  const [projectsResult, experiencesResult, stackResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false }),
    supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('stack_items')
      .select('*')
      .order('sort_order', { ascending: true }),
  ])

  return NextResponse.json({
    projects: projectsResult.data ?? [],
    experiences: experiencesResult.data ?? [],
    stack: stackResult.data ?? [],
  })
}