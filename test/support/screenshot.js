const fs = require('fs');
const path = require('path');
const addContext = require('mochawesome/addContext');

const SCREENSHOTS_DIR = path.join(__dirname, '..', '..', 'screenshots');

function slugify(texto) {
  return texto
    .normalize('NFD')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
    .slice(0, 120);
}

async function captureScreenshot(driver, mochaCtx) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const test = mochaCtx.currentTest;
  const estado = test.state === 'failed' ? 'FALLO' : 'OK';
  const nombre = `${slugify(test.fullTitle())}__${estado}.png`;
  const rutaAbsoluta = path.join(SCREENSHOTS_DIR, nombre);

  fs.writeFileSync(rutaAbsoluta, await driver.takeScreenshot(), 'base64');

  addContext(mochaCtx, {
    title: `Captura de pantalla (${estado})`,
    value: `../../screenshots/${nombre}`,
  });
}

module.exports = { captureScreenshot, SCREENSHOTS_DIR };
