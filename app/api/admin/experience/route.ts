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
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { data, error } = await supabase
    .from('experiences')
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
  const { data, error } = await supabase
    .from('experiences')
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
  const { error } = await supabase.from('experiences').delete().eq('id', id)

  if (error) return NextResponse.json({ error }, { status: 500 })
  return NextResponse.json({ success: true })
}