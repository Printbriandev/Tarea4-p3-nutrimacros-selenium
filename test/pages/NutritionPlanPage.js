const { By, until } = require('selenium-webdriver');
const { BASE_URL, TIMEOUT_ESPERA } = require('../support/config');

class NutritionPlanPage {
  constructor(driver) {
    this.driver = driver;
  }

  async open() {
    await this.driver.get(`${BASE_URL}/nutrition`);
    await this.driver.wait(until.elementLocated(By.id('calculate-btn')), TIMEOUT_ESPERA);
  }

  async calcular(presupuesto) {
    const campo = await this.driver.findElement(By.id('budget'));
    await campo.clear();
    if (String(presupuesto) !== '') await campo.sendKeys(String(presupuesto));
    await this.driver.findElement(By.id('calculate-btn')).click();
  }

  async getMacros() {
    await this.driver.wait(until.elementLocated(By.id('macros-summary')), TIMEOUT_ESPERA);
    const leer = async (id) => Number(await this.driver.findElement(By.id(id)).getText());
    return {
      kcal: await leer('macro-kcal'),
      proteinaG: await leer('macro-protein'),
      carbosG: await leer('macro-carbs'),
      grasaG: await leer('macro-fat'),
      tmb: await leer('macro-tmb'),
    };
  }

  async contarSugerencias() {
    const filas = await this.driver.findElements(By.css('#food-suggestions tr[data-food-id]'));
    return filas.length;
  }

  async getMensajeSinSugerencias() {
    const el = await this.driver.wait(until.elementLocated(By.id('no-suggestions')), TIMEOUT_ESPERA);
    return el.getText();
  }

  async getErrorPresupuesto() {
    const el = await this.driver.wait(
      until.elementLocated(By.css('.field-error[data-field="budget"]')),
      TIMEOUT_ESPERA
    );
    return el.getText();
  }
}

module.exports = { NutritionPlanPage };
