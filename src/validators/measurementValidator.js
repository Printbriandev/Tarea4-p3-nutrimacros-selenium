const { todayISO } = require('../data/store');

const RANGOS = {
  weightLb: { min: 50, max: 700, etiqueta: 'El peso debe estar entre 50 y 700 lb' },
  heightIn: { min: 40, max: 90, etiqueta: 'La altura debe estar entre 40 y 90 pulgadas' },
  chestCm: { min: 40, max: 200, etiqueta: 'La medida del torso debe estar entre 40 y 200 cm' },
  armCm: { min: 15, max: 80, etiqueta: 'La medida del brazo debe estar entre 15 y 80 cm' },
};

const OBJETIVOS = ['bajar', 'mantener', 'subir'];

function validarNumero(valor, campo, errors) {
  const { min, max, etiqueta } = RANGOS[campo];
  const texto = String(valor == null ? '' : valor).trim();
  if (texto === '') {
    errors[campo] = etiqueta;
    return;
  }
  const numero = Number(texto);
  if (!Number.isFinite(numero) || numero < min || numero > max) {
    errors[campo] = etiqueta;
  }
}

function validateMeasurement(input) {
  const errors = {};

  const date = String(input.date || '').trim();
  if (date === '') {
    errors.date = 'La fecha es requerida';
  } else if (date > todayISO()) {
    errors.date = 'La fecha no puede ser futura';
  }

  validarNumero(input.weightLb, 'weightLb', errors);
  validarNumero(input.heightIn, 'heightIn', errors);
  validarNumero(input.chestCm, 'chestCm', errors);
  validarNumero(input.armCm, 'armCm', errors);

  if (!OBJETIVOS.includes(input.goal)) {
    errors.goal = 'El objetivo debe ser bajar, mantener o subir';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

function normalizeMeasurement(input) {
  return {
    date: String(input.date).trim(),
    weightLb: Number(input.weightLb),
    heightIn: Number(input.heightIn),
    chestCm: Number(input.chestCm),
    armCm: Number(input.armCm),
    goal: input.goal,
  };
}

function validateBudget(value) {
  const texto = String(value == null ? '' : value).trim();
  if (texto === '') return { valid: false, error: 'El presupuesto es requerido' };
  const numero = Number(texto);
  if (!Number.isFinite(numero) || numero <= 0) {
    return { valid: false, error: 'El presupuesto debe ser un numero mayor que cero' };
  }
  return { valid: true, value: numero };
}

module.exports = { validateMeasurement, normalizeMeasurement, validateBudget, OBJETIVOS };
