// ─────────────────────────────────────────────────────────────
//  EDIT THIS FILE to make the portfolio yours.
//  (Car data lives in ./cars.ts)
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: 'Samarth Saxena',
  role: 'Director of Engineering',
  // Short one-liner under the name on the hero.
  tagline:
    'Engineering leader by day, gearhead always. I build platforms that scale — and collect the machines that move me.',
  location: 'Delhi, India',
  email: 'you@example.com', // TODO: set the public contact email you want shown
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gosamarth' },
    // TODO: add GitHub / X if you want them shown
  ],
}

// The "About" section — skillset-forward, no company named.
export const about = {
  heading: 'About',
  body: [
    'I’m a Director of Engineering and have been part of senior leadership for the last 4 years — owning architecture, platform, and the teams that ship it.',
    'My home turf is the Microsoft stack, top to bottom: full .NET, Angular, and Azure at scale. On top of that I go deep on AI — LLMs, agents, and RAG woven into real products.',
    'This site is a bit of both sides of me: an over-engineered, scroll-driven 3D playground, with my garage rendered like a car-select screen.',
  ],
}

export type Project = {
  title: string
  blurb: string
  tags: string[]
  href?: string
}

export const projects: Project[] = [
  {
    title: 'This Portfolio',
    blurb:
      'A scroll-driven WebGL experience — react-three-fiber, custom shaders, an NFS-style 3D garage. Proof over claims.',
    tags: ['React', 'Three.js', 'TypeScript', 'WebGL'],
    href: '#',
  },
  {
    title: 'IMNoting',
    blurb:
      'Anonymous social-perception platform — .NET 9 API, EF Core, Azure SQL + Blob, Razorpay, Angular front-end.',
    tags: ['.NET 9', 'Azure', 'Angular', 'SQL Server'],
    href: '#',
  },
  // TODO: add more flagship work
]

export const skills = {
  heading: 'What I work with',
  groups: [
    {
      label: 'Microsoft Stack',
      items: ['.NET / .NET Core', 'ASP.NET Core', 'C#', 'Blazor', 'Angular', 'SQL Server', 'Entity Framework'],
    },
    {
      label: 'Azure & Cloud',
      items: ['Azure', 'AKS', 'App Services', 'Functions', 'Service Bus', 'Cosmos DB', 'Azure DevOps', 'Docker'],
    },
    {
      label: 'AI / ML',
      items: ['LLMs', 'Azure OpenAI', 'RAG', 'AI Agents', 'Semantic Kernel', 'Vector DBs', 'Prompt Engineering'],
    },
    {
      label: 'Languages',
      items: ['C#', 'TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'SQL', 'C++'],
    },
    {
      label: 'Frontend',
      items: ['Angular', 'React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'RxJS'],
    },
    {
      label: 'Leadership',
      items: ['Team Building', 'Architecture', 'Platform Strategy', 'Mentorship', 'Delivery at Scale'],
    },
  ],
}

export const contact = {
  heading: 'Let’s build something',
  body: 'Open to conversations on engineering leadership, architecture, and AI. LinkedIn is the fastest way to reach me.',
}

// Labels for the top-nav / progress rail, in journey order.
export const navSections = ['Home', 'About', 'Garage', 'Work', 'Skills', 'Contact']
