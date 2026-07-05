import { chromium } from 'playwright'
const OUT = process.argv[2] ?? '/tmp'
const browser = await chromium.launch({ channel: 'chrome' })
// mobile pass
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
await m.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await m.waitForTimeout(3000)
await m.screenshot({ path: `${OUT}/m-select.png` })
await m.evaluate(() => { localStorage.setItem('visited-garage','1'); localStorage.setItem('visited-tech','1') })
await m.reload({ waitUntil: 'networkidle' }); await m.waitForTimeout(2500)
await m.screenshot({ path: `${OUT}/m-select-unlocked.png` })
await m.close()
// desktop secret modal
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.evaluate(() => { localStorage.setItem('visited-garage','1'); localStorage.setItem('visited-tech','1') })
await page.reload({ waitUntil: 'networkidle' }); await page.waitForTimeout(2500)
await page.getByText('open the dream garage').click()
await page.waitForTimeout(1500)
await page.screenshot({ path: `${OUT}/d-dream.png` })
console.log('secret shots done')
await browser.close()
