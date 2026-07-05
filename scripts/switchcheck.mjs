import { chromium } from 'playwright'
const OUT = process.argv[2] ?? '/tmp'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const errors = []
page.on('pageerror', (e) => errors.push(String(e).slice(0, 300)))
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
// enter TECH first
await page.keyboard.press('t')
await page.waitForTimeout(4500)
// scroll deep into tech
await page.mouse.move(800, 500)
for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(120) }
await page.waitForTimeout(1500)
// switch back and enter GARAGE
await page.keyboard.press('Escape')
await page.waitForTimeout(1000)
await page.keyboard.press('g')
await page.waitForTimeout(6000)
await page.screenshot({ path: `${OUT}/sw-garage-0.png` })
// scroll to car 1 (page 3 of 14)
await page.evaluate(() => {
  const sc = [...document.querySelectorAll('div')].find(
    (el) => getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight * 2)
  if (sc) sc.scrollTop = (3 / 13) * (sc.scrollHeight - sc.clientHeight)
})
await page.waitForTimeout(3500)
await page.screenshot({ path: `${OUT}/sw-garage-3.png` })
console.log('ERRORS:', JSON.stringify(errors.slice(0, 6)))
await browser.close()
