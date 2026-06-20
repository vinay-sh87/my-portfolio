'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  images: string[]
  title: string
}

export function ProjectImageGallery({ images, title }: Props) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

  // Auto-slide every 3s
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => setIndex(i => (i + 1) % images.length), 3000)
    return () => clearInterval(timer)
  }, [images.length])

  // Reset on img change
  useEffect(() => { setIndex(0) }, [images])

  if (!images || images.length === 0) return null

  return (
    <>
      <div className="relative mb-12 rounded-2xl overflow-hidden border border-border group">
        {/* Main image */}
        <div className="relative aspect-video bg-bg overflow-hidden">
          <img
            key={images[index]}
            src={images[index]}
            alt={`${title} screenshot ${index + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            style={{ objectPosition: 'top' }}
            onClick={() => { setLightboxIndex(index); setLightbox(true) }}
          />

          {/* Nav arrows — always show on mobile, hover on desktop */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setIndex(i) }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === index ? 'bg-white w-4' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}

          {/* Expand hint */}
          <div className="absolute bottom-3 right-3 font-mono text-xs text-white/50 bg-black/40 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            click to expand
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-6"
          onClick={() => setLightbox(false)}
        >
          <button
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + images.length) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          <img
            key={lightboxIndex}
            src={images[lightboxIndex]}
            alt={`${title} screenshot ${lightboxIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg animate-[fadeIn_200ms_ease-out]"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Counter */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-white/60">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}