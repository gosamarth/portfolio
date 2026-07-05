// Screenshot the portfolio at several scroll depths.
import { chromium } from 'playwright'

const OUT = process.argv[2] ?? '/tmp'
const PAGES = 14 // keep in sync with src/journey.ts (3 + 8 cars + 3)

const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(6000) // let textures + loader settle

// drei ScrollControls creates an inner scroll container that owns the wheel.
// Scroll it directly by setting scrollTop on the fixed overlay element.
const stops = [
  ['00-hero', 0],
  ['01-about', 1],
  ['02-garage-intro', 2],
  ['03-car-vento', 3],
  ['04-car-bmw', 6],
  ['05-car-audi', 8],
  ['06-car-merc', 10],
  ['07-work', 11],
  ['08-skills', 12],
  ['09-contact', 13],
]

for (const [name, p] of stops) {
  await page.evaluate(
    ([pageIdx, total]) => {
      // drei's scroll container: the div with overflow, child of canvas parent
      const scroller = [...document.querySelectorAll('div')].find(
        (el) => getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight * 2,
      )
      if (scroller) scroller.scrollTop = (pageIdx / (total - 1)) * (scroller.scrollHeight - scroller.clientHeight)
    },
    [p, PAGES],
  )
  await page.waitForTimeout(3000)
  // re-assert target (damping can eat the first jump in headless)
  await page.waitForTimeout(1500) // camera damping + framer animations
  await page.screenshot({ path: `${OUT}/shot-${name}.png` })
  console.log(`shot ${name}`)
}

await browser.close()
