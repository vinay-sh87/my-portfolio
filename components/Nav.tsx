'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Update active section
      const sections = navLinks.map((l) => l.href.slice(1));
      const found = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (found) setActiveSection(found);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch resume URL on mount
  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(d => { if (d.resume_url) setResumeUrl(d.resume_url) })
      .catch(() => {})
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-border'
            : 'bg-transparent'
        )}
      >
        <nav className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-syne font-bold text-lg tracking-tight overflow-hidden flex"
          >
            <motion.span
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -6 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.3,
              }}
              className="inline-block"
            >
              V
            </motion.span>
            <motion.span
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ y: -6 }}
              transition={{
                duration: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
                delay: 0.42,
              }}
              className="inline-block"
            >
              S
            </motion.span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className={cn(
                  'font-plus-jakarta text-sm tracking-wide transition-colors duration-300 link-underline',
                  activeSection === link.href.slice(1)
                    ? 'text-white'
                    : 'text-text-secondary hover:text-white'
                )}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="font-plus-jakarta text-xs text-text-secondary">
                Available for work
              </span>
            </div>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-plus-jakarta text-sm text-text-muted hover:text-white border border-border px-4 py-2 rounded-full hover:border-white transition-all duration-300"
              >
                <Download size={13} />
                Resume
              </a>
            )}
            <button
              onClick={() => handleNavClick('#contact')}
              className="font-plus-jakarta text-sm border border-border-light px-5 py-2 rounded-full hover:bg-white hover:text-bg transition-all duration-300 active:scale-95"
            >
              Let&apos;s talk
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 hover:opacity-70 transition-opacity"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-bg flex flex-col items-center justify-center gap-10"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => handleNavClick(link.href)}
                className="font-syne text-4xl font-bold hover:text-text-secondary transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
            {resumeUrl && (
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length) * 0.08 }}
                className="flex items-center gap-2 font-syne text-4xl font-bold text-text-muted hover:text-white transition-colors"
              >
                <Download size={28} />
                Resume
              </motion.a>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 mt-4"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              <span className="font-plus-jakarta text-sm text-text-secondary">
                Available for work
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}