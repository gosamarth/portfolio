import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForTimeout(5000)
const state = await page.evaluate(() => {
  const scroller = [...document.querySelectorAll('div')].find(
    (el) => getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight * 2)
  // what element sits on top at screen center?
  const top = document.elementFromPoint(800, 500)
  const loaderText = document.body.innerText.match(/STARTING ENGINE|IGNITION/i)?.[0] ?? null
  return {
    scrollerFound: !!scroller,
    scrollTop: scroller?.scrollTop,
    topElement: top ? top.className?.toString().slice(0, 80) || top.tagName : 'none',
    loaderVisible: loaderText,
  }
})
console.log(JSON.stringify(state, null, 1))
// try an actual wheel event
await page.mouse.move(800, 500)
await page.mouse.wheel(0, 2000)
await page.waitForTimeout(1200)
const after = await page.evaluate(() => {
  const scroller = [...document.querySelectorAll('div')].find(
    (el) => getComputedStyle(el).overflowY === 'auto' && el.scrollHeight > el.clientHeight * 2)
  return { scrollTopAfterWheel: scroller?.scrollTop }
})
console.log(JSON.stringify(after))
await browser.close()
