const { By, until } = require('selenium-webdriver');
const { BASE_URL, TIMEOUT_ESPERA } = require('../support/config');

class MeasurementsListPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(`${BASE_URL}/measurements`);
  }

  async esperarCarga() {
    await this.driver.wait(until.urlContains('/measurements'), TIMEOUT_ESPERA);
  }

  async getFilas() {
    return this.driver.findElements(By.css('#measurements-table tr[data-measurement-id]'));
  }

  async contarFilas() {
    return (await this.getFilas()).length;
  }

  async getFechas() {
    const celdas = await this.driver.findElements(By.css('#measurements-table .measurement-date'));
    return Promise.all(celdas.map((c) => c.getText()));
  }

  async getPesos() {
    const celdas = await this.driver.findElements(By.css('#measurements-table .measurement-weight'));
    return Promise.all(celdas.map((c) => c.getText()));
  }

  async getObjetivos() {
    const celdas = await this.driver.findElements(By.css('#measurements-table .measurement-goal'));
    return Promise.all(celdas.map((c) => c.getText()));
  }

  async clickNuevaMedicion() {
    await this.driver.findElement(By.id('new-measurement-btn')).click();
    await this.driver.wait(until.elementLocated(By.id('save-btn')), TIMEOUT_ESPERA);
  }

  async clickEditar(id) {
    await this.driver.findElement(By.css(`a.edit-link[data-measurement-id="${id}"]`)).click();
    await this.driver.wait(until.elementLocated(By.id('save-btn')), TIMEOUT_ESPERA);
  }

  async clickEliminar(id) {
    await this.driver.findElement(By.css(`a.delete-link[data-measurement-id="${id}"]`)).click();
    await this.driver.wait(until.elementLocated(By.id('confirm-delete-btn')), TIMEOUT_ESPERA);
  }

  async getPrimerId() {
    const filas = await this.getFilas();
    return filas[0].getAttribute('data-measurement-id');
  }

  async getFlashExito() {
    const el = await this.driver.wait(until.elementLocated(By.id('flash-success')), TIMEOUT_ESPERA);
    return el.getText();
  }

  async getFlashAdvertencia() {
    const el = await this.driver.wait(until.elementLocated(By.id('flash-warning')), TIMEOUT_ESPERA);
    return el.getText();
  }

  async getEstadoVacio() {
    const el = await this.driver.wait(until.elementLocated(By.id('empty-state')), TIMEOUT_ESPERA);
    return el.getText();
  }

  async existeTabla() {
    return (await this.driver.findElements(By.id('measurements-table'))).length > 0;
  }
}

module.exports = { MeasurementsListPage };
