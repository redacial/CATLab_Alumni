import { Link, useParams } from 'react-router-dom'
import { posts } from '../lib/data'
import { Container, Eyebrow } from '../components/ui'

export function BlogPost() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    return (
      <Container className="py-24 text-center">
        <p className="font-serif text-2xl font-bold text-charcoal">
          Post not found
        </p>
        <Link
          to="/blog"
          className="mt-4 inline-block text-sm font-semibold text-burgundy-600 hover:underline"
        >
          ← Back to the blog
        </Link>
      </Container>
    )
  }

  return (
    <article className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-burgundy-600 transition hover:gap-2.5"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 8H3M7 4L3 8l4 4" />
          </svg>
          All posts
        </Link>
        <Eyebrow>{post.date}</Eyebrow>
        <h1 className="font-serif text-3xl leading-tight font-bold tracking-tight text-charcoal text-balance sm:text-5xl">
          {post.title}
        </h1>
        <div className="mt-10 space-y-6">
          {post.body.map((para, i) => (
            <p key={i} className="text-lg leading-relaxed text-charcoal/85">
              {para}
            </p>
          ))}
        </div>
      </Container>
    </article>
  )
}
