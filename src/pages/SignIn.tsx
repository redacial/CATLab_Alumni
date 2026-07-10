import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { ButtonPrimary, Container, CrestMark, Input } from '../components/ui'

export function SignIn() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !name.trim()) return
    setSent(true)
    // Demo magic-link: brief "check your email" beat, then in.
    setTimeout(() => {
      signIn(email.trim(), name.trim())
      navigate('/network')
    }, 1400)
  }

  return (
    <section className="flex min-h-[70vh] items-center py-16">
      <Container className="max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.65, 0.36, 1] }}
          className="rounded-2xl border border-charcoal/8 bg-white p-8 shadow-lg sm:p-10"
        >
          <CrestMark className="h-10 w-10 text-burgundy-600" />
          <h1 className="mt-5 font-serif text-2xl font-bold text-charcoal">
            Alumni & student sign in
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-warmgray">
            We’ll send a magic link to your email — no password to remember.
          </p>

          {sent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 flex items-center gap-3 rounded-md bg-burgundy-50 px-4 py-3.5"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="h-4 w-4 rounded-full border-2 border-burgundy-200 border-t-burgundy-600"
              />
              <p className="text-sm font-medium text-burgundy-600">
                Link sent — signing you in…
              </p>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Full name"
                aria-label="Full name"
              />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                aria-label="Email address"
              />
              <ButtonPrimary type="submit" className="w-full">
                Send magic link
              </ButtonPrimary>
            </form>
          )}

          <p className="mt-6 text-xs leading-relaxed text-warmgray/80">
            Demo mode: sign-in is simulated locally. Production will use real
            magic-link email via Firebase Auth.
          </p>
        </motion.div>
      </Container>
    </section>
  )
}
