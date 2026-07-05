import { chromium } from 'playwright'
const OUT = process.argv[2] ?? '/tmp'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
// click The Garage portal card like a real user
await page.getByText('The Garage', { exact: true }).click()
await page.waitForTimeout(6000)
await page.screenshot({ path: `${OUT}/click-garage-0.png` })
// scroll a couple pages with real wheel events
await page.mouse.move(800, 500)
for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 900); await page.waitForTimeout(160) }
await page.waitForTimeout(2600)
await page.screenshot({ path: `${OUT}/click-garage-scrolled.png` })
console.log('done')
await browser.close()
