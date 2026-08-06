const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const CREDENCIALES = { usuario: 'admin', password: 'Admin123!' };

const TIMEOUT_ESPERA = 8000;

function fechaISO(offsetDias = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDias);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}

module.exports = { BASE_URL, CREDENCIALES, TIMEOUT_ESPERA, fechaISO };
