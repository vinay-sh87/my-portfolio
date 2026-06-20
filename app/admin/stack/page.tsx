'use client'

import { useState, useEffect, useCallback } from 'react'
import { StackItem } from '@/lib/supabase/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function StackAdminPage() {
  const [items, setItems] = useState<StackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Partial<StackItem> | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const fetchItems = useCallback(async () => {
    try {
      const result = await api('GET')
      setItems(result.data ?? [])
    } catch (err) {
      console.error('Failed to fetch stack items:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const api = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => {
    const password = sessionStorage.getItem('admin_auth') === 'true'
      ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      : ''

    const res = await fetch('/api/admin/stack', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  const save = async () => {
    if (!draft?.name) { alert('Name is required'); return }
    setSaving(true)
    try {
      const payload = { ...draft, category: (draft.category ?? '').toLowerCase().trim() }
      if (editingId) {
        await api('PUT', { id: editingId, ...payload })
      } else {
        await api('POST', { ...payload, sort_order: items.length })
      }
      setDraft(null)
      setEditingId(null)
      await fetchItems()
    } catch (e: any) {
      alert('Error saving: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this stack item?')) return
    await api('DELETE', { id })
    await fetchItems()
  }

  const openEdit = (item: StackItem) => {
    setDraft({ ...item })
    setEditingId(item.id)
  }

  const openNew = () => {
    setDraft({ name: '', category: '', proficiency: null })
    setEditingId(null)
  }

  const categories = [...new Set(items.map(i => (i.category ?? '').toLowerCase()).filter(Boolean))]

  if (loading) return <div className="text-text-muted font-plus-jakarta text-sm">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Stack</h1>
          <p className="font-plus-jakarta text-sm text-text-muted mt-1">{items.length} items · {categories.length} categories</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-bg font-syne font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-text-secondary transition-colors">
          <Plus size={16} /> New Item
        </button>
      </div>

      {draft !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-syne font-bold text-lg text-white">{editingId ? 'Edit Item' : 'New Stack Item'}</h2>
              <button onClick={() => { setDraft(null); setEditingId(null) }} className="text-text-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Name *</label>
                <input value={draft.name ?? ''} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white"
                  placeholder="React" />
              </div>
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Category</label>
                <input value={draft.category ?? ''} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white"
                  placeholder="Frontend, Backend, Database, etc." />
              </div>
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Proficiency (1–100)</label>
                <input type="number" min="1" max="100" value={draft.proficiency ?? ''}
                  onChange={e => setDraft(d => ({ ...d, proficiency: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-mono text-sm text-white outline-none focus:border-white"
                  placeholder="90" />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border">
              <button onClick={() => { setDraft(null); setEditingId(null) }}
                className="px-4 py-2 rounded-lg font-plus-jakarta text-sm text-text-muted border border-border hover:text-white transition-colors">Cancel</button>
              <button onClick={save} disabled={saving}
                className="px-6 py-2 rounded-lg font-syne font-semibold text-sm bg-white text-bg hover:bg-text-secondary disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-20 text-text-muted font-plus-jakarta text-sm">No stack items yet.</div>
      ) : (
        categories.length > 0 ? (
          categories.map(cat => (
            <div key={cat} className="mb-8">
              <h3 className="font-mono text-xs text-text-muted mb-3 tracking-widest uppercase">{cat}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {items.filter(i => (i.category ?? '').toLowerCase() === cat).map(item => (
                  <div key={item.id} className="border border-border rounded-xl p-4 hover:bg-surface/50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <span className="font-plus-jakarta text-sm text-white">{item.name}</span>
                      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                        <button onClick={() => openEdit(item)} className="text-text-muted hover:text-white"><Pencil size={12} /></button>
                        <button onClick={() => deleteItem(item.id)} className="text-text-muted hover:text-red-400"><Trash2 size={12} /></button>
                      </div>
                    </div>
                    {item.proficiency && (
                      <div className="mt-2 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${item.proficiency}%` }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {items.map(item => (
              <div key={item.id} className="border border-border rounded-xl p-4 hover:bg-surface/50 transition-colors group">
                <div className="flex items-center justify-between">
                  <span className="font-plus-jakarta text-sm text-white">{item.name}</span>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    <button onClick={() => openEdit(item)} className="text-text-muted hover:text-white"><Pencil size={12} /></button>
                    <button onClick={() => deleteItem(item.id)} className="text-text-muted hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  )
}