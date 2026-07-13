// ─────────────────────────────────────────────────────────────
//  THE ARCADE: registry, best scores, share. No quarters needed.
// ─────────────────────────────────────────────────────────────

export type GameKey =
  | 'rush' | 'tunnel' | 'stack' | 'rev' | 'gp'
  | 'drag' | 'drift' | 'weave' | 'spot'
  | 'squash' | 'regex' | 'friday'

export type Wing = 'featured' | 'garage' | 'geek' | 'skill'

export type GameMeta = {
  key: GameKey
  icon: string
  name: string
  tagline: string
  controls: string
  scoreLabel: string
  /** lower is better (reaction times / ETs) */
  lowerBetter?: boolean
  /** the headline cabinet, rendered full-width */
  featured?: boolean
  wing: Wing
  accent: string
}

/** Samarth's house average on Lights Out GP. Beat the owner. */
export const HOUSE_REACTION_AVG = 238

export const GAMES: GameMeta[] = [
  {
    key: 'rush',
    icon: '◆',
    name: 'Ship Happens',
    tagline: "Play as Samarth. Everything a company throws at a shipping team, thrown at you. Outrun it and ship anyway.",
    controls: 'arrows · a/d · tap sides',
    scoreLabel: 'meters',
    featured: true,
    wing: 'featured',
    accent: '#c084fc',
  },
  {
    key: 'tunnel',
    icon: '☄',
    name: 'Tunnel Run',
    tagline: "Fly Samarth's warp tunnel and climb his career ladder, one promotion per gate run.",
    controls: 'mouse · touch · arrows · wasd',
    scoreLabel: 'meters',
    wing: 'skill',
    accent: '#6ee7ff',
  },
  {
    key: 'stack',
    icon: '▣',
    name: 'Slab Stack',
    tagline: "Stack Samarth's production stack: Azure on .NET on AKS. Drop nothing.",
    controls: 'tap / space to drop',
    scoreLabel: 'slabs',
    wing: 'skill',
    accent: '#34d399',
  },
  {
    key: 'rev',
    icon: '◉',
    name: 'Rev Match',
    tagline: "Shift through Samarth's real garage, from the 2011 Vento to the 2026 C300.",
    controls: 'tap / space to shift',
    scoreLabel: 'shifts',
    wing: 'garage',
    accent: '#f0abfc',
  },
  {
    key: 'gp',
    icon: '●',
    name: 'Lights Out GP',
    tagline: `Five race starts against the owner. Samarth's house average: ${HOUSE_REACTION_AVG}ms.`,
    controls: 'tap / space on lights out',
    scoreLabel: 'ms avg',
    lowerBetter: true,
    wing: 'skill',
    accent: '#fbbf24',
  },
  {
    key: 'drag',
    icon: '⟫',
    name: 'Redline Drag',
    tagline: "Pick one of Samarth's real machines, real specs included, and race his ghost down the quarter mile.",
    controls: 'hold to rev · tap to shift',
    scoreLabel: 'ms ET',
    lowerBetter: true,
    wing: 'garage',
    accent: '#f87171',
  },
  {
    key: 'drift',
    icon: '◠',
    name: 'Neon Drift',
    tagline: 'Sixty seconds, one glowing arena, infinite sideways. Paint the floor with angle.',
    controls: 'steer: arrows · a/d · hold sides',
    scoreLabel: 'drift pts',
    wing: 'garage',
    accent: '#22d3ee',
  },
  {
    key: 'weave',
    icon: '≋',
    name: 'Traffic Weave',
    tagline: "Samarth's C300 through midnight traffic. Near misses pay double; hesitation pays nothing.",
    controls: 'arrows · a/d · tap sides',
    scoreLabel: 'meters',
    wing: 'garage',
    accent: '#fb923c',
  },
  {
    key: 'squash',
    icon: '⌦',
    name: 'Bug Squash',
    tagline: 'Thirty seconds, one prod cluster, bugs multiplying. Do not squash the thing that is actually a feature.',
    controls: 'tap the bugs',
    scoreLabel: 'squashed',
    wing: 'geek',
    accent: '#4ade80',
  },
  {
    key: 'regex',
    icon: '.*',
    name: 'Regex Ranger',
    tagline: 'Eight patterns, four candidates each. Only one string matches. The logs are watching.',
    controls: 'tap the matching string',
    scoreLabel: '/ 8',
    wing: 'geek',
    accent: '#38bdf8',
  },
  {
    key: 'friday',
    icon: '⏏',
    name: 'Deploy Friday',
    tagline: "4:53pm on a Friday. Every deploy pays more than the last. Every deploy is more likely to page you at dinner.",
    controls: 'deploy · or log off',
    scoreLabel: 'banked',
    wing: 'geek',
    accent: '#fb7185',
  },
  {
    key: 'spot',
    icon: '◫',
    name: 'Spot the Machine',
    tagline: "A grille slat. An alloy spoke. Eight crops of Samarth's garage; name them all.",
    controls: 'tap the right machine',
    scoreLabel: '/ 8',
    wing: 'garage',
    accent: '#a3e635',
  },
]

export function bestScore(key: GameKey): number | null {
  try {
    const v = localStorage.getItem(`arcade.best.${key}`)
    return v ? Number(v) : null
  } catch {
    return null
  }
}

export function saveBest(key: GameKey, score: number, lowerBetter = false): boolean {
  const cur = bestScore(key)
  const better = cur == null || (lowerBetter ? score < cur : score > cur)
  if (better) {
    try {
      localStorage.setItem(`arcade.best.${key}`, String(score))
    } catch {
      /* ignore */
    }
  }
  return better
}

export async function shareScore(text: string): Promise<'shared' | 'copied' | 'failed'> {
  const url = 'https://gosamarth.com'
  try {
    if (navigator.share) {
      await navigator.share({ title: 'The Arcade @ gosamarth.com', text, url })
      return 'shared'
    }
  } catch {
    /* fall through */
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`)
    return 'copied'
  } catch {
    return 'failed'
  }
}

/** Format a stored best score for the cabinet card. */
export function formatBest(meta: GameMeta, v: number): string {
  if (meta.key === 'drag') return `${(v / 1000).toFixed(2)}s`
  return `${v} ${meta.scoreLabel}`
}
