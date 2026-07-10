import { motion } from 'framer-motion'
import clsx from 'clsx'
import type { ReactNode } from 'react'

// ---------- Logo ----------
// Shield mark inspired by the CATLab crest. Swap for the real
// crest asset (SVG/PNG) when David exports it.
export function CrestMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true">
      <path
        d="M20 2 L37 8 V22 C37 33 29.5 39.5 20 42 C10.5 39.5 3 33 3 22 V8 Z"
        fill="currentColor"
      />
      <path
        d="M20 8 V34 M11 17 H29"
        stroke="#B08D57"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <CrestMark
        className={clsx('h-8 w-8', dark ? 'text-white' : 'text-burgundy-600')}
      />
      <span className="flex flex-col leading-none">
        <span
          className={clsx(
            'text-[0.6rem] font-semibold tracking-[0.22em]',
            dark ? 'text-white/60' : 'text-warmgray',
          )}
        >
          WESTMONT
        </span>
        <span
          className={clsx(
            'font-serif text-lg font-bold tracking-tight',
            dark ? 'text-white' : 'text-burgundy-600',
          )}
        >
          CATLab
        </span>
      </span>
    </span>
  )
}

// ---------- Type ----------
export function Eyebrow({
  children,
  gold = false,
}: {
  children: ReactNode
  gold?: boolean
}) {
  return (
    <p className={clsx('eyebrow mb-3', gold ? 'text-gold-500' : 'text-burgundy-600')}>
      {children}
    </p>
  )
}

export function SectionTitle({
  children,
  dark = false,
  className,
}: {
  children: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <h2
      className={clsx(
        'font-serif text-3xl font-bold tracking-tight text-balance sm:text-4xl',
        dark ? 'text-white' : 'text-charcoal',
        className,
      )}
    >
      {children}
    </h2>
  )
}

// ---------- Buttons ----------
const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-burgundy-600 active:scale-[0.98]'

export function ButtonPrimary({
  children,
  className,
  ...rest
}: React.ComponentProps<'button'>) {
  return (
    <button
      className={clsx(
        btnBase,
        'bg-burgundy-600 text-white shadow-sm hover:bg-burgundy-700 hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonGold({
  children,
  className,
  ...rest
}: React.ComponentProps<'button'>) {
  return (
    <button
      className={clsx(
        btnBase,
        'bg-gold-500 text-white shadow-sm hover:bg-gold-600 hover:shadow-md',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ButtonGhost({
  children,
  className,
  dark = false,
  ...rest
}: React.ComponentProps<'button'> & { dark?: boolean }) {
  return (
    <button
      className={clsx(
        btnBase,
        dark
          ? 'border border-white/25 text-white hover:border-white/50 hover:bg-white/5'
          : 'border border-burgundy-200 text-burgundy-600 hover:border-burgundy-400 hover:bg-burgundy-50',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

// ---------- Avatar (initials — consistent treatment, no stock photos) ----------
export function Avatar({
  name,
  size = 'md',
  className,
}: {
  name: string
  size?: 'md' | 'lg' | 'xl'
  className?: string
}) {
  const initials = name
    .replace(/\[|\]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('')
  const sizes = {
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
    xl: 'h-24 w-24 text-3xl',
  }
  return (
    <div
      className={clsx(
        'flex items-center justify-center rounded-full bg-gradient-to-br from-burgundy-500 to-burgundy-800 font-serif font-semibold text-white select-none',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials || '·'}
    </div>
  )
}

// ---------- Scroll reveal ----------
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.21, 0.65, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ---------- Layout helpers ----------
export function Container({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={clsx('mx-auto w-full max-w-6xl px-5 sm:px-8', className)}>
      {children}
    </div>
  )
}

// ---------- Form input ----------
export function Input({
  className,
  ...rest
}: React.ComponentProps<'input'>) {
  return (
    <input
      className={clsx(
        'w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-warmgray/70 focus:border-burgundy-400 focus:ring-2 focus:ring-burgundy-100 focus:outline-none transition',
        className,
      )}
      {...rest}
    />
  )
}

export function Textarea({
  className,
  ...rest
}: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      className={clsx(
        'w-full rounded-md border border-charcoal/15 bg-white px-4 py-2.5 text-sm text-charcoal placeholder:text-warmgray/70 focus:border-burgundy-400 focus:ring-2 focus:ring-burgundy-100 focus:outline-none transition',
        className,
      )}
      {...rest}
    />
  )
}
