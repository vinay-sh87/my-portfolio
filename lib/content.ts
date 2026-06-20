import { createClient } from '@/lib/supabase/server'
import { Project, Experience, StackItem } from '@/lib/supabase/types'

export async function getContent() {
  const supabase = await createClient()

  const [projectsResult, experiencesResult, stackResult] = await Promise.all([
    supabase
      .from('projects')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true, nullsFirst: false })
      .order('created_at', { ascending: false }),
    supabase
      .from('experiences')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false }),
    supabase
      .from('stack_items')
      .select('*')
      .order('sort_order', { ascending: true, nullsFirst: false }),
  ])

  return {
    projects: (projectsResult.data ?? []) as Project[],
    experiences: (experiencesResult.data ?? []) as Experience[],
    stack: (stackResult.data ?? []) as StackItem[],
  }
}

export async function getFeaturedProjects() {
  const supabase = await createClient()

  // Try featured=true first, fall back to all published sorted by order
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('sort_order', { ascending: true, nullsFirst: false })
    .limit(3)

  // If no results, this is expected (no featured projects set yet)
  // Return early with the featured list — empty is fine, will show "no projects"
  if (error || !data || data.length === 0) {
    return [] as Project[]
  }

  return data as Project[]
}

export async function getProjectBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error || !data) return null
  return data as Project
}