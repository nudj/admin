const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser'
    })
    const page = await browser.newPage()
    await page.goto('http://admin/')

    await page.screenshot({
      path: '/usr/src/output/example.png',
      fullPage: true
    })

    // Get the "viewport" of the page, as reported by the page.
    const dimensions = await page.evaluate(() => {
      return {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
        deviceScaleFactor: window.devicePixelRatio
      }
    })

    console.log('Dimensions:', dimensions)

    await browser.close()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
})()
