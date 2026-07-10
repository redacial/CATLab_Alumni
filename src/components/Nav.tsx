import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { Wordmark } from './ui'

const links = [
  { to: '/', label: 'Students' },
  { to: '/companies', label: 'Companies' },
  { to: '/blog', label: 'Blog' },
  { to: '/network', label: 'Network' },
]

export function Nav() {
  const { user, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 border-b border-charcoal/8 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link to="/" onClick={() => setOpen(false)} aria-label="CATLab home">
          <Wordmark />
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'rounded-md px-3.5 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-burgundy-600'
                    : 'text-warmgray hover:text-charcoal',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
          {user ? (
            <button
              onClick={() => {
                signOut()
                navigate('/')
              }}
              className="ml-3 rounded-md border border-charcoal/12 px-4 py-2 text-sm font-medium text-charcoal transition hover:border-charcoal/30"
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/signin"
              className="ml-3 rounded-md bg-burgundy-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-burgundy-700"
            >
              Alumni sign in
            </Link>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-charcoal md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="overflow-hidden border-t border-charcoal/8 bg-white md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    clsx(
                      'rounded-md px-3 py-2.5 text-base font-medium',
                      isActive ? 'bg-burgundy-50 text-burgundy-600' : 'text-charcoal',
                    )
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    signOut()
                    setOpen(false)
                    navigate('/')
                  }}
                  className="mt-2 rounded-md border border-charcoal/12 px-3 py-2.5 text-left text-base font-medium text-charcoal"
                >
                  Sign out
                </button>
              ) : (
                <Link
                  to="/signin"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-md bg-burgundy-600 px-3 py-2.5 text-center text-base font-semibold text-white"
                >
                  Alumni sign in
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
