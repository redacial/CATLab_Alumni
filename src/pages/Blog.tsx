import { Link } from 'react-router-dom'
import { posts } from '../lib/data'
import { Container, Eyebrow, Reveal, SectionTitle } from '../components/ui'

export function Blog() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <Eyebrow>From the lab</Eyebrow>
          <SectionTitle>CATLab Blog</SectionTitle>
          <p className="mt-4 max-w-xl text-warmgray">
            Program news, placements, and what students are building. This
            replaces the once-a-summer paper newsletter — for good.
          </p>
        </Reveal>
        <div className="mt-12 space-y-5">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.07}>
              <Link
                to={`/blog/${p.slug}`}
                className="group block rounded-xl border border-charcoal/8 bg-white p-7 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-burgundy-200 hover:shadow-md sm:p-8"
              >
                <p className="text-xs font-medium tracking-wide text-warmgray uppercase">
                  {p.date}
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold text-charcoal transition-colors group-hover:text-burgundy-600">
                  {p.title}
                </h2>
                <p className="mt-3 max-w-2xl leading-relaxed text-warmgray">
                  {p.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-600">
                  Read
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}
