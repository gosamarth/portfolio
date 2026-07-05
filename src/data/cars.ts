// ─────────────────────────────────────────────────────────────
//  THE GARAGE — Samarth's cars, oldest → newest.
//  Specs are India-market, fetched from public sources.
//  Drop the matching render at /public/cars/<slug>.jpg
//  (optional 360° turntable loop at /public/cars/<slug>.mp4).
// ─────────────────────────────────────────────────────────────

export type CarStatus = 'owned' | 'sold'

export type Car = {
  slug: string
  order: number
  name: string        // short display name
  fullName: string    // full year/make/model/trim
  year: number
  make: string
  model: string
  trim: string
  color: string       // exact factory color name
  colorHex: string    // UI accent
  status: CarStatus
  hero: boolean       // featured big / turntable video
  bodyType: string
  powertrain: string
  power: string
  torque: string
  drivetrain: string
  zeroToHundred?: string
  topSpeed?: string
  range?: string      // EV only
  story: string
  fact: string
  image: string       // /cars/<slug>.jpg
  video?: string      // /cars/<slug>.mp4 (optional loop)
}

export const cars: Car[] = [
  {
    slug: '2011-vw-vento-ipl',
    order: 1,
    name: 'VW Vento IPL Edition',
    fullName: '2011 Volkswagen Vento IPL Edition 1.6 MPI',
    year: 2011,
    make: 'Volkswagen',
    model: 'Vento',
    trim: 'IPL Edition (Comfortline)',
    color: 'Candy White',
    colorHex: '#e9e9ea',
    status: 'owned',
    hero: false,
    bodyType: 'Sedan',
    powertrain: '1.6L MPI naturally-aspirated petrol',
    power: '105 PS @ 5250 rpm',
    torque: '153 Nm @ 3800 rpm',
    drivetrain: '5-speed manual · FWD',
    zeroToHundred: undefined,
    topSpeed: undefined,
    story: 'Where it all began — a cricket-season special edition and my first set of keys.',
    fact: 'A limited IPL-branded edition: badged sills, leatherette seats, touchscreen nav, and a cricket kit gifted to every buyer.',
    image: '/cars/2011-vw-vento-ipl.jpg',
  },
  {
    slug: '2017-hyundai-verna-sxo',
    order: 2,
    name: 'Hyundai Verna SX(O)',
    fullName: '2017 Hyundai Verna SX(O) 1.6 VTVT',
    year: 2017,
    make: 'Hyundai',
    model: 'Verna',
    trim: 'SX(O)',
    color: 'Phantom Black',
    colorHex: '#101012',
    status: 'sold',
    hero: false,
    bodyType: 'Sedan',
    powertrain: '1.6L VTVT petrol',
    power: '123 PS @ 6400 rpm',
    torque: '151 Nm @ 4850 rpm',
    drivetrain: '6-speed auto · FWD',
    zeroToHundred: '~11.0 s',
    topSpeed: undefined,
    story: 'Fully-loaded and fluidic — the sedan that made features feel premium.',
    fact: 'The all-new 5th-gen Verna was a segment benchmark — among the first here with a ventilated driver seat and wireless charging.',
    image: '/cars/2017-hyundai-verna-sxo.jpg',
  },
  {
    slug: '2020-honda-civic-zx',
    order: 3,
    name: 'Honda Civic ZX',
    fullName: '2020 Honda Civic ZX 1.8 i-VTEC',
    year: 2020,
    make: 'Honda',
    model: 'Civic',
    trim: 'ZX',
    color: 'Platinum White Pearl',
    colorHex: '#f0f0f2',
    status: 'sold',
    hero: false,
    bodyType: 'Sedan',
    powertrain: '1.8L i-VTEC petrol',
    power: '141 PS @ 6500 rpm',
    torque: '174 Nm @ 4300 rpm',
    drivetrain: '7-step CVT · FWD',
    zeroToHundred: '11.5 s',
    topSpeed: undefined,
    story: 'The tenth-gen icon, back in India — low, wide, and unmistakable.',
    fact: 'Marked Honda’s return to the D-segment after a five-year gap, with that dramatic coupe-like silhouette.',
    image: '/cars/2020-honda-civic-zx.jpg',
  },
  {
    slug: '2017-bmw-520d',
    order: 4,
    name: 'BMW 520d',
    fullName: '2017 BMW 520d (F10) Luxury Line',
    year: 2017,
    make: 'BMW',
    model: '5 Series',
    trim: '520d Luxury Line',
    color: 'Alpine White',
    colorHex: '#eef0f2',
    status: 'owned',
    hero: true,
    bodyType: 'Executive sedan',
    powertrain: '2.0L TwinPower Turbo diesel (B47)',
    power: '190 PS @ 4000 rpm',
    torque: '400 Nm @ 1750–2500 rpm',
    drivetrain: '8-speed Steptronic · RWD',
    zeroToHundred: '~7.7 s',
    topSpeed: '~227 km/h',
    story: 'The executive express — effortless torque, rear-wheel drive, still in the garage.',
    fact: '400 Nm from a 2.0 diesel and an 8-speed Steptronic make it deceptively quick for its size.',
    image: '/cars/2017-bmw-520d.jpg',
    video: '/cars/2017-bmw-520d.mp4',
  },
  {
    slug: '2022-jeep-compass-model-s',
    order: 5,
    name: 'Jeep Compass Model S',
    fullName: '2022 Jeep Compass Model S 2.0 Diesel 4x4 AT',
    year: 2022,
    make: 'Jeep',
    model: 'Compass',
    trim: 'Model S (4x4)',
    color: 'Brilliant Black',
    colorHex: '#0d0d10',
    status: 'sold',
    hero: false,
    bodyType: 'Compact SUV',
    powertrain: '2.0L Multijet-II turbo diesel',
    power: '170 PS @ 3750 rpm',
    torque: '350 Nm @ 1750–2500 rpm',
    drivetrain: '9-speed auto · 4x4 (Active Drive)',
    zeroToHundred: '~10.0 s',
    topSpeed: '~194 km/h',
    story: '2.0 diesel, full 4x4 — trail-rated luxury that could actually go off-road.',
    fact: 'The flagship Model S diesel is the only way to pair the top trim with real all-wheel-drive Selec-Terrain.',
    image: '/cars/2022-jeep-compass-model-s.jpg',
  },
  {
    slug: '2024-audi-a4',
    order: 6,
    name: 'Audi A4 Technology',
    fullName: '2024 Audi A4 Technology 40 TFSI',
    year: 2024,
    make: 'Audi',
    model: 'A4',
    trim: 'Technology 40 TFSI',
    color: 'Navarra Blue Metallic',
    colorHex: '#27364b',
    status: 'owned',
    hero: true,
    bodyType: 'Sedan',
    powertrain: '2.0L TFSI petrol + 12V mild-hybrid',
    power: '204 PS',
    torque: '320 Nm',
    drivetrain: '7-speed S tronic · FWD',
    zeroToHundred: '7.1 s',
    topSpeed: '241 km/h',
    story: 'Navarra Blue and Bang & Olufsen — understated, fast, refined.',
    fact: 'The Technology trim tops the range with a 19-speaker, 755W B&O 3D sound system.',
    image: '/cars/2024-audi-a4.jpg',
    video: '/cars/2024-audi-a4.mp4',
  },
  {
    slug: '2025-mahindra-xev-9e',
    order: 7,
    name: 'Mahindra XEV 9e',
    fullName: '2025 Mahindra XEV 9e Pack Three (79 kWh)',
    year: 2025,
    make: 'Mahindra',
    model: 'XEV 9e',
    trim: 'Pack Three',
    color: 'Stealth Black',
    colorHex: '#14151a',
    status: 'owned',
    hero: true,
    bodyType: 'Electric coupe-SUV',
    powertrain: 'Rear PMS motor · 79 kWh battery',
    power: '210 kW (286 PS)',
    torque: '380 Nm',
    drivetrain: 'Single-speed · RWD',
    zeroToHundred: '6.8 s',
    topSpeed: '202 km/h',
    range: '656 km (MIDC)',
    story: 'Born-electric coupe-SUV — 656 km of range and 6.8s to 100.',
    fact: 'Built on Mahindra’s INGLO platform with a triple-screen dashboard spanning the full cabin width.',
    image: '/cars/2025-mahindra-xev-9e.jpg',
    video: '/cars/2025-mahindra-xev-9e.mp4',
  },
  {
    slug: '2026-mercedes-c300',
    order: 8,
    name: 'Mercedes-Benz C 300 AMG Line',
    fullName: '2026 Mercedes-Benz C 300 AMG Line (W206)',
    year: 2026,
    make: 'Mercedes-Benz',
    model: 'C-Class',
    trim: 'C 300 AMG Line',
    color: 'Obsidian Black',
    colorHex: '#0b0c10',
    status: 'owned',
    hero: true,
    bodyType: 'Sedan',
    powertrain: '2.0L M254 turbo petrol + 48V EQ Boost',
    power: '258 hp (+20 hp boost)',
    torque: '400 Nm',
    drivetrain: '9G-Tronic · RWD',
    zeroToHundred: '~6.0 s',
    topSpeed: '250 km/h',
    story: 'The newest arrival — 258 hp, AMG Line, Obsidian Black. The current daily flex.',
    fact: 'Every W206 C-Class is electrified: a 48V starter-generator adds EQ Boost torque-fill and engine-off coasting.',
    image: '/cars/2026-mercedes-c300.jpg',
    video: '/cars/2026-mercedes-c300.mp4',
  },
]

// Newest first — the current flex leads, the origin story closes the garage.
cars.sort((a, b) => b.year - a.year)
cars.forEach((c, i) => (c.order = i + 1))

export const ownedCars = cars.filter((c) => c.status === 'owned')
export const soldCars = cars.filter((c) => c.status === 'sold')
