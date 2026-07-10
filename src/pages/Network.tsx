import { useMemo, useState } from 'react'
import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import { useAuth } from '../lib/auth'
import { useCollection, newId } from '../lib/store'
import {
  adviceSeed,
  alumni,
  boardSeed,
  donors,
  signalLabels,
  type Advice,
  type BoardPost,
  type Signal,
  type TalkOffer,
} from '../lib/data'
import {
  Avatar,
  ButtonGold,
  ButtonPrimary,
  Container,
  Eyebrow,
  Input,
  SectionTitle,
  Textarea,
} from '../components/ui'

// ---------------------------------------------------------------
// Gate
// ---------------------------------------------------------------
function Gate() {
  return (
    <Container className="flex min-h-[60vh] max-w-md flex-col items-center justify-center py-20 text-center">
      <p className="eyebrow text-burgundy-600">Members only</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-charcoal">
        The Network is for alumni & current students
      </h1>
      <p className="mt-4 text-warmgray">
        Sign in to browse the directory, post to the board, and give back.
      </p>
      <Link to="/signin" className="mt-8">
        <ButtonPrimary>Sign in</ButtonPrimary>
      </Link>
    </Container>
  )
}

// ---------------------------------------------------------------
// Directory
// ---------------------------------------------------------------
const signalStyles: Record<Signal, string> = {
  mentoring: 'bg-burgundy-50 text-burgundy-600',
  hiring: 'bg-gold-500/15 text-gold-600',
  donating: 'bg-burgundy-800/10 text-burgundy-800',
  here: 'bg-charcoal/8 text-charcoal',
}

function Directory() {
  const [q, setQ] = useState('')
  const [year, setYear] = useState('all')
  const [industry, setIndustry] = useState('all')

  const years = useMemo(
    () => [...new Set(alumni.map((a) => a.gradYear))].sort(),
    [],
  )
  const industries = useMemo(
    () => [...new Set(alumni.map((a) => a.industry))].sort(),
    [],
  )

  const filtered = alumni.filter((a) => {
    const text = `${a.name} ${a.company} ${a.role} ${a.industry}`.toLowerCase()
    return (
      (!q || text.includes(q.toLowerCase())) &&
      (year === 'all' || a.gradYear === year) &&
      (industry === 'all' || a.industry === industry)
    )
  })

  const selectCls =
    'rounded-md border border-charcoal/15 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-burgundy-400 focus:ring-2 focus:ring-burgundy-100 focus:outline-none transition'

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, company, role…"
          aria-label="Search directory"
          className="sm:max-w-xs"
        />
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className={selectCls}
          aria-label="Filter by grad year"
        >
          <option value="all">All years</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y === '—' ? 'Year TBD' : y}
            </option>
          ))}
        </select>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className={selectCls}
          aria-label="Filter by industry"
        >
          <option value="all">All industries</option>
          {industries.map((ind) => (
            <option key={ind} value={ind}>
              {ind}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((a, i) => (
          <motion.article
            key={a.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
            className="flex h-full flex-col rounded-xl border border-charcoal/8 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <Avatar name={a.name} />
              <div>
                <h3 className="font-serif text-lg font-bold text-charcoal">
                  {a.name}
                </h3>
                <p className="text-xs text-warmgray">
                  {a.gradYear === '—' ? 'CATLab alum' : `Class of ${a.gradYear}`}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-charcoal">{a.role}</p>
            <p className="text-sm text-warmgray">
              {a.company} · {a.industry}
            </p>
            {a.signals.length > 0 && (
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {a.signals.map((s) => (
                  <span
                    key={s}
                    className={clsx(
                      'rounded-full px-2.5 py-1 text-[0.7rem] font-semibold',
                      signalStyles[s],
                    )}
                  >
                    {signalLabels[s]}
                  </span>
                ))}
              </div>
            )}
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-warmgray">
          No matches — try clearing a filter.
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------
// Message board (posted messages, refresh-to-see — deliberately
// not real-time chat per scope decision)
// ---------------------------------------------------------------
function Board() {
  const { user } = useAuth()
  const { items, add } = useCollection<BoardPost>('board', boardSeed)
  const [text, setText] = useState('')

  const post = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    add({
      id: newId('b'),
      author: user.name,
      text: text.trim(),
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    })
    setText('')
  }

  return (
    <div className="max-w-2xl">
      <form
        onSubmit={post}
        className="rounded-xl border border-charcoal/8 bg-white p-5 shadow-sm"
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Post to the network — passing through SB, hiring, or just checking in…"
          aria-label="New board post"
        />
        <div className="mt-3 flex justify-end">
          <ButtonPrimary type="submit">Post</ButtonPrimary>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {items.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-charcoal/8 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <div className="flex items-center gap-3">
              <Avatar name={p.author} className="!h-9 !w-9 !text-sm" />
              <div>
                <p className="text-sm font-semibold text-charcoal">{p.author}</p>
                <p className="text-xs text-warmgray">{p.createdAt}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap text-charcoal/85">
              {p.text}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------
// Advice repository
// ---------------------------------------------------------------
function AdviceRepo() {
  const { user } = useAuth()
  const { items, add } = useCollection<Advice>('advice', adviceSeed)
  const [q, setQ] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [text, setText] = useState('')
  const [topic, setTopic] = useState('')

  const filtered = items.filter(
    (a) =>
      !q ||
      `${a.text} ${a.topic} ${a.contributor}`
        .toLowerCase()
        .includes(q.toLowerCase()),
  )

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    add({
      id: newId('a'),
      text: text.trim(),
      topic: topic.trim() || 'General',
      contributor: user.name,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    })
    setText('')
    setTopic('')
    setShowForm(false)
  }

  return (
    <div className="max-w-2xl">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search advice by topic, text, or who said it…"
          aria-label="Search advice"
        />
        <ButtonPrimary onClick={() => setShowForm((v) => !v)} className="shrink-0">
          {showForm ? 'Cancel' : 'Log advice'}
        </ButtonPrimary>
      </div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={submit}
          className="mt-5 space-y-3 overflow-hidden rounded-xl border border-charcoal/8 bg-white p-5 shadow-sm"
        >
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            required
            placeholder="The advice, as close to verbatim as you can get it"
            aria-label="Advice text"
          />
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Topic tag (e.g. Networking, Interviews, Career)"
            aria-label="Topic tag"
          />
          <ButtonPrimary type="submit">Save to the repository</ButtonPrimary>
        </motion.form>
      )}

      <div className="mt-8 space-y-4">
        {filtered.map((a) => (
          <article
            key={a.id}
            className="rounded-xl border border-charcoal/8 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
          >
            <span className="rounded-full bg-burgundy-50 px-2.5 py-1 text-[0.7rem] font-semibold text-burgundy-600">
              {a.topic}
            </span>
            <p className="mt-3 leading-relaxed text-charcoal/90">“{a.text}”</p>
            <p className="mt-3 text-xs text-warmgray">
              {a.contributor} · {a.date}
            </p>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="py-8 text-center text-warmgray">No advice matches that search.</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------
// Tech talk signup
// ---------------------------------------------------------------
function Talks() {
  const { user } = useAuth()
  const { items, add } = useCollection<TalkOffer>('talks', [])
  const [topic, setTopic] = useState('')
  const [win, setWin] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim() || !user) return
    add({
      id: newId('t'),
      name: user.name,
      topic: topic.trim(),
      window: win.trim() || 'Flexible',
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }),
    })
    setTopic('')
    setWin('')
  }

  return (
    <div className="max-w-2xl">
      <p className="max-w-lg text-warmgray">
        Passing through Santa Barbara? Offer a talk — instead of hoping someone
        remembers to ask you. CATLab staff will follow up to schedule.
      </p>
      <form
        onSubmit={submit}
        className="mt-6 space-y-3 rounded-xl border border-charcoal/8 bg-white p-5 shadow-sm"
      >
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          placeholder="What would you talk about?"
          aria-label="Talk topic"
        />
        <Input
          value={win}
          onChange={(e) => setWin(e.target.value)}
          placeholder="When are you around? (e.g. late August, fall break)"
          aria-label="Availability window"
        />
        <ButtonGold type="submit">Offer a talk</ButtonGold>
      </form>

      {items.length > 0 && (
        <div className="mt-8">
          <p className="eyebrow text-burgundy-600">Offered talks</p>
          <div className="mt-4 space-y-3">
            {items.map((t) => (
              <div
                key={t.id}
                className="flex items-start justify-between gap-4 rounded-lg border border-charcoal/8 bg-white p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-charcoal">{t.topic}</p>
                  <p className="text-xs text-warmgray">
                    {t.name} · {t.window}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gold-500/15 px-2.5 py-1 text-[0.7rem] font-semibold text-gold-600">
                  Pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------
// Donor recognition wall
// ---------------------------------------------------------------
function Donors() {
  return (
    <div>
      <p className="max-w-lg text-warmgray">
        These people keep CATLab running. Membership in this list means
        something — and it’s visible.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {donors.map((d, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-xl border border-gold-500/25 bg-gradient-to-br from-white to-gold-500/5 p-5"
          >
            <Avatar name={d.name} />
            <div>
              <p className="font-serif font-bold text-charcoal">{d.name}</p>
              <p className="text-xs text-gold-600">{d.since}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-6 text-xs text-warmgray/80">
        [Placeholder list — replace with real donors, with permission, before
        the demo.]
      </p>
    </div>
  )
}

// ---------------------------------------------------------------
// Give — two equal pathways
// ---------------------------------------------------------------
function Give() {
  return (
    <div className="grid max-w-4xl gap-5 md:grid-cols-2">
      <div className="flex flex-col rounded-xl border border-charcoal/8 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <p className="eyebrow text-burgundy-600">Give your time</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-charcoal">
          Mentor. Talk. Advise.
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-warmgray">
          An hour of your time is worth as much as a check. Set your signal in
          the directory, offer a tech talk, or log advice for the next student
          coming up behind you.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/network/talks">
            <ButtonPrimary>Offer a talk</ButtonPrimary>
          </Link>
          <Link to="/network/advice">
            <span className="inline-flex items-center rounded-md border border-burgundy-200 px-5 py-2.5 text-sm font-semibold text-burgundy-600 transition hover:border-burgundy-400 hover:bg-burgundy-50">
              Log advice
            </span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col rounded-xl border border-charcoal/8 bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <p className="eyebrow text-gold-600">Give financially</p>
        <h3 className="mt-2 font-serif text-2xl font-bold text-charcoal">
          Fund the next placement
        </h3>
        <p className="mt-3 flex-1 leading-relaxed text-warmgray">
          Gifts run through Westmont’s official giving flow and show up on the
          donor wall here — membership in this network is visible, not an
          anonymous transaction.
        </p>
        <div className="mt-6">
          <a
            href="https://www.westmont.edu/giving"
            target="_blank"
            rel="noreferrer"
          >
            <ButtonGold>Give via Westmont</ButtonGold>
          </a>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------
// Shell with tabs
// ---------------------------------------------------------------
const tabs = [
  { to: '/network', label: 'Directory', end: true },
  { to: '/network/board', label: 'Board' },
  { to: '/network/advice', label: 'Advice' },
  { to: '/network/talks', label: 'Tech talks' },
  { to: '/network/donors', label: 'Donors' },
  { to: '/network/give', label: 'Give' },
]

export function Network() {
  const { user } = useAuth()
  if (!user) return <Gate />

  return (
    <section className="bg-burgundy-50/40 py-12 sm:py-16">
      <Container>
        <Eyebrow>The CATLab Network</Eyebrow>
        <SectionTitle>Welcome back, {user.name.split(' ')[0]}</SectionTitle>

        <nav className="mt-8 flex gap-1 overflow-x-auto border-b border-charcoal/10 pb-px">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                clsx(
                  'whitespace-nowrap rounded-t-md px-4 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-b-2 border-burgundy-600 text-burgundy-600'
                    : 'text-warmgray hover:text-charcoal',
                )
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10">
          <Routes>
            <Route index element={<Directory />} />
            <Route path="board" element={<Board />} />
            <Route path="advice" element={<AdviceRepo />} />
            <Route path="talks" element={<Talks />} />
            <Route path="donors" element={<Donors />} />
            <Route path="give" element={<Give />} />
            <Route path="*" element={<Navigate to="/network" replace />} />
          </Routes>
        </div>
      </Container>
    </section>
  )
}
