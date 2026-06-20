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

// GET - returns resume_url (admin version)
export async function GET(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['resume_url'])

  return NextResponse.json({ data: data ?? [] })
}

// POST - upload resume PDF and save URL
export async function POST(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = ['application/pdf']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 })
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 })
  }

  const filename = `resume/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Delete existing resume files first
  try {
    const { data: existing } = await supabaseAdmin.storage
      .from('portfolio-images')
      .list('resume', { limit: 10 })
    if (existing && existing.length > 0) {
      const paths = existing.map(f => `resume/${f.name}`)
      await supabaseAdmin.storage.from('portfolio-images').remove(paths)
    }
  } catch {}

  const { data, error } = await supabaseAdmin.storage
    .from('portfolio-images')
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const { data: urlData } = supabaseAdmin.storage.from('portfolio-images').getPublicUrl(data.path)

  // Save to site_settings
  const { error: upsertError } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key: 'resume_url', value: urlData.publicUrl }, { onConflict: 'key' })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ url: urlData.publicUrl, path: data.path })
}

// DELETE resume
export async function DELETE(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await supabaseAdmin
    .from('site_settings')
    .delete()
    .eq('key', 'resume_url')

  return NextResponse.json({ success: true })
}