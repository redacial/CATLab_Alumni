import { useState } from 'react'
import { motion } from 'framer-motion'
import { placementFacts } from '../lib/data'
import { PartnersSection } from '../components/Partners'
import {
  ButtonPrimary,
  Container,
  Eyebrow,
  Input,
  Reveal,
  SectionTitle,
  Textarea,
} from '../components/ui'

function CompanyHero() {
  return (
    <section className="bg-burgundy-800">
      <Container className="py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.21, 0.65, 0.36, 1] }}
          className="max-w-3xl"
        >
          <Eyebrow gold>For companies</Eyebrow>
          <h1 className="font-serif text-4xl leading-[1.1] font-bold tracking-tight text-white text-balance sm:text-5xl lg:text-6xl">
            Vetted, AI-capable talent — without the hiring gamble
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
            CATLab doesn’t send you warm bodies for cheap entry-level work. It
            sends you students already doing professional work, screened by a
            program with its alumni at the LA Angels, Umbra, and Procore.
          </p>
          <div className="mt-9">
            <a href="#contact">
              <ButtonPrimary className="bg-gold-500 hover:bg-gold-600">
                Start a conversation
              </ButtonPrimary>
            </a>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}

function Deal() {
  const f = placementFacts
  const rows = [
    {
      n: f.cost,
      label: 'per placement',
      body: `${f.toStudent} goes to the student, ${f.toOps} to CATLab operations. One number, no surprises.`,
    },
    {
      n: `${f.hoursAtCompany}+${f.hoursAtCatlab}`,
      label: 'hours a week',
      body: `${f.hoursAtCompany} hours embedded on your team, ${f.hoursAtCatlab} in CATLab’s weekly professional development — so growth doesn’t come out of your management time.`,
    },
    {
      n: '0',
      label: 'HR overhead',
      body: 'Westmont handles employment logistics end to end. No payroll setup, no benefits administration, no compliance work on your side.',
    },
  ]
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <Eyebrow>The deal, plainly</Eyebrow>
          <SectionTitle>What a placement actually gets you</SectionTitle>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {rows.map((r, i) => (
            <Reveal key={r.label} delay={i * 0.1}>
              <div className="h-full rounded-xl border border-charcoal/8 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
                <p className="font-serif text-4xl font-bold text-gold-500">
                  {r.n}
                </p>
                <p className="eyebrow mt-1 text-warmgray">{r.label}</p>
                <p className="mt-4 text-sm leading-relaxed text-warmgray">
                  {r.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-2xl text-warmgray">
            The students you get have already shipped real work inside CATLab —
            and they arrive with the judgment to use AI tools well, not just
            the ability to prompt them.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

function ContactForm() {
  const [sent, setSent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement))
    // Routes to David/Zak — stored locally until a real backend exists
    const inbox = JSON.parse(localStorage.getItem('catlab:companyLeads') ?? '[]')
    localStorage.setItem('catlab:companyLeads', JSON.stringify([...inbox, data]))
    setSent(true)
  }

  return (
    <section id="contact" className="border-t border-charcoal/8 bg-burgundy-50/50 py-20 sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <Eyebrow>Contact</Eyebrow>
            <SectionTitle>Talk to the people who run it</SectionTitle>
            <p className="mt-4 max-w-md leading-relaxed text-warmgray">
              Your message goes straight to David and Zak — the team that
              matches students to companies. Expect a reply from a person, not
              a pipeline.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            {sent ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-charcoal/8 bg-white p-8 shadow-sm"
              >
                <p className="font-serif text-xl font-bold text-burgundy-600">
                  Got it — we’ll be in touch.
                </p>
                <p className="mt-2 text-sm text-warmgray">
                  David or Zak will reach out within a couple of business days.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={submit}
                className="space-y-4 rounded-xl border border-charcoal/8 bg-white p-8 shadow-sm"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input name="name" required placeholder="Your name" aria-label="Your name" />
                  <Input name="company" required placeholder="Company" aria-label="Company" />
                </div>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="Work email"
                  aria-label="Work email"
                />
                <Textarea
                  name="message"
                  rows={4}
                  placeholder="What kind of role are you thinking about?"
                  aria-label="Message"
                />
                <ButtonPrimary type="submit" className="w-full sm:w-auto">
                  Send to David & Zak
                </ButtonPrimary>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export function Companies() {
  return (
    <>
      <CompanyHero />
      <Deal />
      <PartnersSection
        eyebrow="Social proof"
        title="You wouldn’t be the first"
      />
      <ContactForm />
    </>
  )
}
