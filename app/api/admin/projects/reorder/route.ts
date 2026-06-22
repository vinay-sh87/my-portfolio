import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function checkPassword(req: NextRequest) {
  const password = req.headers.get('x-admin-password')
  return password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD
}

// PUT /api/admin/projects/reorder — batch update sort_order
export async function PUT(req: NextRequest) {
  if (!checkPassword(req))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { items } = await req.json() as { items: { id: string; sort_order: number }[] }

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'No items provided' }, { status: 400 })
  }

  // Batch update all sort_orders
  const updates = items.map(({ id, sort_order }) =>
    supabase
      .from('projects')
      .update({ sort_order })
      .eq('id', id)
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    return NextResponse.json({ error: errors[0].error?.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}