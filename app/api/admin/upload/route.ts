import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function checkPassword(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  return password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const projectSlug = formData.get('projectSlug') as string | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const folder = projectSlug ? `${projectSlug}/` : 'misc/'
  const ext = file.name.split('.').pop()
  const filename = `${folder}${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const { data, error } = await supabaseAdmin.storage
    .from('portfolio-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage.from('portfolio-images').getPublicUrl(data.path)

  return NextResponse.json({ url: urlData.publicUrl, path: data.path })
}

export async function DELETE(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { path } = await req.json() as { path: string }

  if (!path) {
    return NextResponse.json({ error: 'No path provided' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.storage.from('portfolio-images').remove([path])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}