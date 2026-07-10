import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { interns, outcomes, partners, posts } from '../lib/data'
import { PartnersSection } from '../components/Partners'
import {
  Avatar,
  ButtonGold,
  ButtonPrimary,
  Container,
  Eyebrow,
  Input,
  Reveal,
  SectionTitle,
} from '../components/ui'

// ---------------------------------------------------------------
// Hero
// ---------------------------------------------------------------
function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-20%] h-[36rem] w-[36rem] rounded-full bg-burgundy-50 blur-3xl"
      />
      <Container className="relative py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.65, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Eyebrow>Westmont College · Applied Technology</Eyebrow>
          <h1 className="font-serif text-5xl leading-[1.08] font-bold tracking-tight text-charcoal text-balance sm:text-6xl lg:text-7xl">
            Real work.
            <br />
            Real companies.
            <br />
            <span className="text-burgundy-600">Before you graduate.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-warmgray">
            CATLab students hold professional roles at real companies — with
            weekly professional development on top. The proof is where our
            alumni work now.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href="#outcomes">
              <ButtonPrimary>See the outcomes</ButtonPrimary>
            </a>
            <a href="#apply">
              <ButtonGold>Express interest</ButtonGold>
            </a>
          </div>
        </motion.div>

        {/* Stat strip */}
        <motion.dl
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.21, 0.65, 0.36, 1] }}
          className="mt-20 grid max-w-2xl grid-cols-3 gap-8 border-t border-charcoal/8 pt-8"
        >
          {[
            ['35 hrs', 'a week in a real role'],
            ['5 hrs', 'weekly professional development'],
            [String(partners.length), 'partner companies hiring'],
          ].map(([n, label]) => (
            <div key={label}>
              <dt className="sr-only">{label}</dt>
              <dd className="font-serif text-3xl font-bold text-gold-500 sm:text-4xl">
                {n}
              </dd>
              <dd className="mt-1 text-sm text-warmgray">{label}</dd>
            </div>
          ))}
        </motion.dl>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------
// Outcomes showcase — the screenshot surface
// ---------------------------------------------------------------
function PathChips({ path }: { path: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
      {path.map((step, i) => (
        <span key={step} className="flex items-center gap-1.5">
          {i > 0 && (
            <svg viewBox="0 0 12 12" className="h-3 w-3 text-gold-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h6M6.5 3.5L9 6l-2.5 2.5" />
            </svg>
          )}
          <span
            className={
              i === path.length - 1
                ? 'rounded-full bg-burgundy-600 px-2.5 py-0.5 text-white'
                : 'rounded-full bg-burgundy-50 px-2.5 py-0.5 text-burgundy-600'
            }
          >
            {step}
          </span>
        </span>
      ))}
    </div>
  )
}

function OutcomeCard({ o, delay }: { o: (typeof outcomes)[number]; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="group flex h-full flex-col rounded-xl border border-charcoal/8 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-250 hover:-translate-y-1 hover:shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <Avatar name={o.name} />
          <span className="rounded-full border border-charcoal/8 px-2.5 py-1 text-[0.68rem] font-semibold tracking-wide text-warmgray uppercase">
            {o.industry}
          </span>
        </div>
        <h3 className="mt-4 font-serif text-xl font-bold text-charcoal">
          {o.name}
        </h3>
        <p className="mt-0.5 text-sm text-warmgray">{o.catlabYears}</p>
        <p className="mt-3 text-sm font-semibold text-charcoal">
          {o.role}
          <span className="font-normal text-warmgray"> · {o.company}</span>
        </p>
        {o.highlight && (
          <p className="mt-2 text-sm leading-relaxed text-warmgray">
            {o.highlight}
          </p>
        )}
        <div className="mt-auto pt-5">
          <PathChips path={o.path} />
        </div>
      </article>
    </Reveal>
  )
}

function Outcomes() {
  return (
    <section id="outcomes" className="bg-burgundy-50/50 py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>Outcomes, not promises</Eyebrow>
          <SectionTitle>Where CATLab alumni work now</SectionTitle>
          <p className="mt-4 max-w-2xl text-warmgray">
            Every name below started as a CATLab student. No composites, no
            stock photos — this is the actual pipeline.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o, i) => (
            <OutcomeCard key={o.name} o={o} delay={(i % 3) * 0.08} />
          ))}
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------
// Current intern showcase
// ---------------------------------------------------------------
function Interns() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>In the lab right now</Eyebrow>
          <SectionTitle>Current interns, current projects</SectionTitle>
          <p className="mt-4 max-w-2xl text-warmgray">
            CATLab students don’t do busywork. Each one is building something a
            real team depends on.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {interns.map((intern, i) => (
            <Reveal key={i} delay={(i % 4) * 0.07}>
              <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-charcoal/8 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-250 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-burgundy-600 to-burgundy-800">
                  <Avatar
                    name={intern.name}
                    size="xl"
                    className="ring-4 ring-white/15 transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-serif text-lg font-bold text-charcoal">
                    {intern.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-warmgray">{intern.bio}</p>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal/85">
                    {intern.project}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------
// What CATLab actually is
// ---------------------------------------------------------------
function WhatIsCatlab() {
  const points = [
    {
      title: 'Entry-level work is disappearing',
      body: 'The first rung of the ladder — the job where you learn how work works — is being automated away. Waiting until graduation to start climbing is a losing strategy.',
    },
    {
      title: 'This is a real trial of professional work',
      body: 'Thirty-five hours a week in an actual role at an actual company, plus five hours of structured professional development. Not a simulation. Not a case study.',
    },
    {
      title: 'Low stakes to try — or to switch lanes',
      body: 'Find out whether engineering, sales, or operations fits you while you’re still a student, when changing direction costs a conversation instead of a career reset.',
    },
  ]
  return (
    <section className="border-y border-charcoal/8 bg-white py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-2">
            <Reveal>
              <Eyebrow>What CATLab is</Eyebrow>
              <SectionTitle>
                A head start the job market no longer hands out
              </SectionTitle>
            </Reveal>
          </div>
          <div className="space-y-10 lg:col-span-3">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.1}>
                <div className="flex gap-5">
                  <span className="font-serif text-2xl font-bold text-gold-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-charcoal">
                      {p.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-warmgray">{p.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------
// Blog teaser + newsletter capture
// ---------------------------------------------------------------
function BlogTeaser() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    // Lead capture only — store locally until send infra exists
    const leads = JSON.parse(localStorage.getItem('catlab:leads') ?? '[]')
    localStorage.setItem('catlab:leads', JSON.stringify([...leads, email.trim()]))
    setDone(true)
  }

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <Reveal>
              <Eyebrow>From the lab</Eyebrow>
              <SectionTitle className="mb-8">Latest from CATLab</SectionTitle>
            </Reveal>
            <div className="space-y-4">
              {posts.slice(0, 3).map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.08}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="group block rounded-lg border border-charcoal/8 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-burgundy-200 hover:shadow-md"
                  >
                    <p className="text-xs font-medium text-warmgray">{p.date}</p>
                    <h3 className="mt-1 font-serif text-lg font-bold text-charcoal transition-colors group-hover:text-burgundy-600">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-2 text-sm text-warmgray">
                      {p.excerpt}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.15} className="flex flex-col justify-center">
            <div className="rounded-xl bg-burgundy-50/70 p-8 sm:p-10">
              <h3 className="font-serif text-2xl font-bold text-charcoal">
                The newsletter, modernized
              </h3>
              <p className="mt-3 leading-relaxed text-warmgray">
                CATLab used to publish once a summer, on paper. Now it’s here.
                Program news, placements, and what students are building —
                straight to your inbox.
              </p>
              {done ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 rounded-md bg-white px-4 py-3 text-sm font-medium text-burgundy-600"
                >
                  You’re on the list. Watch your inbox.
                </motion.p>
              ) : (
                <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    aria-label="Email address"
                  />
                  <ButtonPrimary type="submit" className="shrink-0">
                    Subscribe
                  </ButtonPrimary>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

// ---------------------------------------------------------------
// Apply CTA
// ---------------------------------------------------------------
function ApplyCta() {
  return (
    <section id="apply" className="bg-burgundy-800 py-20 sm:py-24">
      <Container className="text-left">
        <Reveal>
          <div className="max-w-2xl">
            <Eyebrow gold>For Westmont students</Eyebrow>
            <SectionTitle dark>
              Your first real role could start this semester
            </SectionTitle>
            <p className="mt-4 leading-relaxed text-white/60">
              Tell us you’re interested and we’ll take it from there. No résumé
              polish required — we care about judgment and follow-through.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {/* [Link to real Westmont application flow when available] */}
              <a href="mailto:catlab@westmont.edu?subject=CATLab%20interest">
                <ButtonGold>I’m interested</ButtonGold>
              </a>
              <Link to="/companies">
                <span className="inline-flex items-center gap-2 rounded-md border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:border-white/50 hover:bg-white/5">
                  I’m a company →
                </span>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export function Home() {
  return (
    <>
      <Hero />
      <Outcomes />
      <Interns />
      <WhatIsCatlab />
      <PartnersSection />
      <BlogTeaser />
      <ApplyCta />
    </>
  )
}
