'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Experience as ExperienceType } from '@/lib/supabase/types';

type Props = {
  experiences: ExperienceType[];
};

export function Experience({ experiences }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });
  const [svgWidth, setSvgWidth] = useState(1200);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [cardSide, setCardSide] = useState<'bottom' | 'top'>('bottom');
  const [isMobile, setIsMobile] = useState(false);

  const sorted = [...experiences].sort((a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0));
  const upperLane = 160;
  const lowerLane = 340;
  const midY = (upperLane + lowerLane) / 2;

  useEffect(() => {
    const measure = () => {
      if (sectionRef.current) setSvgWidth(sectionRef.current.offsetWidth);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (hoveredIndex !== null) {
      const nodeX = getNodePos(hoveredIndex).x;
      const buffer = 40;
      setCardSide(
        nodeX + 140 > svgWidth - buffer ? 'top'
          : nodeX - 140 < buffer ? 'bottom'
          : hoveredIndex % 2 === 0 ? 'bottom' : 'top'
      );
    }
  }, [hoveredIndex, svgWidth]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  function getNodePos(i: number): { x: number; y: number } {
    const spacing = svgWidth / (sorted.length + 1);
    return { x: spacing * (i + 1), y: i % 2 === 0 ? lowerLane : upperLane };
  }

  function buildPath(): string {
    if (sorted.length === 0) return 'M 0 0';
    const spacing = svgWidth / (sorted.length + 1);
    // Newest first, start from lowerLane (left side)
    let d = `M 0 ${lowerLane}`;

    for (let i = 0; i < sorted.length; i++) {
      const x = spacing * (i + 1);
      const y = i % 2 === 0 ? lowerLane : upperLane;
      if (i === 0) {
        d += ` L ${x} ${y}`;
      } else {
        const prevY = (i - 1) % 2 === 0 ? lowerLane : upperLane;
        const cp1y = prevY;
        const cp2y = y;
        d += ` C ${x - spacing * 0.4} ${cp1y}, ${x - spacing * 0.1} ${cp2y}, ${x} ${y}`;
      }
    }
    return d;
  }

  const [pathLength, setPathLength] = useState(2000);
  useEffect(() => {
    if (pathRef.current) setPathLength(pathRef.current.getTotalLength());
  }, [isInView, svgWidth]);

  if (isMobile) {
    return (
      <section id="experience" ref={sectionRef} className="py-32 px-6 bg-surface">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-20 md:mb-32">
          <span className="font-mono text-xs text-text-muted tracking-widest">03</span>
          <span className="font-mono text-xs text-text-secondary tracking-widest">/ Experience</span>
          <div className="h-px w-[80px] bg-border-light" />
        </motion.div>
        <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
          className="font-syne font-bold text-section leading-[1.05] tracking-tight mb-32">
          Career<br /><span className="text-text-secondary">Path</span>
        </motion.h2>
        <div className="space-y-8">
          {sorted.map((exp, i) => (
            <div key={exp.id} className="flex gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center font-mono text-xs text-text-muted">
                  {exp.num}
                </div>
                {i < sorted.length - 1 && <div className="w-px h-16 bg-border" />}
              </div>
              <div className="pt-1">
                <p className="font-syne font-bold text-white">{exp.role}</p>
                <p className="font-plus-jakarta text-sm text-text-secondary">{exp.company}</p>
                <p className="font-mono text-xs text-text-muted mt-1">{exp.period}</p>
                {exp.description && <p className="font-plus-jakarta text-xs text-text-secondary mt-2 leading-relaxed max-w-lg">{exp.description}</p>}
                <div className="flex flex-wrap gap-2 mt-3">
                  {(exp.tags ?? []).map(tag => (
                    <span key={tag} className="font-mono text-xs border border-border px-2 py-1 rounded-full text-text-muted">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="experience" ref={sectionRef} className="relative py-32 md:py-48 px-6 md:px-12 bg-surface overflow-hidden">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6 }} className="flex items-center gap-3 mb-20 md:mb-32">
        <span className="font-mono text-xs text-text-muted tracking-widest">03</span>
        <span className="font-mono text-xs text-text-secondary tracking-widest">/ Experience</span>
        <div className="h-px w-[80px] bg-border-light" />
      </motion.div>
      <motion.h2 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
        className="font-syne font-bold text-section leading-[1.05] tracking-tight mb-32">
        Career<br /><span className="text-text-secondary">Path</span>
      </motion.h2>

      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg ref={svgRef} className="w-full h-full" viewBox={`0 0 ${svgWidth} ${midY * 2 + 200}`} preserveAspectRatio="xMidYMid meet">
          <motion.path ref={pathRef} d={buildPath()}
            stroke="var(--border)" strokeWidth="1" fill="none"
            strokeDasharray={pathLength}
            initial={{ strokeDashoffset: pathLength }}
            animate={isInView ? { strokeDashoffset: 0 } : { strokeDashoffset: pathLength }}
            transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }} />
          <motion.circle cx={svgWidth + 20}
            cy={sorted.length % 2 === 0 ? lowerLane : upperLane} r="4"
            fill="var(--border)" initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 1.5 + sorted.length * 0.15 }} />
          {sorted.map((exp, i) => {
            const pos = getNodePos(i);
            return (
              <g key={exp.id} style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, pointerEvents: 'auto' }}>
                <motion.circle r="24"
                  initial={{ fill: 'var(--bg)', stroke: 'var(--border)' }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  animate={{ fill: hoveredIndex === i ? 'var(--text-primary)' : 'var(--bg)', stroke: hoveredIndex === i ? 'var(--text-primary)' : 'var(--border)' }}
                  transition={{ duration: 0.25 }} />
                <motion.text textAnchor="middle" dominantBaseline="central"
                  animate={{ fill: hoveredIndex === i ? 'var(--bg)' : 'var(--text-muted)' }}
                  transition={{ duration: 0.25 }}
                  className="font-mono text-xs fill-current text-text-muted pointer-events-none">
                  {exp.num}
                </motion.text>
                {exp.is_current || i === 0 ? (
                  <motion.circle r="28" fill="none" stroke="#10B981" strokeWidth="1"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }} />
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>

      {hoveredIndex !== null && sorted[hoveredIndex] && (
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="absolute z-20 bg-surface border border-border rounded-2xl p-6 w-[280px] pointer-events-none"
          style={{
            left: `${(getNodePos(hoveredIndex).x / svgWidth) * 100}%`,
            top: cardSide === 'top' ? `${(getNodePos(hoveredIndex).y / (midY * 2 + 200)) * 100}%` : `${(getNodePos(hoveredIndex).y / (midY * 2 + 200)) * 100 + 5}%`,
            transform: `translateX(-50%) ${cardSide === 'top' ? 'translateY(-120%)' : ''}`,
          }}>
          <p className="font-syne font-bold text-white mb-1">{sorted[hoveredIndex].role}</p>
          <p className="font-plus-jakarta text-sm text-text-secondary mb-2">{sorted[hoveredIndex].company}</p>
          <p className="font-mono text-xs text-text-muted mb-3">{sorted[hoveredIndex].period}</p>
          {sorted[hoveredIndex].description && (
            <p className="font-plus-jakarta text-xs text-text-secondary leading-relaxed mb-4">{sorted[hoveredIndex].description}</p>
          )}
          <div className="flex flex-wrap gap-2">
            {(sorted[hoveredIndex].tags ?? []).map(tag => (
              <span key={tag} className="font-mono text-xs border border-border px-2 py-1 rounded-full text-text-muted">{tag}</span>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  );
}