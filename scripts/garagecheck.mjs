import { chromium } from 'playwright'
const OUT = process.argv[2] ?? '/tmp'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)) })
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 300)))
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
await page.keyboard.press('g')
await page.waitForTimeout(6000)
await page.screenshot({ path: `${OUT}/g-check-0.png` })
const scrollTo = async (p) => {
  await page.evaluate(([pageIdx]) => {
    const sc = [...document.querySelectorAll('div')].find(
      (el) => getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight * 2)
    if (sc) sc.scrollTop = (pageIdx / 13) * (sc.scrollHeight - sc.clientHeight)
  }, [p])
  await page.waitForTimeout(3500)
}
await scrollTo(3)
await page.screenshot({ path: `${OUT}/g-check-3.png` })
await scrollTo(6)
await page.screenshot({ path: `${OUT}/g-check-6.png` })
console.log('ERRORS:', JSON.stringify(errors.slice(0, 10), null, 1))
await browser.close()
