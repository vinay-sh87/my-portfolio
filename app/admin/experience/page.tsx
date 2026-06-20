'use client'

import { useState, useEffect, useCallback } from 'react'
import { Experience } from '@/lib/supabase/types'
import { Plus, Pencil, Trash2, X } from 'lucide-react'

export default function ExperienceAdminPage() {
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Partial<Experience> | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [tagsInput, setTagsInput] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchItems = useCallback(async () => {
    try {
      const result = await api('GET')
      setItems(result.data ?? [])
    } catch (err) {
      console.error('Failed to fetch experiences:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const api = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => {
    const password = sessionStorage.getItem('admin_auth') === 'true'
      ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      : ''

    const res = await fetch('/api/admin/experience', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  const save = async () => {
    if (!draft?.role || !draft?.company || !draft?.period || !draft?.num) { alert('Role, company, period, and number are required'); return }
    setSaving(true)
    try {
      const tags = tagsInput.split(',').map(s => s.trim()).filter(Boolean)
      const payload = { ...draft, tags }
      if (editingId) {
        await api('PUT', { id: editingId, ...payload })
      } else {
        await api('POST', { ...payload, sort_order: items.length, description: draft.description ?? '' })
      }
      setDraft(null)
      setEditingId(null)
      setTagsInput('')
      await fetchItems()
    } catch (e: any) {
      alert('Error saving: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    await api('DELETE', { id })
    await fetchItems()
  }

  const openEdit = (item: Experience) => {
    setDraft({ ...item })
    setTagsInput((item.tags ?? []).join(', '))
    setEditingId(item.id)
  }

  const openNew = () => {
    setDraft({ num: String(items.length + 1).padStart(2, '0'), role: '', company: '', period: '', is_current: false })
    setTagsInput('')
    setEditingId(null)
  }

  if (loading) return <div className="text-text-muted font-plus-jakarta text-sm">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Experience</h1>
          <p className="font-plus-jakarta text-sm text-text-muted mt-1">{items.length} entries</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-white text-bg font-syne font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-text-secondary transition-colors">
          <Plus size={16} /> New Experience
        </button>
      </div>

      {draft !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-syne font-bold text-lg text-white">{editingId ? 'Edit Experience' : 'New Experience'}</h2>
              <button onClick={() => { setDraft(null); setEditingId(null) }} className="text-text-muted hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Number</label>
                  <input value={draft.num ?? ''} onChange={e => setDraft(d => ({ ...d, num: e.target.value }))}
                    className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-mono text-sm text-white outline-none focus:border-white" placeholder="01" />
                </div>
                <div>
                  <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Period</label>
                  <input value={draft.period ?? ''} onChange={e => setDraft(d => ({ ...d, period: e.target.value }))}
                    className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-mono text-sm text-white outline-none focus:border-white" placeholder="2023 – Present" />
                </div>
              </div>
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Role *</label>
                <input value={draft.role ?? ''} onChange={e => setDraft(d => ({ ...d, role: e.target.value }))}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white"
                  placeholder="Senior Full Stack Developer" />
              </div>
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Company *</label>
                <input value={draft.company ?? ''} onChange={e => setDraft(d => ({ ...d, company: e.target.value }))}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white"
                  placeholder="TechCorp" />
              </div>
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Description</label>
                <textarea value={draft.description ?? ''} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))}
                  rows={3} className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white resize-none"
                  placeholder="Led development of full-stack applications..." />
              </div>
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Tags (comma-separated)</label>
                <input value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white"
                  placeholder="Next.js, AWS, PostgreSQL" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={draft.is_current ?? false} onChange={e => setDraft(d => ({ ...d, is_current: e.target.checked }))}
                  className="w-4 h-4 accent-white" />
                <span className="font-plus-jakarta text-sm text-white">Current position</span>
              </label>
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
        <div className="text-center py-20 text-text-muted font-plus-jakarta text-sm">No experience entries yet.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-border rounded-xl p-5 hover:bg-surface/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  <span className="font-mono text-xs text-text-muted mt-1">{item.num}</span>
                  <div>
                    <p className="font-syne font-bold text-white">{item.role}</p>
                    <p className="font-plus-jakarta text-sm text-text-secondary">{item.company}</p>
                    <p className="font-mono text-xs text-text-muted mt-0.5">{item.period}{item.is_current && ' · Current'}</p>
                    {item.description && <p className="font-plus-jakarta text-xs text-text-secondary mt-2 leading-relaxed max-w-lg">{item.description}</p>}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {(item.tags ?? []).map(tag => (
                        <span key={tag} className="font-mono text-xs border border-border px-2 py-0.5 rounded-full text-text-muted">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="text-text-muted hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(item.id)} className="text-text-muted hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}