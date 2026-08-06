const { expect } = require('chai');
const { buildDriver } = require('../support/driver');
const { resetState } = require('../support/resetState');
const { captureScreenshot } = require('../support/screenshot');
const { CREDENCIALES, BASE_URL } = require('../support/config');
const { LoginPage } = require('../pages/LoginPage');
const { MeasurementsListPage } = require('../pages/MeasurementsListPage');
const { NutritionPlanPage } = require('../pages/NutritionPlanPage');

describe('HU-3 | Consultar mediciones y plan nutricional', function () {
  let driver;
  let loginPage;
  let listPage;
  let nutritionPage;

  before(async function () {
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
    listPage = new MeasurementsListPage(driver);
    nutritionPage = new NutritionPlanPage(driver);
  });

  afterEach(async function () {
    await captureScreenshot(driver, this);
  });

  after(async function () {
    await driver.quit();
  });

  async function iniciarSesion() {
    await loginPage.open();
    await loginPage.login(CREDENCIALES.usuario, CREDENCIALES.password);
    await listPage.esperarCarga();
  }

  it('Camino feliz: lista las mediciones sembradas y calcula el plan dentro del presupuesto', async function () {
    await resetState('default');
    await iniciarSesion();

    expect(await listPage.contarFilas()).to.equal(3);

    await nutritionPage.open();
    await nutritionPage.calcular(2500);

    const macros = await nutritionPage.getMacros();
    expect(macros.kcal).to.be.greaterThan(0);
    expect(macros.proteinaG).to.be.greaterThan(0);
    expect(await nutritionPage.contarSugerencias()).to.be.greaterThan(0);
  });

  it('Prueba negativa: sin sesion iniciada redirige al login', async function () {
    await driver.manage().deleteAllCookies();
    await driver.get(`${BASE_URL}/measurements`);

    expect(await driver.getCurrentUrl()).to.include('/login');
  });

  it('Prueba de limites: con presupuesto minimo de RD$1 no sugiere alimentos pero no falla', async function () {
    await resetState('default');
    await iniciarSesion();

    await nutritionPage.open();
    await nutritionPage.calcular(1);

    expect(await nutritionPage.getMensajeSinSugerencias()).to.equal(
      'No se encontraron alimentos dentro de tu presupuesto'
    );
    expect(await nutritionPage.contarSugerencias()).to.equal(0);
  });
});
