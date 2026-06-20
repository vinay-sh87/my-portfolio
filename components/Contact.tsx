'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Send, Github, Linkedin, Twitter, Mail, CheckCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';

const socials = [
  {
    icon: Github,
    label: "GitHub",
    href: "https://github.com/vinay-sh87",
    handle: "github.com/vinay-sh87",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/vinaysh17",
    handle: "linkedin.com/in/vinaysh17",
  },
  {
    icon: Twitter,
    label: "Twitter",
    href: "https://twitter.com",
    handle: "@vinaysharma",
  },
  {
    icon: Mail,
    label: "Email",
    href: "mailto:com.vinay45@gmail.com",
    handle: "com.vinay45@gmail.com",
  },
];

const budgetOptions = ['< $5k', '$5k – $15k', '$15k+', 'Not sure yet'];

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  // Initialize emailjs
  useEffect(() => {
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (publicKey) {
      emailjs.init(publicKey);
    } else {
      console.warn('EmailJS public key not found in environment variables');
    }
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Valid email required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStatus('sending');

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration incomplete. Please check service ID, template ID, and public key.');
      }

      // Initialize emailjs with public key (safe to call multiple times)
      emailjs.init(publicKey);

      await emailjs.sendForm(serviceId, templateId, e.currentTarget);
      setStatus('success');
    } catch (error) {
      console.error('Failed to send email:', error);
      setStatus('idle');
      // In a production app, you might want to show an error message to the user
    }
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative py-32 md:py-48 px-6 md:px-12 bg-surface overflow-hidden"
    >
      {/* Floating number */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 font-syne text-[12rem] font-extrabold pointer-events-none select-none leading-none hidden md:block"
        style={{ fontFamily: 'var(--font-syne)', color: 'var(--border)' }}
        aria-hidden="true"
      >
        04
      </div>

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-20 md:mb-32"
        >
          <span className="font-mono text-xs text-text-muted tracking-widest">04</span>
          <span className="font-mono text-xs text-text-secondary tracking-widest">/ Contact</span>
          <div className="h-px w-[80px] bg-border-light" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-28">
          {/* Left: CTA copy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.1 }}
              className="font-syne font-bold text-section leading-[1.05] tracking-tight mb-8"
            >
              Let&apos;s build
              <br />
              <span className="text-text-secondary">something great.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-plus-jakarta text-base text-text-secondary leading-relaxed mb-14 max-w-md"
            >
              Whether you have a project in mind, want to collaborate, or just want to say hello — my inbox is always open.
              I typically respond within 24 hours.
            </motion.p>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 group py-2"
                >
                  <div className="w-9 h-9 rounded-full border border-border flex items-center justify-center group-hover:border-border-light group-hover:bg-white group-hover:text-bg transition-all duration-300">
                    <s.icon size={15} />
                  </div>
                  <div>
                    <p className="font-plus-jakarta text-xs text-text-muted">{s.label}</p>
                    <p className="font-mono text-sm text-text-secondary group-hover:text-white transition-colors">
                      {s.handle}
                    </p>
                  </div>
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6 py-20"
              >
                <CheckCircle size={48} className="text-green-400" />
                <div>
                  <h3 className="font-syne font-bold text-2xl mb-2">Message sent!</h3>
                  <p className="font-plus-jakarta text-text-secondary">
                    Thanks for reaching out. I&apos;ll get back to you within 24 hours.
                  </p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block font-plus-jakarta text-xs tracking-wide text-text-muted mb-3">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className={`w-full bg-transparent border-b-2 ${errors.name ? 'border-red-500' : 'border-border focus:border-white'} px-0 py-3 font-plus-jakarta text-base text-white placeholder:text-text-muted outline-none focus-visible:outline-none transition-colors duration-300`}
                  />
                  {errors.name && (
                    <p className="mt-2 font-plus-jakarta text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block font-plus-jakarta text-xs tracking-wide text-text-muted mb-3">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                    className={`w-full bg-transparent border-b-2 ${errors.email ? 'border-red-500' : 'border-border focus:border-white'} px-0 py-3 font-plus-jakarta text-base text-white placeholder:text-text-muted outline-none focus-visible:outline-none transition-colors duration-300`}
                  />
                  {errors.email && (
                    <p className="mt-2 font-plus-jakarta text-xs text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-plus-jakarta text-xs tracking-wide text-text-muted mb-3">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project..."
                    className={`w-full bg-transparent border-b-2 ${errors.message ? 'border-red-500' : 'border-border focus:border-white'} px-0 py-3 font-plus-jakarta text-base text-white placeholder:text-text-muted outline-none focus-visible:outline-none transition-colors duration-300 resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-2 font-plus-jakarta text-xs text-red-400">{errors.message}</p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <p className="font-plus-jakarta text-xs tracking-wide text-text-muted mb-3">
                    Budget (optional)
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {budgetOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className="font-mono text-xs border border-border px-4 py-2 rounded-full text-text-muted hover:border-border-light hover:text-white transition-all duration-300"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full mt-6 flex items-center justify-center gap-3 bg-white text-bg font-syne font-semibold text-sm py-4 rounded-xl hover:bg-text-secondary transition-all duration-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-bg/30 border-t-bg rounded-full inline-block"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}