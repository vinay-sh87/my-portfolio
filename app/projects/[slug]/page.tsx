import { getProjectBySlug } from '@/lib/content'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Github, ExternalLink, Calendar } from 'lucide-react'
import { ProjectImageGallery } from '@/components/ProjectImageGallery'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getProjectBySlug(slug)

  if (!project) notFound()

  return (
    <main className="min-h-screen bg-bg">
      <div className="max-w-[900px] mx-auto px-6 md:px-12 py-32">
        {/* Back */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 font-mono text-xs text-text-muted hover:text-white transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Projects
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-syne font-bold text-5xl md:text-6xl text-white leading-[1.05] tracking-tight mb-6">
            {project.title}
          </h1>
          {project.short_description && (
            <p className="font-plus-jakarta text-xl text-text-secondary leading-relaxed max-w-xl">
              {project.short_description}
            </p>
          )}
        </div>

        {/* Tech stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {project.tech_stack.map(tech => (
              <span
                key={tech}
                className="font-mono text-xs border border-border px-3 py-1.5 rounded-full text-text-muted"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Images */}
        {project.images && project.images.length > 0 && (
          <ProjectImageGallery images={project.images} title={project.title} />
        )}

        {/* Full description */}
        {project.full_description && (
          <div className="mb-12">
            <p className="font-plus-jakarta text-base text-text-secondary leading-relaxed whitespace-pre-line">
              {project.full_description}
            </p>
          </div>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-8 border-t border-border">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-bg font-syne font-semibold text-sm px-6 py-3 rounded-xl hover:bg-text-secondary transition-colors"
            >
              <ExternalLink size={14} /> Live Site
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border text-white font-syne font-semibold text-sm px-6 py-3 rounded-xl hover:border-border-light hover:bg-surface transition-all"
            >
              <Github size={14} /> Source Code
            </a>
          )}
        </div>
      </div>
    </main>
  )
}