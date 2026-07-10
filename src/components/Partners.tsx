import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { partners, testimonials } from '../lib/data'
import { Container, Eyebrow, Reveal, SectionTitle } from './ui'

// Wordmark-style logo treatment: consistent type-based tiles until
// real partner logo files are collected.
function PartnerTile({ name }: { name: string }) {
  return (
    <div className="flex h-full min-h-20 items-center justify-center rounded-lg border border-charcoal/8 bg-white px-4 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-burgundy-200 hover:shadow-md">
      <span className="text-center font-serif text-sm leading-snug font-semibold tracking-tight text-charcoal/75">
        {name}
      </span>
    </div>
  )
}

export function PartnersGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {partners.map((p, i) => (
        <Reveal key={p} delay={i * 0.05} className="h-full">
          <PartnerTile name={p} />
        </Reveal>
      ))}
    </div>
  )
}

const INTERVAL = 6500

export function TestimonialCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (paused) return
    timer.current = setInterval(
      () => setIndex((i) => (i + 1) % testimonials.length),
      INTERVAL,
    )
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [paused])

  const go = (dir: 1 | -1) =>
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length)

  const t = testimonials[index]

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="min-h-48 sm:min-h-40">
        <AnimatePresence mode="wait">
          <motion.figure
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.45, ease: [0.21, 0.65, 0.36, 1] }}
          >
            <blockquote className="font-serif text-xl leading-relaxed text-white sm:text-2xl">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-gold-400">{t.attribution}</span>
              <span className="text-white/50"> · {t.detail}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-7 bg-gold-400' : 'w-1.5 bg-white/25 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4l-6 6 6 6" />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 4l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// Full dark section combining both — used on Home and Companies
export function PartnersSection({
  eyebrow = 'Partners',
  title = 'Companies already hiring CATLab talent',
}: {
  eyebrow?: string
  title?: string
}) {
  return (
    <section className="bg-burgundy-800 py-20 sm:py-28">
      <Container>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow gold>{eyebrow}</Eyebrow>
              <SectionTitle dark className="mb-8">
                {title}
              </SectionTitle>
            </Reveal>
            <PartnersGrid />
          </div>
          <div className="flex flex-col justify-center">
            <Reveal delay={0.15}>
              <TestimonialCarousel />
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  )
}
