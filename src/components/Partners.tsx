import { testimonials, partners, type Testimonial } from '../lib/data'
import { Container, Eyebrow, Reveal, SectionTitle } from './ui'

// Real partner logos, linked to each company's site. Rendered
// white via CSS filter for a uniform strip on the dark section.
function LogoStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 sm:gap-x-16">
      {partners.map((p) => (
        <a
          key={p.name}
          href={p.url}
          target="_blank"
          rel="noreferrer"
          aria-label={p.name}
          title={p.name}
          className="opacity-60 transition-all duration-200 hover:scale-105 hover:opacity-100"
        >
          <img
            src={p.logo}
            alt={`${p.name} logo`}
            className="h-9 w-auto max-w-40 object-contain brightness-0 invert"
          />
        </a>
      ))}
    </div>
  )
}

function Stars() {
  return (
    <div className="flex gap-1" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          className="h-4 w-4 fill-gold-400"
          aria-hidden="true"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9z" />
        </svg>
      ))}
    </div>
  )
}

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex w-[22rem] shrink-0 flex-col rounded-xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm sm:w-[26rem]">
      <Stars />
      <blockquote className="mt-4 flex-1 font-serif text-base leading-relaxed text-white/90">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="font-semibold text-gold-400">{t.attribution}</span>
        <span className="text-white/50"> · {t.detail}</span>
      </figcaption>
    </figure>
  )
}

// Nonstop marquee: the track holds the review list twice and
// translates -50%, so the loop is seamless. Pauses on hover.
function ReviewMarquee() {
  // repeat the base list so half the track always overfills the
  // viewport, then double it for the seamless -50% loop
  const base = [...testimonials, ...testimonials, ...testimonials]
  const loop = [...base, ...base]
  return (
    <div
      className="group relative overflow-hidden"
      style={{
        maskImage:
          'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
      }}
    >
      <div className="marquee-track flex w-max gap-5 group-hover:[animation-play-state:paused]">
        {loop.map((t, i) => (
          <ReviewCard key={i} t={t} />
        ))}
      </div>
    </div>
  )
}

export function PartnersSection({
  eyebrow = 'Partners',
  title = 'Companies already hiring CATLab talent',
}: {
  eyebrow?: string
  title?: string
}) {
  return (
    <section className="overflow-hidden bg-burgundy-800 py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="text-center">
            <Eyebrow gold>{eyebrow}</Eyebrow>
            <SectionTitle dark className="mx-auto max-w-2xl">
              {title}
            </SectionTitle>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-12">
            <LogoStrip />
          </div>
        </Reveal>
      </Container>
      <Reveal delay={0.2}>
        <div className="mt-14">
          <ReviewMarquee />
        </div>
      </Reveal>
    </section>
  )
}
