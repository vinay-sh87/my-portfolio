'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { MapPin, Clock, Zap, Globe } from 'lucide-react';

const metaItems = [
  { icon: MapPin, label: 'Location', value: 'India' },
  { icon: Clock, label: 'Timezone', value: 'IST (UTC+5:30)' },
  { icon: Zap, label: 'Response', value: '< 24 hours' },
  { icon: Globe, label: 'Remote', value: 'Worldwide' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.19, 1, 0.22, 1], delay },
  }),
};

export function About() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-32 md:py-48 px-6 md:px-12 overflow-hidden"
    >
      {/* Floating section number */}
      <div
        className="absolute top-16 left-1/2 -translate-x-1/2 font-syne text-[12rem] font-extrabold text-border pointer-events-none select-none leading-none hidden md:block"
        style={{ fontFamily: 'var(--font-syne)', color: 'var(--border)' }}
        aria-hidden="true"
      >
        01
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex items-center gap-3 mb-20 md:mb-32"
        >
          <span className="font-mono text-xs text-text-muted tracking-widest">01</span>
          <span className="font-mono text-xs text-text-secondary tracking-widest">/ About</span>
          <div className="h-px flex-1 max-w-[80px] bg-border-light" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24">
          {/* Left: Main philosophy */}
          <div>
            <motion.h2
              custom={0.1}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="font-syne font-bold text-section leading-[1.05] tracking-tight mb-10"
            >
              Building things that{' '}
              <span className="block md:inline text-text-secondary">
                live on the internet.
              </span>
            </motion.h2>

            <motion.div
              custom={0.3}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="space-y-6"
            >
              <p className="font-plus-jakarta text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Vinay is a full-stack developer who cares deeply about the intersection of design and engineering.
                He builds web experiences that are as thoughtful in their architecture as they are in their aesthetics.
              </p>
              <p className="font-plus-jakarta text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
                Whether it&apos;s a SaaS product, a developer tool, or a personal project — every line of code is written
                with intention. Currently focused on building performant, scalable applications with React, Next.js, and Node.js.
              </p>
            </motion.div>

            {/* Horizontal rule */}
            <motion.div
              custom={0.5}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={fadeUp}
              className="mt-16 h-px bg-border w-full"
            />
          </div>

          {/* Right: Meta info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.4 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-4">
              {metaItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 + i * 0.1 }}
                  className="flex items-center gap-4 p-5 border border-border rounded-lg hover:border-border-light transition-colors group"
                >
                  <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center group-hover:border-border-light transition-colors">
                    <item.icon size={15} className="text-text-muted group-hover:text-text-secondary transition-colors" />
                  </div>
                  <div>
                    <p className="font-plus-jakarta text-xs text-text-muted mb-0.5">{item.label}</p>
                    <p className="font-space-grotesk font-medium">{item.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}