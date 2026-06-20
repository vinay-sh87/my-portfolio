'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import Link from 'next/link';
import { Project as ProjectType } from '@/lib/supabase/types';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: i * 0.12 },
  }),
};

type Props = {
  allProjects?: ProjectType[];
  isHome?: boolean;
  hideHeader?: boolean;
};

function mapToDisplay(project: ProjectType, index: number) {
  return {
    num: String(index + 1).padStart(2, '0'),
    title: project.title,
    desc: project.short_description ?? '',
    tags: project.tech_stack ?? [],
    status: project.status === 'published' ? 'Live' : 'Draft',
    slug: project.slug,
    images: project.images ?? [],
    live_url: project.live_url,
    github_url: project.github_url,
  };
}

export function Projects({ allProjects = [], isHome = false, hideHeader = false }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const router = useRouter();

  const projects = allProjects.map(mapToDisplay);
  const displayProjects = isHome ? projects.slice(0, 3) : projects;

  const handleClick = (slug: string) => {
    router.push(`/projects/${slug}`);
  };

  return (
    <section
      id="work"
      ref={ref}
      className="relative py-32 md:py-48 px-6 md:px-12 bg-surface"
    >
      {hideHeader
        ? null
        : <div
            className="absolute top-16 right-8 md:right-16 font-syne text-[12rem] font-extrabold pointer-events-none select-none leading-none hidden md:block"
            style={{ fontFamily: 'var(--font-syne)', color: 'var(--border)' }}
            aria-hidden="true"
          >
            02
          </div>
      }

      <div className="max-w-[1400px] mx-auto relative z-10">
        {!hideHeader && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex items-center gap-3 mb-20 md:mb-32"
          >
            <span className="font-mono text-xs text-text-muted tracking-widest">02</span>
            <span className="font-mono text-xs text-text-secondary tracking-widest">/ Work</span>
            <div className="h-px w-[80px] bg-border-light" />
          </motion.div>
        )}

        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 md:mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="font-syne font-bold text-section leading-[1.05] tracking-tight"
            >
              {isHome ? 'Selected' : 'All'}
              <br />
              <span className="text-text-secondary">Projects</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <Github size={16} className="text-text-muted" />
              <span className="font-mono text-sm text-text-muted">github.com/vinay-sh87</span>
            </motion.div>
          </div>
        )}

        {displayProjects.length === 0 ? (
          <div className="text-center py-20 font-plus-jakarta text-sm text-text-muted">
            No projects to display yet.
          </div>
        ) : (
          <div className="space-y-4">
            {displayProjects.map((project, i) => (
              <motion.article
                key={project.num + project.slug}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                variants={fadeUp}
                custom={i}
                onClick={() => handleClick(project.slug)}
                className="group relative border border-border rounded-2xl p-8 md:p-12 hover:border-white/50 transition-all duration-500 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <span className="font-syne text-5xl md:text-6xl font-extrabold text-border group-hover:text-white transition-colors duration-500 tracking-tight">
                    {project.num}
                  </span>
                  <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-mono text-xs text-green-400 border border-green-400/30 px-3 py-1 rounded-full">
                      {project.status}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-text-muted group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-8">
                  <div>
                    <h3 className="font-syne font-bold text-xl md:text-2xl mb-3 group-hover:translate-x-2 transition-transform duration-500">
                      {project.title}
                    </h3>
                    <p className="font-plus-jakarta text-sm text-text-secondary leading-relaxed max-w-xl">
                      {project.desc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 items-center md:justify-end">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs border border-border px-4 py-1 rounded-full text-text-muted group-hover:border-white group-hover:text-white transition-colors duration-300 whitespace-nowrap"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  className="absolute bottom-0 left-0 right-0 h-px bg-border-light origin-left rounded-b-2xl"
                />
              </motion.article>
            ))}
          </div>
        )}

        {isHome && projects.length > 3 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 font-mono text-sm text-text-muted hover:text-white transition-colors"
            >
              View all {projects.length} projects →
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}