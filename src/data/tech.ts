// ─────────────────────────────────────────────────────────────
//  THE COMMAND DECK — Samarth's tech/leadership world.
//  EDIT the metrics below with your real numbers — they're
//  written as impressive-but-editable placeholders.
// ─────────────────────────────────────────────────────────────

export const techHero = {
  title: 'Command Deck',
  subtitle: 'Director of Engineering · Systems, Scale & Strategy',
  line: 'The engineering brain behind revenue-grade platforms — from architecture diagrams to board decks.',
  portrait: '/me/portrait.jpg',
}

export type Pillar = {
  key: string
  eyebrow: string
  title: string
  blurb: string
  points: string[]
  accent: string
}

export const pillars: Pillar[] = [
  {
    key: 'azure',
    eyebrow: 'Cloud Command',
    title: 'Azure, Weaponized',
    blurb:
      'Full command of the Microsoft cloud — architected, automated, and cost-tuned at production scale.',
    points: [
      'AKS · App Services · Functions · Service Bus',
      'Azure SQL · Cosmos DB · Blob · Redis',
      'Azure DevOps CI/CD · IaC · Key Vault',
      'App Insights observability · SLO-driven ops',
      'Cloud cost engineering — right-sizing at scale',
    ],
    accent: '#34d399',
  },
  {
    key: 'dotnet',
    eyebrow: 'App Builder',
    title: 'End-to-End on .NET',
    blurb:
      'Idea → architecture → API → UI → pipeline → production. Whole products shipped, not just services.',
    points: [
      '.NET / ASP.NET Core · C# · EF Core',
      'Angular + React front-ends · TypeScript',
      'REST & event-driven microservices',
      'SQL Server · payment gateways · auth/JWT',
      'This site: React + WebGL, built end-to-end',
    ],
    accent: '#38bdf8',
  },
  {
    key: 'ai',
    eyebrow: 'AI Division',
    title: 'AI, Shipped & Governed',
    blurb:
      'LLMs in production with guardrails — plus generative pipelines like the Higgsfield AI integration that rendered this site’s garage.',
    points: [
      'Azure OpenAI · LLM apps · RAG pipelines',
      'AI agents · Semantic Kernel · vector DBs',
      'AI governance: eval, guardrails, audit trails',
      'Responsible-AI reviews & usage policy',
      'Higgsfield MCP pipeline — AI art in this site',
    ],
    accent: '#c084fc',
  },
]

// The Director's Console — SLT-level numbers a CEO cares about.
// TODO(Samarth): replace with your real figures.
export const console_ = {
  eyebrow: "Director's Console",
  title: 'The Business View',
  blurb:
    'Engineering that answers to the P&L. What leadership sees when my teams ship.',
  metrics: [
    { label: 'Platform revenue owned', value: '$10M+', note: 'ARR flowing through systems I run' },
    { label: 'Ancillary revenue lines', value: '3', note: 'new monetization streams shipped' },
    { label: 'Infra cost reduction', value: '35%', note: 'cloud spend engineered down' },
    { label: 'Platform uptime', value: '99.95%', note: 'SLO held across product lines' },
    { label: 'Engineers led', value: '25+', note: 'across squads, senior leadership 4 yrs' },
    { label: 'Products shipped E2E', value: '6', note: 'concept to production ownership' },
  ],
}

export const irl = {
  eyebrow: 'Off Duty',
  title: 'The Human Behind the Handle',
  blurb:
    'Travel, machines, and momentum. If the garage didn’t give it away — I like things that move.',
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
  blurb:
    'Founders and leadership teams — if you need someone who speaks architecture and P&L in the same sentence, let’s talk.',
}

// Tech journey page order (used by TechSections + TechWorld):
// 0 hero · 1 azure · 2 dotnet · 3 ai · 4 console · 5 irl · 6 contact
export const TECH_PAGES = 7
