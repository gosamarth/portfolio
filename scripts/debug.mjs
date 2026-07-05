import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(6000)

const report = await page.evaluate(async () => {
  const els = [...document.querySelectorAll('div')]
  const scrollables = els.filter((el) => el.scrollHeight > el.clientHeight * 2)
  const info = scrollables.map((el) => ({
    cls: el.className?.slice?.(0, 60) || '(none)',
    id: el.id || '',
    sh: el.scrollHeight, ch: el.clientHeight, st: el.scrollTop,
    stylePos: getComputedStyle(el).position,
    overflow: getComputedStyle(el).overflowY,
  }))
  // set target: page 3 of 13 → offset 0.25
  const sc = scrollables.find((el) => getComputedStyle(el).overflowY !== 'hidden') || scrollables[0]
  sc.scrollTop = (3 / 12) * (sc.scrollHeight - sc.clientHeight)
  await new Promise((r) => setTimeout(r, 4500))
  const html = document.getElementById('journey-html')
  return {
    scrollables: info,
    chosen: { cls: sc.className?.slice?.(0,60), st: sc.scrollTop, sh: sc.scrollHeight, ch: sc.clientHeight },
    htmlTransform: html ? html.style.transform : 'none',
    innerH: window.innerHeight,
  }
})
console.log(JSON.stringify(report, null, 1))
await browser.close()
