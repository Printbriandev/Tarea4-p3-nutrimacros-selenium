const { By } = require('selenium-webdriver');

class ConfirmDeletePage {
  constructor(driver) {
    this.driver = driver;
  }

  async getPregunta() {
    return this.driver.findElement(By.id('confirm-question')).getText();
  }

  async confirmar() {
    await this.driver.findElement(By.id('confirm-delete-btn')).click();
  }

  async cancelar() {
    await this.driver.findElement(By.id('cancel-delete-link')).click();
  }
}

module.exports = { ConfirmDeletePage };
