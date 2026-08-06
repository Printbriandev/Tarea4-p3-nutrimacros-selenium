const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function buildDriver() {
  const options = new chrome.Options()
    .addArguments('--window-size=1400,1000')
    .addArguments('--disable-gpu')
    .addArguments('--no-sandbox')
    .excludeSwitches('enable-automation');

  if (process.env.HEADLESS === 'true') {
    options.addArguments('--headless=new');
  }

  return new Builder().forBrowser('chrome').setChromeOptions(options).build();
}

module.exports = { buildDriver };
