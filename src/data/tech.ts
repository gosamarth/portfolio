// ─────────────────────────────────────────────────────────────
//  THE COMMAND DECK — a story told while flying: what a founder
//  can BUILD with Samarth. Edit numbers/case studies freely.
// ─────────────────────────────────────────────────────────────

export const techHero = {
  title: 'Command Deck',
  subtitle: 'Director of Engineering · AI Solutions Architect',
  line: 'Scroll through a story — the one where your company ships like it has 10× the engineers.',
  portrait: '/me/portrait.jpg',
}

// ── THE STORY ────────────────────────────────────────────────
export type Chapter = {
  key: string
  chapter: string
  title: string
  narrative: string // the story beat, second person — about THEM
  points: string[]
  accent: string
}

export const storyOpen = {
  eyebrow: 'A story about your company',
  title: 'Every business is about to be rebuilt around AI.',
  line: 'The only question is who architects yours — and whether it ships as governed production systems or dies in demo purgatory. Here is what we can build together.',
}

export const chapters: Chapter[] = [
  {
    key: 'autonomous-coding',
    chapter: '01',
    title: 'Autonomous Coding',
    narrative:
      'Imagine your roadmap moving while your engineers sleep. Agent fleets that write, review, and test real production code — with your senior engineers directing instead of typing.',
    points: [
      'AI agent fleets shipping production-grade code',
      'Guardrailed autonomy — humans approve, agents execute',
      'Code review, test generation & refactoring on autopilot',
      'Your senior engineers become force multipliers',
    ],
    accent: '#34d399',
  },
  {
    key: 'autonomous-sdlc',
    chapter: '02',
    title: 'The Autonomous SDLC',
    narrative:
      'Now zoom out: requirements to deploy as one governed pipeline. Specs become tickets, tickets become tested code, releases go out weekly instead of quarterly — with an audit trail your CTO can defend.',
    points: [
      'End-to-end: requirements → code → test → deploy',
      'AI at every gate, human sign-off where it matters',
      'Release cycles: quarters → weeks → days',
      'Full traceability — every AI decision logged',
    ],
    accent: '#22d3ee',
  },
  {
    key: 'process-automation',
    chapter: '03',
    title: 'Human Processes, Automated',
    narrative:
      'Beyond engineering: the ops floor. Documents that read themselves, workflows that route themselves, support that resolves itself. Your people stop doing robot work — and do the judgment work only they can.',
    points: [
      'Document intelligence — claims, invoices, KYC, contracts',
      'Workflow copilots for ops, finance & support teams',
      'RAG assistants over your institutional knowledge',
      'Hours returned to the business, measured & reported',
    ],
    accent: '#a78bfa',
  },
  {
    key: 'foundation',
    chapter: '04',
    title: 'On Foundations That Hold',
    narrative:
      'None of this survives on shaky infrastructure. Under every AI system I ship is the boring excellence: Azure architected for scale, .NET platforms that don’t page you at 3 AM, cloud bills engineered down, uptime engineered up.',
    points: [
      'Azure end-to-end — AKS, Functions, Service Bus, Cosmos',
      'Full .NET + Angular/React product engineering',
      '99.95% uptime discipline · SLO-driven operations',
      'Cloud cost engineering — typical 30%+ reduction',
    ],
    accent: '#38bdf8',
  },
  {
    key: 'governance',
    chapter: '05',
    title: 'AI Your Board Can Trust',
    narrative:
      'The finale every enterprise story needs: governance. Evals before launch, guardrails in production, audit trails always. AI that passes security review, procurement, and the sniff test of your most skeptical director.',
    points: [
      'Evaluation harnesses & red-teaming before go-live',
      'Guardrails, fallbacks & human-in-the-loop design',
      'Usage policy, audit trails & compliance reporting',
      'Responsible-AI reviews baked into delivery',
    ],
    accent: '#fbbf24',
  },
]

// ── THE RECEIPTS ─────────────────────────────────────────────
// TODO(Samarth): tune these to your real engagements.
export const receipts = {
  eyebrow: 'The receipts',
  title: 'Stories that already happened',
  items: [
    {
      metric: '35%',
      headline: 'Cloud spend, engineered down',
      story: 'Benefits platform bleeding on cloud. Re-architected on AKS with autoscale + right-sizing. One quarter later: 35% lower bill, zero downtime during the move.',
    },
    {
      metric: '8×',
      headline: 'Document ops, accelerated',
      story: 'Claims processing drowning a human team. Document-intelligence pipeline with human review only on exceptions. Throughput up 8×, error rate down.',
    },
    {
      metric: '6→1',
      headline: 'Release cycle, collapsed',
      story: 'Six-week release trains. Introduced agent-assisted SDLC with governed gates. Six weeks became one — and quality metrics improved, not slipped.',
    },
  ],
}

// ── DIRECTOR'S CONSOLE ───────────────────────────────────────
export const console_ = {
  eyebrow: "Director's Console",
  title: 'The Business View',
  blurb: 'Engineering that answers to the P&L. What leadership sees when my teams ship.',
  metrics: [
    { label: 'Platform revenue owned', value: '$10M+', note: 'ARR flowing through systems I run' },
    { label: 'Ancillary revenue lines', value: '3', note: 'new monetization streams shipped' },
    { label: 'Infra cost reduction', value: '35%', note: 'cloud spend engineered down' },
    { label: 'Platform uptime', value: '99.95%', note: 'SLO held across product lines' },
    { label: 'Engineers led', value: '25+', note: 'across squads, senior leadership 4 yrs' },
    { label: 'Products shipped E2E', value: '6', note: 'concept to production ownership' },
  ],
}

// ── WORK WITH ME ─────────────────────────────────────────────
export const offerings = {
  eyebrow: 'Work with me',
  title: 'Three ways to start',
  blurb: 'Productized, time-boxed, outcome-priced. Pick the door that matches your moment.',
  items: [
    {
      name: 'AI Strategy Sprint',
      duration: '2 weeks',
      desc: 'Where AI actually pays in YOUR P&L. Opportunity map, build-vs-buy calls, a roadmap your board approves.',
      deliverable: 'Executive roadmap + architecture blueprint',
      accent: '#34d399',
    },
    {
      name: 'Autonomous SDLC Pilot',
      duration: '30–60 days',
      desc: 'One team, agent-driven delivery, governed gates. Prove the 10× before you scale it across the org.',
      deliverable: 'Live pipeline + before/after velocity report',
      accent: '#22d3ee',
    },
    {
      name: 'Production AI Build',
      duration: '30–90 days',
      desc: 'A RAG assistant, document pipeline, or agent workflow — shipped to production on Azure with governance included.',
      deliverable: 'Deployed system + runbook + eval suite',
      accent: '#a78bfa',
    },
  ],
}

export const reach = {
  email: 'samarthbuilds@gmail.com',
  phone: '+91 98999 29007',
  phoneHref: 'tel:+919899929007',
  whatsapp: 'https://wa.me/919899929007',
  meets: 'Delhi · available across India & USA',
}

export const irl = {
  eyebrow: 'Off Duty',
  title: 'The Human Behind the Handle',
  blurb: 'Travel, machines, and momentum. If the garage didn’t give it away — I like things that move.',
  photos: [
    { src: '/me/paris.jpg', caption: 'Paris' },
    { src: '/me/alps.jpg', caption: 'Swiss Alps' },
    { src: '/me/lucerne.jpg', caption: 'Lucerne' },
    { src: '/me/bigsur.jpg', caption: 'Big Sur' },
    { src: '/me/louvre.jpg', caption: 'Louvre' },
  ],
}

export const techContact = {
  eyebrow: 'Open Channel',
  title: 'Building something ambitious?',
  blurb: 'If you need someone who speaks architecture and P&L in the same sentence — the channel is open.',
}

// Tech journey page order:
// 0 hero · 1 story-open · 2-6 chapters · 7 receipts · 8 console · 9 offerings · 10 irl · 11 contact
export const TECH_PAGES = 12
export const IRL_PAGE = 10
