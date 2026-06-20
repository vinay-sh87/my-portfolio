'use client';

import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

const socials = [
  { icon: Github, href: 'https://github.com/vinay-sh87', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/vinaysh17', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Mail, href: 'mailto:com.vinay45@gmail.com', label: 'Email' },
];

export function Footer() {
  return (
    <footer className="relative py-12 px-6 md:px-12 border-t border-border">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left */}
          <div className="text-center md:text-left">
            <p className="font-syne font-bold text-lg mb-1">Vinay Sharma</p>
            <p className="font-plus-jakarta text-xs text-text-muted">
              &copy; {new Date().getFullYear()} — Built with intention.
            </p>
          </div>

          {/* Center: Socials */}
          <div className="flex items-center gap-5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={s.label}
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-white hover:border-border-light transition-all duration-300"
              >
                <s.icon size={14} />
              </a>
            ))}
          </div>

          {/* Right: Back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 font-plus-jakarta text-xs text-text-muted hover:text-white transition-colors group"
          >
            Back to top
            <ArrowUp
              size={14}
              className="group-hover:-translate-y-1 transition-transform duration-300"
            />
          </button>
        </div>
      </div>
    </footer>
  );
}