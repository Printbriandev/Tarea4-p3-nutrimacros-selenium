const { BASE_URL } = require('./config');

async function resetState(seed = 'default') {
  const res = await fetch(`${BASE_URL}/__test__/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seed }),
  });
  if (!res.ok) {
    throw new Error(`No se pudo reiniciar el estado de prueba (HTTP ${res.status}). Ejecuta el servidor con NODE_ENV=test.`);
  }
}

module.exports = { resetState };
