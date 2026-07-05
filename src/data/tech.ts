// ─────────────────────────────────────────────────────────────
//  THE COMMAND DECK — Samarth's story, in his words.
//  '' inside a lines[] array = stanza break.
// ─────────────────────────────────────────────────────────────

export const techHero = {
  title: 'Command Deck',
  subtitle: 'Director of Engineering · AI Solutions Architect',
  portrait: '/me/portrait.jpg',
  tickerSuffix: ['of building.', 'And still counting.'],
  scrollHint: 'Scroll. The story begins.',
}

// Live experience ticker. TODO(Samarth): set your true first day in tech.
export const CAREER_EPOCH = '2015-07-01T09:00:00+05:30'
export const BORN = '1995-02-17'

// ── THE STORY OPEN (two beats) ───────────────────────────────
export const storyMoment = {
  eyebrow: 'A story about your company',
  title: 'Every company reaches a moment where the old way stops being enough.',
  lines: [
    'The spreadsheets get heavier.',
    'The teams get busier.',
    'The systems get slower.',
    'The roadmap gets louder than the people building it.',
    '',
    'Then AI arrives.',
  ],
}

export const storyArrival = {
  lines: [
    'Not as a toy.',
    'Not as a demo.',
    'Not as another tool your team opens and forgets.',
    '',
    'AI arrives as a new operating system for the business.',
    '',
    'The question is no longer whether your company will use AI.',
    'The question is who will architect it.',
    '',
    'Who will make it safe enough for leadership, useful enough for teams,',
    'governed enough for security, and real enough to survive production?',
  ],
  closer: 'That is where I build.',
}

// ── THE CHAPTERS ─────────────────────────────────────────────
export type Chapter = {
  key: string
  chapter: string
  title: string
  lines: string[]
  pointsTitle: string
  points: string[]
  accent: string
}

export const chapters: Chapter[] = [
  {
    key: 'autonomous-coding',
    chapter: '01',
    title: 'Autonomous Coding',
    lines: [
      'The first shift is quiet.',
      '',
      'Your engineers are no longer the only ones typing.',
      'They become directors of intelligent systems.',
      '',
      'Agents write code.',
      'Agents review code.',
      'Agents generate tests.',
      'Agents refactor what no one had time to clean.',
      '',
      'But the best engineers still make the judgment calls.',
      '',
      'The future is not engineers versus AI.',
      'The future is senior engineers commanding fleets of agents.',
    ],
    pointsTitle: 'What changes',
    points: [
      'AI agent fleets that ship real production code',
      'Human approval where judgment matters',
      'Code review, test generation and refactoring on autopilot',
      'Senior engineers become force multipliers instead of bottlenecks',
    ],
    accent: '#059669',
  },
  {
    key: 'autonomous-sdlc',
    chapter: '02',
    title: 'The Autonomous SDLC',
    lines: [
      'Now zoom out.',
      '',
      'Most companies do not lose time in coding alone.',
      'They lose time between the moments.',
      '',
      'A requirement waits.',
      'A ticket waits.',
      'A review waits.',
      'A test waits.',
      'A release waits.',
      '',
      'The work does not move like a river.',
      'It moves like traffic.',
      '',
      'I build the pipeline where requirements become tickets, tickets become',
      'tested code, and releases move with rhythm.',
      '',
      'This is not faster chaos.',
      'This is governed speed.',
    ],
    pointsTitle: 'What changes',
    points: [
      'Requirements to code to test to deploy as one connected system',
      'AI assistance at every delivery gate',
      'Human sign off where risk and judgment matter',
      'Release cycles move from quarters to weeks, then from weeks to days',
      'Every AI decision logged, traceable and reviewable',
    ],
    accent: '#0284c7',
  },
  {
    key: 'process-automation',
    chapter: '03',
    title: 'Human Processes, Automated',
    lines: [
      'Outside engineering, there is another world of wasted human brilliance.',
      '',
      'People reading documents that systems should read.',
      'People routing workflows that systems should route.',
      'People answering the same support questions again and again.',
      'People doing robot work with human salaries.',
      '',
      'That is not efficiency.',
      'That is leakage.',
      '',
      'I build systems that give those hours back.',
      '',
      'The machine handles the repetition.',
      'The human handles the judgment.',
      '',
      'That is the right bargain.',
    ],
    pointsTitle: 'What changes',
    points: [
      'Documents that read themselves',
      'Workflows that route themselves',
      'Support that resolves the repeatable work',
      'RAG assistants over your institutional knowledge',
      'Hours returned to the business, measured and reported',
    ],
    accent: '#7c3aed',
  },
  {
    key: 'foundation',
    chapter: '04',
    title: 'On Foundations That Hold',
    lines: [
      'AI does not forgive weak foundations.',
      '',
      'A beautiful demo can hide bad architecture for a week.',
      'Production will expose it in a day.',
      '',
      'That is why the boring work matters.',
      '',
      'The cloud architecture.',
      'The identity model.',
      'The queues. The logs. The failure paths.',
      'The cost controls.',
      'The systems that do not wake people at 3 AM.',
      '',
      'Under every serious AI product is serious engineering.',
      '',
      'I build on foundations that hold.',
    ],
    pointsTitle: 'What changes',
    points: [
      'Azure architecture built for scale',
      '.NET and Angular or React product engineering',
      'AKS, Functions, Service Bus and cloud native services',
      'SLO driven operations and uptime discipline',
      'Cloud cost engineered down without weakening reliability',
    ],
    accent: '#2563eb',
  },
  {
    key: 'governance',
    chapter: '05',
    title: 'AI Your Board Can Trust',
    lines: [
      'Every enterprise AI story ends at the same door.',
      '',
      'Security. Compliance. Procurement. Legal.',
      'The skeptical director in the room.',
      '',
      'And they are right to ask questions.',
      '',
      'What happens when the model is wrong?',
      'Who approved this decision?',
      'Can we audit it? Can we explain it?',
      'Can we turn it off?',
      'Can we trust it with customers?',
      '',
      'I build AI that can answer those questions before launch.',
      '',
      'Not AI that sounds impressive.',
      'AI that survives review.',
    ],
    pointsTitle: 'What changes',
    points: [
      'Evaluation harnesses before go live',
      'Red teaming before production exposure',
      'Guardrails, fallbacks and human in the loop design',
      'Usage policy, audit trails and compliance reporting',
      'Responsible AI reviews built into delivery',
    ],
    accent: '#d97706',
  },
]

// ── THE CLIMB ────────────────────────────────────────────────
export const journey = {
  eyebrow: 'The climb',
  title: 'Five seats. One decade. All production.',
  line: 'Every title taught me something different.',
  steps: [
    {
      role: 'Software Engineer',
      lines: [
        'This is where the craft was forged.',
        'The discipline of building. The humility of debugging.',
        'The truth that systems do exactly what you built, not what you intended.',
      ],
    },
    {
      role: 'Senior Engineer',
      lines: [
        'This is where ownership became real.',
        'Not tasks. Not tickets.',
        'Systems. Reliability. Consequences.',
      ],
    },
    {
      role: 'Team Lead',
      lines: [
        'This is where I learned the first law of scale.',
        'One strong engineer can move work.',
        'A strong team can move a company.',
      ],
    },
    {
      role: 'Engineering Manager',
      lines: [
        'This is where delivery became a discipline.',
        'Planning, prioritization, releases, escalations, standards, people, pressure.',
        'The work became bigger than code.',
      ],
    },
    {
      role: 'Director of Engineering',
      lines: [
        'This is where architecture meets P&L.',
        'The question is no longer only, "Can we build it?"',
        'It becomes: "Should we build it, how fast can it compound, and what does it return to the business?"',
      ],
    },
  ],
}

// ── THE RECEIPTS ─────────────────────────────────────────────
export const receipts = {
  eyebrow: 'The receipts',
  title: 'Stories that already happened.',
  items: [
    {
      metric: '35%',
      headline: 'Cloud spend engineered down',
      lines: [
        'A benefits platform was bleeding on cloud costs.',
        'The answer was not panic. The answer was architecture.',
        'Reworked the foundation on AKS with autoscale, right sizing and operational discipline.',
      ],
      result: ['35% lower cloud bill.', 'Zero downtime during the move.'],
    },
    {
      metric: '8×',
      headline: 'Document operations accelerated',
      lines: [
        'A claims process was drowning a human team.',
        'The real problem was not people — people were doing machine work.',
        'Built a document intelligence pipeline where humans reviewed only the exceptions.',
      ],
      result: ['Throughput up 8×.', 'Error rate down.'],
    },
    {
      metric: '6→1',
      headline: 'Release cycle collapsed',
      lines: [
        'Six week release trains had become the rhythm of delay.',
        'Introduced an agent assisted SDLC with governed gates, better traceability and tighter feedback loops.',
      ],
      result: ['Six weeks became one.', 'Quality improved instead of slipping.'],
    },
  ],
}

// ── DIRECTOR'S CONSOLE ───────────────────────────────────────
export const console_ = {
  eyebrow: "Director's Console",
  title: 'The Business View',
  lines: [
    'Engineering is not a back office function.',
    '',
    'Engineering is margin.',
    'Engineering is speed.',
    'Engineering is revenue.',
    'Engineering is customer trust.',
    'Engineering is the difference between a company that talks strategy',
    'and a company that ships it.',
  ],
  metricsTitle: 'What leadership sees when my teams ship',
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
  title: 'Three ways to start.',
  lines: [
    'Not vague transformation.',
    'Not endless discovery.',
    'Not decks that age in a folder.',
    '',
    'Productized, focused, outcome priced.',
    'Pick the door that matches your moment.',
  ],
  items: [
    {
      num: '01',
      name: 'AI Strategy Sprint',
      duration: '2 weeks',
      audience: 'For leaders who know AI matters, but do not yet know where it pays.',
      desc: 'We look at your business, your workflows, your cost centers and your current systems. Then we separate noise from leverage. You leave with a map of where AI should enter your business, what to build, what to buy, what to avoid — and what your board can actually approve.',
      deliverable: 'Executive roadmap and architecture blueprint',
      accent: '#059669',
    },
    {
      num: '02',
      name: 'Autonomous SDLC Pilot',
      duration: '30–60 days',
      audience: 'For engineering leaders who want proof before scale.',
      desc: 'One team. One workflow. One governed delivery pipeline. Agent driven execution with human approval, traceability, and before/after velocity measurement. The goal is not to talk about 10× — it is to prove what changes when the system is built correctly.',
      deliverable: 'Live pipeline and before/after velocity report',
      accent: '#0284c7',
    },
    {
      num: '03',
      name: 'Production AI Build',
      duration: '30–90 days',
      audience: 'For companies ready to ship.',
      desc: 'A RAG assistant. A document pipeline. An agent workflow. A governed automation layer. Built on Azure, designed for production, delivered with runbooks, evaluation suites and operational guardrails. Not a prototype — a system your business can use.',
      deliverable: 'Deployed system, runbook and evaluation suite',
      accent: '#7c3aed',
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
  colA: [
    'Some people switch off by slowing down.',
    'I usually switch worlds.',
    '',
    'Travel. Machines. Roads.',
    'Garages. Setups. Momentum.',
    '',
    'I have always been drawn to things that move.',
  ],
  colB: [
    'A clean engine bay.',
    'A well built product.',
    'A road trip with no unnecessary noise.',
    'A system that responds exactly the way it should.',
    '',
    'The garage is not separate from the work.',
    'It is the same instinct.',
    '',
    'Precision. Control. Performance.',
    'Design. Discipline. Taste.',
    '',
    'Some systems run in the cloud.',
    'Some sit on four wheels.',
    'I like both.',
  ],
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
  lines: [
    'If you need someone who can speak architecture and P&L in the same sentence,',
    'the channel is open.',
    '',
    'Not just to advise. To build.',
    'Not just to imagine. To ship.',
  ],
}

// Tech journey page order:
// 0 hero · 1 moment · 2 arrival · 3–7 chapters · 8 climb · 9 receipts
// 10 console · 11 offerings · 12 off-duty · 13 contact
export const TECH_PAGES = 14
export const IRL_PAGE = 12
