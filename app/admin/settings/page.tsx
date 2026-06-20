'use client'

import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, FileText } from 'lucide-react'

type SettingsData = { key: string; value: string }[]

export default function SettingsAdminPage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { 'x-admin-password': sessionStorage.getItem('admin_auth') === 'true'
          ? String(process.env.NEXT_PUBLIC_ADMIN_PASSWORD) : '' }
      })
      if (!res.ok) throw new Error('Failed to fetch')
      const { data }: { data: SettingsData } = await res.json()
      setResumeUrl(data.find(s => s.key === 'resume_url')?.value ?? null)
    } catch (err) {
      console.error('Failed to fetch settings:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSettings() }, [])

  const uploadResume = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    const password = sessionStorage.getItem('admin_auth') === 'true'
      ? String(process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
      : ''

    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'x-admin-password': password },
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Upload failed')
    }

    return res.json() as Promise<{ url: string }>
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const result = await uploadResume(file)
      setResumeUrl(result.url)
    } catch (err: any) {
      alert(`Upload failed: ${err.message}`)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const deleteResume = async () => {
    if (!confirm('Remove resume?')) return
    setDeleting(true)
    try {
      const password = sessionStorage.getItem('admin_auth') === 'true'
        ? String(process.env.NEXT_PUBLIC_ADMIN_PASSWORD)
        : ''

      await fetch('/api/admin/settings', {
        method: 'DELETE',
        headers: { 'x-admin-password': password }
      })
      setResumeUrl(null)
    } catch (err: any) {
      alert(`Delete failed: ${err.message}`)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="text-text-muted font-plus-jakarta text-sm">Loading...</div>

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-syne font-bold text-2xl text-white">Settings</h1>
        <p className="font-plus-jakarta text-sm text-text-muted mt-1">Site-wide configuration</p>
      </div>

      {/* Resume Section */}
      <div className="border border-border rounded-2xl p-6 bg-surface max-w-xl">
        <div className="flex items-center gap-3 mb-1">
          <FileText size={18} className="text-text-muted" />
          <h2 className="font-syne font-bold text-lg text-white">Resume</h2>
        </div>
        <p className="font-plus-jakarta text-xs text-text-muted mb-6">
          Upload your resume as a PDF. It will be linked in the navigation bar.
        </p>

        {resumeUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 border border-border rounded-xl bg-bg">
              <FileText size={20} className="text-text-muted flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-plus-jakarta text-sm text-white truncate">resume.pdf</p>
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-text-muted hover:text-white transition-colors truncate block"
                >
                  {resumeUrl.split('/').pop()}
                </a>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-white border border-border px-3 py-1.5 rounded-lg hover:bg-white hover:text-bg transition-colors flex-shrink-0"
              >
                View
              </a>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 font-plus-jakarta text-sm border border-border px-4 py-2 rounded-lg text-text-muted hover:text-white hover:border-white transition-colors disabled:opacity-50"
              >
                <Upload size={14} />
                {uploading ? 'Uploading...' : 'Replace'}
              </button>
              <button
                onClick={deleteResume}
                disabled={deleting}
                className="flex items-center gap-2 font-plus-jakarta text-sm border border-border px-4 py-2 rounded-lg text-text-muted hover:text-red-400 hover:border-red-400/50 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-border hover:border-white text-text-muted hover:text-white px-6 py-8 rounded-xl font-plus-jakarta text-sm transition-colors"
            >
              <Upload size={18} />
              {uploading ? 'Uploading...' : 'Upload Resume (PDF)'}
            </button>
            <p className="font-mono text-xs text-text-muted">PDF only · Max 5MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  )
}