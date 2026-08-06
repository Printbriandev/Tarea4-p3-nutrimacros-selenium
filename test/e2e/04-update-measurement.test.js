const { expect } = require('chai');
const { buildDriver } = require('../support/driver');
const { resetState } = require('../support/resetState');
const { captureScreenshot } = require('../support/screenshot');
const { CREDENCIALES, fechaISO } = require('../support/config');
const { LoginPage } = require('../pages/LoginPage');
const { MeasurementsListPage } = require('../pages/MeasurementsListPage');
const { MeasurementFormPage } = require('../pages/MeasurementFormPage');

describe('HU-4 | Actualizar medicion corporal', function () {
  let driver;
  let loginPage;
  let listPage;
  let formPage;

  before(async function () {
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
    listPage = new MeasurementsListPage(driver);
    formPage = new MeasurementFormPage(driver);
  });

  beforeEach(async function () {
    await resetState('default');
    await loginPage.open();
    await loginPage.login(CREDENCIALES.usuario, CREDENCIALES.password);
    await listPage.esperarCarga();
  });

  afterEach(async function () {
    await captureScreenshot(driver, this);
  });

  after(async function () {
    await driver.quit();
  });

  it('Camino feliz: actualiza el peso y el objetivo, y se refleja en el listado', async function () {
    await listPage.clickEditar(1);
    await formPage.llenarFormulario({ weightLb: 199, goal: 'subir' });
    await formPage.guardar();

    expect(await listPage.getFlashExito()).to.equal('Medicion actualizada exitosamente');
    expect(await listPage.getPesos()).to.include('199');
    expect(await listPage.getObjetivos()).to.include('subir');
  });

  it('Prueba negativa: rechaza un peso no numerico y conserva el valor original', async function () {
    await listPage.clickEditar(1);
    await formPage.llenarFormulario({ weightLb: 'abc' });
    await formPage.guardar();

    expect(await formPage.getErrorCampo('weightLb')).to.equal('El peso debe estar entre 50 y 700 lb');

    await listPage.open();
    expect(await listPage.getPesos()).to.include('195');
  });

  it('Prueba de limites: acepta la fecha de hoy y rechaza una fecha futura', async function () {
    await listPage.clickEditar(1);
    await formPage.llenarFormulario({ date: fechaISO(0) });
    await formPage.guardar();

    expect(await listPage.getFlashExito()).to.equal('Medicion actualizada exitosamente');
    expect(await listPage.getFechas()).to.include(fechaISO(0));

    await listPage.clickEditar(1);
    await formPage.llenarFormulario({ date: fechaISO(1) });
    await formPage.guardar();

    expect(await formPage.getErrorCampo('date')).to.equal('La fecha no puede ser futura');
  });
});
