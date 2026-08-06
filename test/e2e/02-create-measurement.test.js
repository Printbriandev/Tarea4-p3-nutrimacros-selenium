const { expect } = require('chai');
const { buildDriver } = require('../support/driver');
const { resetState } = require('../support/resetState');
const { captureScreenshot } = require('../support/screenshot');
const { CREDENCIALES, fechaISO } = require('../support/config');
const { LoginPage } = require('../pages/LoginPage');
const { MeasurementsListPage } = require('../pages/MeasurementsListPage');
const { MeasurementFormPage } = require('../pages/MeasurementFormPage');

describe('HU-2 | Registrar medicion corporal', function () {
  let driver;
  let listPage;
  let formPage;

  before(async function () {
    await resetState('default');
    driver = await buildDriver();
    listPage = new MeasurementsListPage(driver);
    formPage = new MeasurementFormPage(driver);

    const loginPage = new LoginPage(driver);
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

  it('Camino feliz: registra una medicion valida y aparece en el listado', async function () {
    await listPage.open();
    const filasAntes = await listPage.contarFilas();

    await listPage.clickNuevaMedicion();
    await formPage.llenarFormulario({
      date: fechaISO(0),
      weightLb: 176,
      heightIn: 70,
      chestCm: 99,
      armCm: 38,
      goal: 'subir',
    });
    await formPage.guardar();

    expect(await listPage.getFlashExito()).to.equal('Medicion registrada exitosamente');
    expect(await listPage.contarFilas()).to.equal(filasAntes + 1);
    expect(await listPage.getPesos()).to.include('176');
  });

  it('Prueba negativa: rechaza el peso vacio y no crea el registro', async function () {
    await listPage.open();
    const filasAntes = await listPage.contarFilas();

    await listPage.clickNuevaMedicion();
    await formPage.llenarFormulario({
      date: fechaISO(0),
      weightLb: '',
      heightIn: 70,
      chestCm: 99,
      armCm: 38,
      goal: 'mantener',
    });
    await formPage.guardar();

    expect(await formPage.getErrorCampo('weightLb')).to.equal('El peso debe estar entre 50 y 700 lb');

    await listPage.open();
    expect(await listPage.contarFilas()).to.equal(filasAntes);
  });

  it('Prueba de limites: acepta el peso minimo de 50 lb y rechaza 49 lb', async function () {
    await listPage.open();
    const filasAntes = await listPage.contarFilas();

    await listPage.clickNuevaMedicion();
    await formPage.llenarFormulario({
      date: fechaISO(0),
      weightLb: 50,
      heightIn: 70,
      chestCm: 99,
      armCm: 38,
      goal: 'subir',
    });
    await formPage.guardar();

    expect(await listPage.getFlashExito()).to.equal('Medicion registrada exitosamente');
    expect(await listPage.contarFilas()).to.equal(filasAntes + 1);
    expect(await listPage.getPesos()).to.include('50');

    await listPage.clickNuevaMedicion();
    await formPage.llenarFormulario({
      date: fechaISO(0),
      weightLb: 49,
      heightIn: 70,
      chestCm: 99,
      armCm: 38,
      goal: 'subir',
    });
    await formPage.guardar();

    expect(await formPage.getErrorCampo('weightLb')).to.equal('El peso debe estar entre 50 y 700 lb');

    await listPage.open();
    expect(await listPage.contarFilas()).to.equal(filasAntes + 1);
  });
});
