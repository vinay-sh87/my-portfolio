'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

const NAME = 'VINAY SHARMA';
const ROLES = ['Full Stack Developer', 'Builder of things', 'Code & Design'];

function AnimatedText({
  text,
  className,
  delay = 0,
  splitChars = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  splitChars?: boolean;
}) {
  const chars = text.split('');

  return (
    <span className={`inline-block ${className}`}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
          animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.77, 0, 0.18, 1],
            delay: delay + i * 0.04,
          }}
          className="inline-block"
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const bgTextY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-dvh flex flex-col justify-center overflow-hidden px-6 md:px-12"
    >
      {/* Background giant text layer */}
      <motion.div
        style={{ y: bgTextY }}
        className="absolute inset-0 pointer-events-none select-none flex items-center justify-center"
        aria-hidden="true"
      >
        <span
          className="bg-text-overlay"
          style={{
            fontFamily: 'var(--font-syne), sans-serif',
            fontWeight: 800,
          }}
        >
          DEV
        </span>
      </motion.div>

      {/* Main content */}
      <motion.div style={{ y: contentY, opacity }} className="relative z-10 max-w-[1400px] mx-auto w-full">
        {/* Pre-title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
          className="font-plus-jakarta text-sm tracking-[0.2em] text-text-secondary uppercase mb-8 md:mb-12"
        >
          Full Stack Developer
        </motion.p>

        {/* Main name — the hero typography moment */}
        <div className="overflow-hidden">
          <h1 className="font-syne font-extrabold leading-[0.88] tracking-tight text-white">
            <AnimatedText
              text="VINAY"
              className="block text-display"
              delay={0.7}
            />
            <br />
            <AnimatedText
              text="SHARMA"
              className="block text-display"
              delay={0.9}
            />
          </h1>
        </div>

        {/* Role / descriptor line */}
        <motion.div
          initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
          animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
          transition={{ duration: 1, ease: [0.77, 0, 0.18, 1], delay: 1.6 }}
          className="mt-6 md:mt-8"
        >
          <p className="font-space-grotesk text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
            I build things that live on the internet. Fast, clean, and built to last.
          </p>
        </motion.div>

        {/* Bottom meta row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2, ease: 'easeOut' }}
          className="flex items-center gap-8 mt-16 md:mt-24"
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="font-plus-jakarta text-xs text-text-secondary tracking-wide">
              Open to opportunities
            </span>
          </div>

          <div className="h-px w-12 bg-border-light" />

          <span className="font-mono text-xs text-text-muted tracking-wide">
            India, IN
          </span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-plus-jakarta text-[10px] tracking-[0.2em] text-text-muted uppercase">
            Scroll
          </span>
          <ArrowDown size={16} className="text-text-muted" />
        </motion.div>
      </motion.div>

      {/* Corner decorations */}
      <div className="absolute top-24 right-8 md:right-16 z-10 hidden md:block">
        <div className="text-text-muted font-mono text-xs tracking-widest rotate-90 origin-center translate-y-8">
          © 2026
        </div>
      </div>
    </section>
  );
}