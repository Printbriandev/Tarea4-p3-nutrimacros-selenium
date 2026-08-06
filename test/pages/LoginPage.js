const { By, until } = require('selenium-webdriver');
const { BASE_URL, TIMEOUT_ESPERA } = require('../support/config');

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  // Limpia la sesion antes de abrir: con una sesion activa el servidor redirige
  // /login hacia /measurements y el formulario no llegaria a renderizarse.
  async open() {
    await this.driver.get(BASE_URL);
    await this.driver.manage().deleteAllCookies();
    await this.driver.get(`${BASE_URL}/login`);
    await this.driver.wait(until.elementLocated(By.id('login-submit')), TIMEOUT_ESPERA);
  }

  async login(usuario, password) {
    const campoUsuario = await this.driver.findElement(By.id('username'));
    const campoPassword = await this.driver.findElement(By.id('password'));

    await campoUsuario.clear();
    await campoPassword.clear();
    if (usuario !== '') await campoUsuario.sendKeys(usuario);
    if (password !== '') await campoPassword.sendKeys(password);

    await this.driver.findElement(By.id('login-submit')).click();
  }

  async getMensajeError() {
    const alerta = await this.driver.wait(
      until.elementLocated(By.css('.alert-error')),
      TIMEOUT_ESPERA
    );
    return alerta.getText();
  }
}

module.exports = { LoginPage };
