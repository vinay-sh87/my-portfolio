'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { StackItem } from '@/lib/supabase/types';

type Props = {
  stack: StackItem[];
};

type SkillGroup = {
  label: string;
  items: string[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: i * 0.08 },
  }),
};

export function Skills({ stack }: Props) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Group stack items by category, ungrouped items go to "Other"
  const groups: SkillGroup[] = [];
  const ungrouped: string[] = [];

  for (const item of stack) {
    if (item.category) {
      const existing = groups.find(g => g.label.toLowerCase() === item.category?.toLowerCase());
      if (existing) {
        existing.items.push(item.name);
      } else {
        groups.push({ label: item.category, items: [item.name] });
      }
    } else {
      ungrouped.push(item.name);
    }
  }

  if (ungrouped.length > 0) {
    const other = groups.find(g => g.label === 'Other');
    if (other) {
      other.items.push(...ungrouped);
    } else {
      groups.push({ label: 'Other', items: ungrouped });
    }
  }

  // Sort items within each group by sort_order
  const sortedStack = [...stack].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <section id="skills" ref={ref} className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden">
      <div className="absolute top-16 left-1/2 -translate-x-1/2 font-syne text-[12rem] font-extrabold pointer-events-none select-none leading-none hidden md:block"
        style={{ fontFamily: 'var(--font-syne)', color: 'var(--border)' }} aria-hidden="true">
        04
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-20 md:mb-32">
          <span className="font-mono text-xs text-text-muted tracking-widest">04</span>
          <span className="font-mono text-xs text-text-secondary tracking-widest">/ Skills</span>
          <div className="h-px w-[80px] bg-border-light" />
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
          className="font-syne font-bold text-section leading-[1.05] tracking-tight mb-20 md:mb-28">
          The tools I work with
        </motion.h2>

        {groups.length === 0 ? (
          <div className="text-center py-16 font-plus-jakarta text-sm text-text-muted">
            No skills added yet. Add them via{' '}
            <a href="/admin/stack" className="text-white hover:underline">/admin/stack</a>.
          </div>
        ) : (
          <div className="space-y-16 md:space-y-24">
            {groups.map((group, gi) => (
              <div key={group.label}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: gi * 0.1 }} className="flex items-center gap-4 mb-8">
                  <h3 className="font-space-grotesk font-semibold text-sm tracking-[0.15em] uppercase text-text-muted">
                    {group.label}
                  </h3>
                  <div className="h-px flex-1 bg-border" />
                </motion.div>

                <div className="flex flex-wrap gap-3 md:gap-4">
                  {group.items.map((skill, si) => (
                    <motion.span key={skill} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
                      variants={fadeUp} custom={gi * 10 + si}
                      className="font-syne font-semibold text-base md:text-lg px-4 md:px-6 py-2 md:py-3 border border-border rounded-lg text-text-secondary hover:text-white hover:border-border-light cursor-default transition-all duration-300">
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}