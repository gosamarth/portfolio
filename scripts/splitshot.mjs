import { chromium } from 'playwright'
const OUT = process.argv[2] ?? '/tmp'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(3000)
await page.screenshot({ path: `${OUT}/split-idle.png` })
await page.mouse.move(400, 500)   // hover garage half
await page.waitForTimeout(1800)
await page.screenshot({ path: `${OUT}/split-hover-garage.png` })
await page.mouse.move(1200, 500)  // hover deck half
await page.waitForTimeout(1800)
await page.screenshot({ path: `${OUT}/split-hover-deck.png` })
// mobile
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await m.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await m.waitForTimeout(2500)
await m.screenshot({ path: `${OUT}/split-mobile.png` })
console.log('done')
await browser.close()
