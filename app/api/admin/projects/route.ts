import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function checkPassword(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  return password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
}

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('projects')
    .insert(body as Record<string, unknown>)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const json = await req.json()
  const { id, ...body } = json as { id: string; [key: string]: unknown }

  // Clean up old storage images when images array changed
  if (Array.isArray(body.images)) {
    const { data: current } = await supabase
      .from('projects')
      .select('images')
      .eq('id', id)
      .single()

    if (current?.images?.length) {
      const newPaths = (body.images as string[]).map((url: string) =>
        url.split('/storage/v1/object/public/portfolio-images/')[1] ?? ''
      ).filter(Boolean)
      const toDelete = current.images
        .map((url: string) => url.split('/storage/v1/object/public/portfolio-images/')[1] ?? '')
        .filter((p: string) => p && !newPaths.includes(p))
      if (toDelete.length > 0) {
        await supabase.storage.from('portfolio-images').remove(toDelete)
      }
    }
  }

  const { data, error } = await supabase
    .from('projects')
    .update(body as Record<string, unknown>)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()

  // Fetch project images before deleting the row
  const { data: project } = await supabase
    .from('projects')
    .select('images')
    .eq('id', id)
    .single()

  // Delete all project images from storage
  if (project?.images?.length) {
    const paths = project.images
      .map((url: string) => url.split('/storage/v1/object/public/portfolio-images/')[1] ?? '')
      .filter(Boolean)
    if (paths.length > 0) {
      await supabase.storage.from('portfolio-images').remove(paths)
    }
  }

  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}