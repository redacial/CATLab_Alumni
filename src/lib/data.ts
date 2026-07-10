// ============================================================
// CATLab seed data
// Real names/outcomes below come from the program pipeline.
// Anything in [brackets] is a PLACEHOLDER for David to replace
// before the Impact Conference demo — never fake specifics.
// ============================================================

export interface Outcome {
  name: string
  catlabYears: string
  path: string[] // journey steps, first is always CATLab role
  company: string
  role: string
  highlight?: string
  industry: string
}

export const outcomes: Outcome[] = [
  {
    name: 'Dante Poleselli',
    catlabYears: 'CATLab 2018–2020',
    path: ['CATLab', 'LA Angels'],
    company: 'Los Angeles Angels',
    role: 'Lead Baseball Systems Developer',
    highlight: 'Leads the systems that run a Major League front office',
    industry: 'Sports Technology',
  },
  {
    name: 'Ben Forster',
    catlabYears: 'CATLab 2020',
    path: ['CATLab', 'Apeel', 'Umbra'],
    company: 'Umbra',
    role: 'Senior Platform Engineer',
    highlight: 'Builds platform infrastructure for satellite imaging',
    industry: 'Aerospace',
  },
  {
    name: 'Kat Smith',
    catlabYears: 'CATLab 2023',
    path: ['CATLab', 'Procore'],
    company: 'Procore Technologies',
    role: 'Account Manager · ISR Team Lead',
    highlight: "2× President's Club",
    industry: 'Construction SaaS',
  },
  {
    name: 'Brycyn',
    catlabYears: 'CATLab intern', // [confirm years]
    path: ['CATLab', 'Webconnex'],
    company: 'Webconnex',
    role: 'Software Engineer',
    industry: 'Event & Payments SaaS',
  },
  {
    name: 'David',
    catlabYears: 'CATLab intern', // [confirm years]
    path: ['CATLab', 'Webconnex'],
    company: 'Webconnex',
    role: 'Engineer', // [confirm title]
    industry: 'Event & Payments SaaS',
  },
  {
    name: 'Eli',
    catlabYears: 'CATLab intern', // [confirm years]
    path: ['CATLab', 'Webconnex'],
    company: 'Webconnex',
    role: 'Engineer', // [confirm title]
    industry: 'Event & Payments SaaS',
  },
]

// ------------------------------------------------------------
// Current interns — ALL PLACEHOLDER. David: replace name, bio,
// project with real current students before the demo.
// ------------------------------------------------------------
export interface Intern {
  name: string
  bio: string
  project: string
}

export const interns: Intern[] = [
  {
    name: '[Intern Name]',
    bio: '[One-line bio — class year, major]',
    project:
      'Building an AI-powered donor pipeline tool for CATLab’s SDR team',
  },
  {
    name: '[Intern Name]',
    bio: '[One-line bio — class year, major]',
    project: '[One-line project description]',
  },
  {
    name: '[Intern Name]',
    bio: '[One-line bio — class year, major]',
    project: '[One-line project description]',
  },
  {
    name: '[Intern Name]',
    bio: '[One-line bio — class year, major]',
    project: '[One-line project description]',
  },
]

// ------------------------------------------------------------
// Partner companies hiring CATLab students (real list)
// Logos pulled from each partner's own site, in /public/logos
// ------------------------------------------------------------
export interface Partner {
  name: string
  url: string
  logo: string
}

export const partners: Partner[] = [
  {
    name: 'Webconnex',
    url: 'https://www.webconnex.com/',
    logo: '/logos/webconnex.png',
  },
  {
    name: 'Oilstop',
    url: 'https://www.oilstopinc.com/',
    logo: '/logos/oilstop.svg',
  },
  {
    name: 'Invoca',
    url: 'https://www.invoca.com/',
    logo: '/logos/invoca.svg',
  },
  {
    name: 'OffPrem Technology',
    url: 'https://offprem.tech/',
    logo: '/logos/offprem.png',
  },
  {
    name: 'Tondro Consulting',
    url: 'https://www.tondroconsulting.com/',
    logo: '/logos/tondro.webp',
  },
  {
    name: 'Westmont Ridley-Tree Museum of Art',
    url: 'https://www.westmont.edu/museum',
    logo: '/logos/ridley-tree.svg',
  },
]

// ------------------------------------------------------------
// Testimonials — PLACEHOLDER quotes with generic attribution.
// David: replace with real quotes + real names/companies.
// ------------------------------------------------------------
export interface Testimonial {
  quote: string
  attribution: string
  detail: string
}

export const testimonials: Testimonial[] = [
  {
    quote:
      '[Real partner quote goes here — ask Webconnex for two sentences on what hiring CATLab students has been like.]',
    attribution: '[Name]',
    detail: 'Partner Company · [Role]',
  },
  {
    quote:
      '[Real alumni quote goes here — ask Dante, Ben, or Kat for two sentences on what CATLab did for their career.]',
    attribution: '[Name]',
    detail: 'CATLab Alum · [Class Year]',
  },
  {
    quote:
      '[Third quote — a current partner or a recent placement works best.]',
    attribution: '[Name]',
    detail: '[Role, Company]',
  },
]

// ------------------------------------------------------------
// Alumni directory (logged in) — real outcomes + signals.
// Signal defaults are demo values; alumni set their own.
// ------------------------------------------------------------
export type Signal = 'mentoring' | 'hiring' | 'donating' | 'here'

export const signalLabels: Record<Signal, string> = {
  mentoring: 'Open to mentoring',
  hiring: 'Open to hiring',
  donating: 'Supporting the program',
  here: 'Here',
}

export interface Alum {
  id: string
  name: string
  gradYear: string
  industry: string
  company: string
  role: string
  signals: Signal[]
}

export const alumni: Alum[] = [
  {
    id: 'dante-poleselli',
    name: 'Dante Poleselli',
    gradYear: '2020',
    industry: 'Sports Technology',
    company: 'Los Angeles Angels',
    role: 'Lead Baseball Systems Developer',
    signals: ['mentoring'],
  },
  {
    id: 'ben-forster',
    name: 'Ben Forster',
    gradYear: '2020',
    industry: 'Aerospace',
    company: 'Umbra',
    role: 'Senior Platform Engineer',
    signals: ['mentoring', 'here'],
  },
  {
    id: 'kat-smith',
    name: 'Kat Smith',
    gradYear: '2023',
    industry: 'Construction SaaS',
    company: 'Procore Technologies',
    role: 'Account Manager · ISR Team Lead',
    signals: ['mentoring', 'hiring'],
  },
  {
    id: 'brycyn',
    name: 'Brycyn',
    gradYear: '—', // [confirm]
    industry: 'Event & Payments SaaS',
    company: 'Webconnex',
    role: 'Software Engineer',
    signals: ['here'],
  },
  {
    id: 'david-w',
    name: 'David',
    gradYear: '—', // [confirm]
    industry: 'Event & Payments SaaS',
    company: 'Webconnex',
    role: 'Engineer',
    signals: ['here'],
  },
  {
    id: 'eli',
    name: 'Eli',
    gradYear: '—', // [confirm]
    industry: 'Event & Payments SaaS',
    company: 'Webconnex',
    role: 'Engineer',
    signals: ['here'],
  },
]

// ------------------------------------------------------------
// Blog posts — authored program content (not fabricated facts)
// ------------------------------------------------------------
export interface Post {
  slug: string
  title: string
  date: string
  excerpt: string
  body: string[]
}

export const posts: Post[] = [
  {
    slug: 'welcome-to-the-catlab-network',
    title: 'The CATLab Network is live',
    date: 'July 2026',
    excerpt:
      'One place to see who CATLab alumni are, where they landed, and how to reach them — no phone tree required.',
    body: [
      'For years, the connection between CATLab alumni, current students, and partner companies ran through one channel: someone remembering to make a phone call. Alumni placed at real companies, students building real products, partners coming back for more talent — and none of it visible unless you happened to talk to the right person.',
      'This site changes that. Alumni get a directory and a way to signal what they’re open to — mentoring, hiring, or just being findable. Prospective students get the outcomes, not promises: real names, real companies, real roles. Partner companies get a clear picture of the pipeline before they ever pick up the phone.',
      'If you’re an alum, sign in and claim your profile. If you’re a student wondering whether this is real — scroll down. The names speak for themselves.',
    ],
  },
  {
    slug: 'why-entry-level-work-is-disappearing',
    title: 'Entry-level work is disappearing. Here’s our answer.',
    date: 'June 2026',
    excerpt:
      'The bottom rung of the career ladder is being automated away. CATLab is a different way onto the ladder.',
    body: [
      'The traditional first job — the one where you learn how work actually works — is getting harder to find. Companies want experience before they’ll give you the chance to get experience. It’s an old catch-22, and automation is making it worse.',
      'CATLab’s answer is simple: students work real professional roles while they’re still students, with weekly professional development layered on top. Not a simulation, not a case competition — actual work at actual companies, with the stakes low enough to try a lane and switch if it’s not the right one.',
      'The results are on this site. Alumni at the LA Angels, Umbra, Procore, Webconnex. That list didn’t come from a career fair.',
    ],
  },
  {
    slug: 'catlab-at-impact-conference',
    title: 'CATLab at Impact Conference 2026',
    date: 'July 2026',
    excerpt:
      'We’re bringing the network — and what it produces — to Impact Conference this month.',
    body: [
      'This July, CATLab is at Impact Conference showing what an applied technology program looks like when it takes outcomes seriously.',
      'If you’re at the conference and want to talk about hiring CATLab talent, partnering with the program, or bringing something like this to your institution — find us, or use the contact form on the companies page.',
    ],
  },
]

// ------------------------------------------------------------
// Donor recognition — PLACEHOLDER names. David: replace with
// real donor list (with permission) before demo.
// ------------------------------------------------------------
export interface Donor {
  name: string
  since: string
}

export const donors: Donor[] = [
  { name: '[Donor Name]', since: 'Member since 2024' },
  { name: '[Donor Name]', since: 'Member since 2024' },
  { name: '[Donor Name]', since: 'Member since 2025' },
  { name: '[Donor Name]', since: 'Member since 2025' },
  { name: '[Donor Name]', since: 'Member since 2026' },
  { name: '[Donor Name]', since: 'Member since 2026' },
]

// ------------------------------------------------------------
// Advice repository seeds — attributed generically until real
// entries are logged.
// ------------------------------------------------------------
export interface Advice {
  id: string
  text: string
  topic: string
  contributor: string
  date: string
}

export const adviceSeed: Advice[] = [
  {
    id: 'a1',
    text: 'When you reach out to an alum, lead with the specific thing you’re working on — not "can I pick your brain." Specific questions get answered same-day; vague ones sit for weeks.',
    topic: 'Networking',
    contributor: 'CATLab SDR team',
    date: 'June 2026',
  },
  {
    id: 'a2',
    text: 'Treat your CATLab project like a portfolio piece from day one: write down what you built, why, and what happened. Six months later that paragraph is your interview answer.',
    topic: 'Career',
    contributor: 'CATLab staff',
    date: 'May 2026',
  },
  {
    id: 'a3',
    text: '[Log real advice from alumni conversations here — advice text, topic, who said it, when.]',
    topic: 'Placeholder',
    contributor: '[Alum name]',
    date: '—',
  },
]

// ------------------------------------------------------------
// Tech talks — seeded empty; alumni sign up via the form
// ------------------------------------------------------------
export interface TalkOffer {
  id: string
  name: string
  topic: string
  window: string
  createdAt: string
}

// ------------------------------------------------------------
// Message board — seeded with one program post
// ------------------------------------------------------------
export interface BoardPost {
  id: string
  author: string
  text: string
  createdAt: string
}

export const boardSeed: BoardPost[] = [
  {
    id: 'b1',
    author: 'CATLab',
    text: 'Welcome to the CATLab Network board. Post here to reach alumni and current students — passing through Santa Barbara, hiring, or just saying hi.',
    createdAt: 'July 2026',
  },
]

// ------------------------------------------------------------
// Program facts used across pages (from the program itself)
// ------------------------------------------------------------
export const placementFacts = {
  cost: '$15K',
  hoursAtCompany: 35,
  hoursAtCatlab: 5,
  toStudent: '$11K',
  toOps: '$4K',
}
