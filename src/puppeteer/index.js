// dbus-run-session -- bash -c 'DBUS_SYSTEM_BUS_ADDRESS="$DBUS_SESSION_BUS_ADDRESS" node --trace-warnings src/puppeteer/index.js'
// xvfb-run -a --server-args="-screen 0 1024x768x16 -ac -nolisten tcp -dpi 96 +extension RANDR"  node --trace-warnings src/puppeteer/index.js
// node --trace-warnings src/puppeteer/index.js
const puppeteer = require("puppeteer");

(async () => {
  // Don't disable the gpu
  var args = puppeteer.defaultArgs().filter(arg => arg !== '--disable-gpu');
  // Run in non-headless mode
  args = args.filter(arg => arg !== '--headless');
  // Use desktop graphics
  args.push("--use-gl=egl")
  args.push("--no-sandbox")

  console.log("======args======",args)
  // Lanch pupeteer with custom arguments
  const browser = await puppeteer.launch({
    userDataDir: './cache',
    headless: true,
    ignoreDefaultArgs: true,
    args
  });
  // let timer = null
  // const browser = await puppeteer.launch({
  //   // headless: false,
  //   userDataDir: './cache',
  //   args: [
  //     '--no-sandbox',
  //     // '--use-gl=swiftshader',
  //     // '--use-gl=egl',
  //     // '--use-gl=desktop',
  //     // '--enable-zero-copy',
  //     // ' --use-angle=default',
  //     // '--enable-webgl-image-chromium',
  //     '--disable-dev-shm-usage',
  //     '--disable-setuid-sandbox'
  //   ]
  // });

  // for (let i = 0; i < 1; i++) {
  //   goToPage(browser, i)
  // }


  getGpuInfo(browser)
  // timer = setTimeout(async () => {
  //   console.log("timeout====")
  //   await page.close()
  //   await browser.close();
  //   process.exit(0)
  // }, 120000);
})();



async function getGpuInfo(browser) {
  const page = await browser.newPage();
  await page.goto('chrome://gpu', {
    timeout: 60000
  });
  // other actions...
  await page.waitForTimeout(20000)
  console.log("========gpu信息采集结束。。。")
  await page.screenshot({ path: 'gpujinfo-puppeteer.png', fullPage: true });

  await page.close()

}