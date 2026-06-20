import { getContent } from '@/lib/content'
import { Projects } from '@/components/Projects'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AllProjectsPage() {
  const { projects } = await getContent()

  return (
    <main className="min-h-screen bg-bg">
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-white transition-colors mb-12"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono text-xs text-text-muted tracking-widest">03</span>
            <span className="font-mono text-xs text-text-secondary tracking-widest">/ Projects</span>
            <div className="h-px w-[80px] bg-border-light" />
          </div>
          <h1 className="font-syne font-bold text-5xl md:text-6xl text-white leading-[1.05] tracking-tight mb-4">
            All Projects
          </h1>
          <p className="font-plus-jakarta text-base text-text-secondary max-w-md">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in the collection
          </p>
        </div>
      </section>
      <Projects allProjects={projects} hideHeader />
    </main>
  )
}