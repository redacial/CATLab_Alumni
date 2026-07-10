import { Link } from 'react-router-dom'
import { Container, Wordmark } from './ui'

export function Footer() {
  return (
    <footer className="bg-burgundy-800 text-white">
      <Container className="py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Wordmark dark />
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Westmont College’s applied technology program. Students work real
              professional roles with weekly professional development — and the
              outcomes speak for themselves.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="eyebrow mb-4 text-gold-400">Explore</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link className="transition hover:text-white" to="/">For students</Link></li>
                <li><Link className="transition hover:text-white" to="/companies">For companies</Link></li>
                <li><Link className="transition hover:text-white" to="/blog">Blog</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-gold-400">Network</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li><Link className="transition hover:text-white" to="/network">Alumni directory</Link></li>
                <li><Link className="transition hover:text-white" to="/network/give">Give back</Link></li>
                <li><Link className="transition hover:text-white" to="/signin">Sign in</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-gold-400">Westmont</p>
              <ul className="space-y-2.5 text-sm text-white/70">
                <li>
                  <a
                    className="transition hover:text-white"
                    href="https://www.westmont.edu"
                    target="_blank"
                    rel="noreferrer"
                  >
                    westmont.edu
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
          © {new Date().getFullYear()} Westmont College CATLab · Santa Barbara, CA
        </div>
      </Container>
    </footer>
  )
}
