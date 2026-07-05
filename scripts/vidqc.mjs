import { chromium } from 'playwright'
const src = process.argv[2]
const out = process.argv[3]
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } })
await page.setContent('<body style="margin:0;background:#000"><video id="v" style="width:100vw;height:100vh;object-fit:contain" muted></video></body>')
await page.evaluate(async (s) => {
  const v = document.getElementById('v')
  v.src = s
  await new Promise((r) => (v.onloadeddata = r))
  window.__v = v
}, src)
const dur = await page.evaluate(() => window.__v.duration)
console.log('duration:', dur.toFixed(2) + 's')
for (const f of [0.05, 0.3, 0.55, 0.8]) {
  await page.evaluate(async (t) => {
    const v = window.__v
    v.currentTime = t
    await new Promise((r) => (v.onseeked = r))
  }, dur * f)
  await page.screenshot({ path: `${out}/vqc-${Math.round(f * 100)}.png` })
}
await browser.close()
