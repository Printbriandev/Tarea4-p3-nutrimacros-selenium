const { By, until } = require('selenium-webdriver');
const { TIMEOUT_ESPERA } = require('../support/config');

const CAMPOS_TEXTO = ['weightLb', 'heightIn', 'chestCm', 'armCm'];

class MeasurementFormPage {
  constructor(driver) {
    this.driver = driver;
  }

  async setFecha(valor) {
    const campo = await this.driver.findElement(By.id('date'));
    await this.driver.executeScript(
      'arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event("change"));',
      campo,
      valor
    );
  }

  async llenarFormulario(datos) {
    if (datos.date !== undefined) await this.setFecha(datos.date);

    for (const campo of CAMPOS_TEXTO) {
      if (datos[campo] === undefined) continue;
      const input = await this.driver.findElement(By.id(campo));
      await input.clear();
      if (String(datos[campo]) !== '') await input.sendKeys(String(datos[campo]));
    }

    if (datos.goal !== undefined) {
      await this.driver.findElement(By.css(`#goal option[value="${datos.goal}"]`)).click();
    }
  }

  async guardar() {
    await this.driver.findElement(By.id('save-btn')).click();
  }

  async getErrorCampo(campo) {
    const el = await this.driver.wait(
      until.elementLocated(By.css(`.field-error[data-field="${campo}"]`)),
      TIMEOUT_ESPERA
    );
    return el.getText();
  }

  async getValor(campo) {
    return this.driver.findElement(By.id(campo)).getAttribute('value');
  }
}

module.exports = { MeasurementFormPage };
