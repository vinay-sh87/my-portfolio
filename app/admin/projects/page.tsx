'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Project } from '@/lib/supabase/types'
import { Plus, Pencil, Trash2, Star, StarOff, ExternalLink, Github, X, Upload, ImagePlus } from 'lucide-react'

type ImageEntry = { url: string; path: string }

export default function ProjectsAdminPage() {
  const [items, setItems] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState<Partial<Project> | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [techStackInput, setTechStackInput] = useState('')
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchItems = useCallback(async () => {
    try {
      const result = await api('GET')
      setItems(result.data ?? [])
    } catch (err) {
      console.error('Failed to fetch projects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const api = async (method: 'GET' | 'POST' | 'PUT' | 'DELETE', body?: object) => {
    const password = sessionStorage.getItem('admin_auth') === 'true'
      ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      : ''
    const res = await fetch('/api/admin/projects', {
      method,
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }

  const uploadImage = async (file: File): Promise<ImageEntry | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('projectSlug', draft?.slug ?? 'misc')

    const password = sessionStorage.getItem('admin_auth') === 'true'
      ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      : ''

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'x-admin-password': password ?? '' },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Upload failed')
    }

    return res.json() as Promise<ImageEntry>
  }

  const deleteImage = async (path: string, currentImages: ImageEntry[]) => {
    const password = sessionStorage.getItem('admin_auth') === 'true'
      ? process.env.NEXT_PUBLIC_ADMIN_PASSWORD
      : ''
    await fetch('/api/admin/upload', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password ?? '' },
      body: JSON.stringify({ path }),
    })
    // Remove from draft
    setDraft(d => ({
      ...d,
      images: currentImages.filter(i => i.path !== path).map(i => i.url),
    }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, currentImages: ImageEntry[]) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return

    for (const file of files) {
      try {
        const uploaded = await uploadImage(file)
        if (uploaded) {
          setDraft(d => ({
            ...d,
            images: [...(d?.images ?? []).filter((u): u is string => typeof u === 'string'), uploaded.url],
          }))
        }
      } catch (err: any) {
        alert(`Failed to upload ${file.name}: ${err.message}`)
      }
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const parseImages = (images: string[] | null): ImageEntry[] => {
    if (!images) return []
    // Support both URL-only (legacy) and URL+path format
    return images.map(url => ({ url, path: url.split('/storage/v1/object/public/portfolio-images/')[1] ?? url }))
  }

  const save = async () => {
    if (!draft?.title || !draft?.slug) { alert('Title and slug are required'); return }
    setSaving(true)
    try {
      const tech_stack = techStackInput.split(',').map(s => s.trim()).filter(Boolean)
      const payload = { ...draft, tech_stack }
      if (editingId) {
        await api('PUT', { id: editingId, ...payload })
      } else {
        await api('POST', { ...payload, sort_order: items.length, status: 'draft' })
      }
      setDraft(null)
      setEditingId(null)
      setTechStackInput('')
      await fetchItems()
    } catch (e: any) {
      alert('Error saving: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = async (item: Project) => {
    await api('PUT', { id: item.id, featured: !item.featured })
    await fetchItems()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this project?')) return
    await api('DELETE', { id })
    await fetchItems()
  }

  const openEdit = (item: Project) => {
    setDraft({ ...item })
    setTechStackInput((item.tech_stack ?? []).join(', '))
    setEditingId(item.id)
  }

  const openNew = () => {
    setDraft({ title: '', slug: '', short_description: '', featured: false, status: 'draft', images: [] })
    setTechStackInput('')
    setEditingId(null)
  }

  if (loading) return <div className="text-text-muted font-plus-jakarta text-sm">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-syne font-bold text-2xl text-white">Projects</h1>
          <p className="font-plus-jakarta text-sm text-text-muted mt-1">
            {items.filter(i => i.featured).length} featured · {items.filter(i => i.status === 'published').length} published
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-white text-bg font-syne font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-text-secondary transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {/* Form modal */}
      {draft !== null && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center p-6 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-surface rounded-t-2xl">
              <h2 className="font-syne font-bold text-lg text-white">
                {editingId ? 'Edit Project' : 'New Project'}
              </h2>
              <button onClick={() => { setDraft(null); setEditingId(null) }} className="text-text-muted hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Title *</label>
                  <input
                    value={draft.title ?? ''}
                    onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
                    className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white transition-colors"
                    placeholder="Project Name"
                  />
                </div>
                <div>
                  <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Slug *</label>
                  <input
                    value={draft.slug ?? ''}
                    onChange={e => setDraft(d => ({ ...d, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))}
                    className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white transition-colors"
                    placeholder="my-project"
                  />
                </div>
              </div>

              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Short Description</label>
                <textarea
                  value={draft.short_description ?? ''}
                  onChange={e => setDraft(d => ({ ...d, short_description: e.target.value }))}
                  rows={2}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white resize-none transition-colors"
                  placeholder="One-liner shown in project cards"
                />
              </div>

              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Full Description</label>
                <textarea
                  value={draft.full_description ?? ''}
                  onChange={e => setDraft(d => ({ ...d, full_description: e.target.value }))}
                  rows={4}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white resize-none transition-colors"
                  placeholder="Detailed description shown on the project detail page..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Live URL</label>
                  <input
                    value={draft.live_url ?? ''}
                    onChange={e => setDraft(d => ({ ...d, live_url: e.target.value || null }))}
                    className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white transition-colors"
                    placeholder="https://..."
                  />
                </div>
                <div>
                  <label className="block font-plus-jakarta text-xs text-text-muted mb-2">GitHub URL</label>
                  <input
                    value={draft.github_url ?? ''}
                    onChange={e => setDraft(d => ({ ...d, github_url: e.target.value || null }))}
                    className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white transition-colors"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Tech Stack (comma-separated)</label>
                <input
                  value={techStackInput}
                  onChange={e => setTechStackInput(e.target.value)}
                  className="w-full bg-bg border border-border px-3 py-2 rounded-lg font-plus-jakarta text-sm text-white outline-none focus:border-white transition-colors"
                  placeholder="Next.js, TypeScript, PostgreSQL"
                />
              </div>

              {/* Image uploader */}
              <div>
                <label className="block font-plus-jakarta text-xs text-text-muted mb-2">Images</label>
                <div className="border border-border rounded-lg p-4 bg-bg space-y-3">
                  {/* Uploaded images grid */}
                  {parseImages(draft.images as string[] | null ?? []).length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                      {parseImages(draft.images as string[] | null ?? []).map((img, i) => (
                        <div key={img.path || img.url} className="relative group">
                          <img
                            src={img.url}
                            alt={`Upload ${i + 1}`}
                            className="w-full aspect-video object-cover rounded-lg border border-border"
                          />
                          <button
                            type="button"
                            onClick={() => deleteImage(img.path || img.url, parseImages(draft.images as string[] | null ?? []))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Drop zone + upload button */}
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileChange(e, parseImages(draft.images as string[] | null ?? []))}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-2 border border-dashed border-border hover:border-white text-text-muted hover:text-white px-4 py-3 rounded-lg text-sm font-plus-jakarta transition-colors flex-1 justify-center"
                    >
                      <ImagePlus size={16} />
                      Upload Images
                    </button>
                  </div>
                  <p className="font-mono text-xs text-text-muted">
                    JPG, PNG, GIF, WebP, SVG · Max 5MB each
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.featured ?? false}
                    onChange={e => setDraft(d => ({ ...d, featured: e.target.checked }))}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="font-plus-jakarta text-sm text-white">Featured on home page</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={draft.status === 'published'}
                    onChange={e => setDraft(d => ({ ...d, status: e.target.checked ? 'published' : 'draft' }))}
                    className="w-4 h-4 accent-white"
                  />
                  <span className="font-plus-jakarta text-sm text-white">Published</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-border">
              <button
                onClick={() => { setDraft(null); setEditingId(null) }}
                className="px-4 py-2 rounded-lg font-plus-jakarta text-sm text-text-muted border border-border hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-6 py-2 rounded-lg font-syne font-semibold text-sm bg-white text-bg hover:bg-text-secondary disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop table */}
        <div className="hidden md:block border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted">Project</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted">Status</th>
                <th className="text-left px-4 py-3 font-mono text-xs text-text-muted">Stack</th>
                <th className="text-right px-4 py-3 font-mono text-xs text-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-4">
                      {item.images && item.images.length > 0 && (
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                        />
                      )}
                      <div>
                        <div className="font-plus-jakarta text-sm text-white">{item.title}</div>
                        <div className="font-mono text-xs text-text-muted">{item.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      <span className={`font-mono text-xs px-2 py-1 rounded-full ${
                        item.status === 'published'
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                          : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      }`}>
                        {item.status}
                      </span>
                      {item.featured && (
                        <span className="font-mono text-xs px-2 py-1 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
                          ★ featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(item.tech_stack ?? []).slice(0, 3).map(tech => (
                        <span key={tech} className="font-mono text-xs border border-border px-2 py-0.5 rounded-full text-text-muted">
                          {tech}
                        </span>
                      ))}
                      {(item.tech_stack ?? []).length > 3 && (
                        <span className="font-mono text-xs text-text-muted">+{(item.tech_stack ?? []).length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {item.live_url && (
                        <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                          <ExternalLink size={14} />
                        </a>
                      )}
                      {item.github_url && (
                        <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors">
                          <Github size={14} />
                        </a>
                      )}
                      <button onClick={() => toggleFeatured(item)} className="text-text-muted hover:text-yellow-400 transition-colors">
                        {item.featured ? <Star size={14} className="text-yellow-400" /> : <StarOff size={14} />}
                      </button>
                      <button onClick={() => openEdit(item)} className="text-text-muted hover:text-white transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="text-text-muted hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {items.map((item) => (
            <div key={item.id} className="border border-border rounded-xl p-4 hover:bg-surface/50 transition-colors">
              <div className="flex items-start gap-3 mb-3">
                {item.images && item.images.length > 0 && (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-plus-jakarta text-sm font-medium text-white">{item.title}</div>
                      <div className="font-mono text-xs text-text-muted truncate">{item.slug}</div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'published'
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                          : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                      }`}>
                        {item.status}
                      </span>
                      {item.featured && (
                        <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
                          ★
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-3">
                {(item.tech_stack ?? []).map(tech => (
                  <span key={tech} className="font-mono text-xs border border-border px-2 py-0.5 rounded-full text-text-muted">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {item.live_url && (
                    <a href={item.live_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors p-1.5">
                      <ExternalLink size={14} />
                    </a>
                  )}
                  {item.github_url && (
                    <a href={item.github_url} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-white transition-colors p-1.5">
                      <Github size={14} />
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleFeatured(item)} className="text-text-muted hover:text-yellow-400 transition-colors p-1.5">
                    {item.featured ? <Star size={14} className="text-yellow-400" /> : <StarOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(item)} className="text-text-muted hover:text-white transition-colors p-1.5">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => deleteItem(item.id)} className="text-text-muted hover:text-red-400 transition-colors p-1.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}