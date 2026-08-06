// El servidor de la aplicacion se levanta dentro del propio proceso de Mocha.
// Debe quedar en modo test ANTES de cargar la app para habilitar /__test__/reset.
process.env.NODE_ENV = 'test';

const app = require('../../src/app');
const { BASE_URL } = require('./config');

const PORT = Number(new URL(BASE_URL).port || 3000);

let server;

exports.mochaHooks = {
  beforeAll(done) {
    server = app.listen(PORT, done);
  },
  afterAll(done) {
    server.close(done);
  },
};
