import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(2500)
const count = () => page.evaluate(() => ({
  canvases: document.querySelectorAll('canvas').length,
  divsWithCanvas: [...document.querySelectorAll('canvas')].map(c => c.parentElement?.className?.slice(0,40)),
}))
console.log('select:', JSON.stringify(await count()))
await page.keyboard.press('t'); await page.waitForTimeout(3500)
console.log('tech:  ', JSON.stringify(await count()))
await page.keyboard.press('Escape'); await page.waitForTimeout(1200)
console.log('back:  ', JSON.stringify(await count()))
await page.keyboard.press('g'); await page.waitForTimeout(3500)
console.log('garage:', JSON.stringify(await count()))
await browser.close()
