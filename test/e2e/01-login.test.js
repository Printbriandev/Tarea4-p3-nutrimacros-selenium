const { expect } = require('chai');
const { buildDriver } = require('../support/driver');
const { resetState } = require('../support/resetState');
const { captureScreenshot } = require('../support/screenshot');
const { CREDENCIALES } = require('../support/config');
const { LoginPage } = require('../pages/LoginPage');

describe('HU-1 | Inicio de sesion', function () {
  let driver;
  let loginPage;

  before(async function () {
    await resetState('default');
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
  });

  beforeEach(async function () {
    await loginPage.open();
  });

  afterEach(async function () {
    await captureScreenshot(driver, this);
  });

  after(async function () {
    await driver.quit();
  });

  it('Camino feliz: con credenciales validas accede al listado de mediciones', async function () {
    await loginPage.login(CREDENCIALES.usuario, CREDENCIALES.password);

    const url = await driver.getCurrentUrl();
    expect(url).to.include('/measurements');
  });

  it('Prueba negativa: con contrasena incorrecta muestra error y no inicia sesion', async function () {
    await loginPage.login(CREDENCIALES.usuario, 'ClaveIncorrecta999');

    expect(await loginPage.getMensajeError()).to.equal('Usuario o contrasena incorrectos');
    expect(await driver.getCurrentUrl()).to.include('/login');
  });

  it('Prueba de limites: con contrasena vacia (0 caracteres) exige el campo y permanece en login', async function () {
    await loginPage.login(CREDENCIALES.usuario, '');

    expect(await loginPage.getMensajeError()).to.equal('La contrasena es requerida');
    expect(await driver.getCurrentUrl()).to.include('/login');
  });
});
