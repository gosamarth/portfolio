import { chromium } from 'playwright'
const OUT = process.argv[2] ?? '/tmp'
const TECH_PAGES = 14
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(4000)
await page.screenshot({ path: `${OUT}/w-00-select.png` })
console.log('shot select')

// enter tech world
await page.keyboard.press('t')
await page.waitForTimeout(5000)
const scrollTo = async (p, total) => {
  await page.evaluate(([pageIdx, tot]) => {
    const sc = [...document.querySelectorAll('div')].find(
      (el) => getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight * 2)
    if (sc) sc.scrollTop = (pageIdx / (tot - 1)) * (sc.scrollHeight - sc.clientHeight)
  }, [p, total])
  await page.waitForTimeout(3200)
}
for (const p of [1, 2, 3, 8, 11, 12]) {
  await scrollTo(p, TECH_PAGES)
  await page.screenshot({ path: `${OUT}/w-tech-${p}.png` })
  console.log('shot tech', p)
}
// back to select, then garage sanity
await page.keyboard.press('Escape')
await page.waitForTimeout(800)
await page.keyboard.press('g')
await page.waitForTimeout(4500)
await page.screenshot({ path: `${OUT}/w-garage-hero.png` })
console.log('shot garage hero')
await browser.close()
