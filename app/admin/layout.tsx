'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { LayoutDashboard, FolderKanban, Briefcase, Layers, LogOut, ChevronRight, Settings } from 'lucide-react'

const navItems = [
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/stack', label: 'Stack', icon: Layers },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authenticated, setAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth')
    if (stored === 'true') {
      setAuthenticated(true)
    }
    setChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthenticated(true)
    } else {
      alert('Invalid password')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth')
    setAuthenticated(false)
  }

  if (checking) return null

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-syne font-bold text-2xl text-white mb-2">Admin Access</h1>
          <p className="font-plus-jakarta text-sm text-text-muted mb-8">
            Enter your admin password to continue
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              name="password"
              type="password"
              placeholder="Admin password"
              className="w-full bg-surface border border-border px-4 py-3 rounded-lg font-plus-jakarta text-sm text-white placeholder:text-text-muted outline-none focus:border-white transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-white text-bg font-syne font-semibold py-3 rounded-lg hover:bg-text-secondary transition-colors"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex flex-col">
        <div className="p-6 border-b border-border">
          <Link href="/admin" className="font-syne font-bold text-lg text-white flex items-center gap-2">
            <LayoutDashboard size={18} />
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-plus-jakarta text-sm transition-all ${
                  active
                    ? 'bg-white text-bg font-medium'
                    : 'text-text-muted hover:text-white hover:bg-surface'
                }`}
              >
                <Icon size={16} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-plus-jakarta text-sm text-text-muted hover:text-white hover:bg-surface transition-all"
            >
              View Site →
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-plus-jakarta text-sm text-text-muted hover:text-red-400 hover:bg-surface transition-all"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}