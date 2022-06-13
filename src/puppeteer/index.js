// dbus-run-session -- bash -c 'DBUS_SYSTEM_BUS_ADDRESS="$DBUS_SESSION_BUS_ADDRESS" node --trace-warnings src/puppeteer/index.js'
// xvfb-run -a --server-args="-screen 0 1024x768x16 -ac -nolisten tcp -dpi 96 +extension RANDR"  node --trace-warnings src/puppeteer/index.js
// node --trace-warnings src/puppeteer/index.js
const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    userDataDir: './cache',
    args: [
      '--no-sandbox',
      '--use-gl=egl',
      '--disable-dev-shm-usage',
      '--disable-setuid-sandbox'
    ]
  });

  for (let i = 0; i < 1; i++) {
    goToPage(browser, i)
  }


  getGpuInfo(browser)
})();

async function goToPage(browser, num) {
  const page = await browser.newPage();
  page.setViewport({
    width: 375,
    height: 667,
  });
  console.log(num + "正在录制webgl。。。")
  page.on("console", async (msg) => {
    if (msg.text().indexOf('{"code":0,"message":"ok"}') >= 0) {
      console.log(num + ":::puppeteer get log:::", msg.text())
    } else {
      console.log(num + "====puppeteer other log====", msg.text())
    }
  });
  page.on("pageerror", async (err) => {
    console.log(num + "====!!!error!!!====", err)
  });
  await page.goto("https://testgame.kg.qq.com/tmegames/milupuppeteer/output/record-testgame/index.html?filename=myvideo-puppeteer-" + num, {
    timeout: 120000
  });

  await page.evaluate(() => {
    console.log('----uauauaua-----', navigator.userAgent)
  })
  await page.waitForTimeout(5000)
  await page.screenshot({ path: num + 'fps-puppeteer.png', fullPage: true });
  console.log(num + "结束录制webgl。。。")
}


async function getGpuInfo(browser) {
  const page = await browser.newPage();
  await page.goto('chrome://gpu', {
    timeout: 60000
  });
  await page.waitForTimeout(20000)
  console.log("========gpu信息采集结束。。。")
  await page.screenshot({ path: 'gpujinfo-puppeteer.png', fullPage: true });

  await page.close()

}