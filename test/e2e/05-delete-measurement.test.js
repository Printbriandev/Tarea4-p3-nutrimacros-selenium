const { expect } = require('chai');
const { buildDriver } = require('../support/driver');
const { resetState } = require('../support/resetState');
const { captureScreenshot } = require('../support/screenshot');
const { CREDENCIALES } = require('../support/config');
const { LoginPage } = require('../pages/LoginPage');
const { MeasurementsListPage } = require('../pages/MeasurementsListPage');
const { ConfirmDeletePage } = require('../pages/ConfirmDeletePage');

describe('HU-5 | Eliminar medicion corporal', function () {
  let driver;
  let loginPage;
  let listPage;
  let confirmPage;

  before(async function () {
    driver = await buildDriver();
    loginPage = new LoginPage(driver);
    listPage = new MeasurementsListPage(driver);
    confirmPage = new ConfirmDeletePage(driver);
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

  it('Camino feliz: al confirmar, elimina la medicion del listado', async function () {
    await resetState('default');
    await iniciarSesion();

    const filasAntes = await listPage.contarFilas();
    await listPage.clickEliminar(1);
    await confirmPage.confirmar();

    expect(await listPage.getFlashExito()).to.equal('Medicion eliminada exitosamente');
    expect(await listPage.contarFilas()).to.equal(filasAntes - 1);
  });

  it('Prueba negativa: al cancelar, la medicion se conserva sin cambios', async function () {
    await resetState('default');
    await iniciarSesion();

    const filasAntes = await listPage.contarFilas();
    await listPage.clickEliminar(2);
    await confirmPage.cancelar();
    await listPage.esperarCarga();

    expect(await listPage.contarFilas()).to.equal(filasAntes);
  });

  it('Prueba de limites: al eliminar la unica medicion muestra el estado vacio controlado', async function () {
    await resetState('single');
    await iniciarSesion();

    expect(await listPage.contarFilas()).to.equal(1);

    await listPage.clickEliminar(1);
    await confirmPage.confirmar();

    expect(await listPage.getEstadoVacio()).to.equal('No hay mediciones registradas');
    expect(await listPage.existeTabla()).to.equal(false);
  });
});
