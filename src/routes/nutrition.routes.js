const express = require('express');
const store = require('../data/store');
const requireAuth = require('../middleware/requireAuth');
const { foodCatalog } = require('../data/foodCatalog');
const { calcularMacros } = require('../domain/macroCalculator');
const { validateBudget } = require('../validators/measurementValidator');

const router = express.Router();

router.use(requireAuth);

function sugerirAlimentos(presupuesto) {
  return foodCatalog
    .filter((alimento) => alimento.precioRD <= presupuesto)
    .map((alimento) => ({
      ...alimento,
      porcionesPosibles: Math.floor(presupuesto / alimento.precioRD),
      proteinaPorPeso: alimento.proteinaG / alimento.precioRD,
    }))
    .sort((a, b) => b.proteinaPorPeso - a.proteinaPorPeso);
}

function render(res, { budget, error, macros, sugerencias }) {
  res.render('nutrition/plan', {
    latest: store.getLatest(),
    budget,
    error: error || null,
    macros: macros || null,
    sugerencias: sugerencias || null,
  });
}

router.get('/', (req, res) => {
  render(res, { budget: '' });
});

router.post('/plan', (req, res) => {
  const budget = req.body.budget;
  const { valid, error, value } = validateBudget(budget);
  if (!valid) {
    return res.status(400).render('nutrition/plan', {
      latest: store.getLatest(),
      budget,
      error,
      macros: null,
      sugerencias: null,
    });
  }

  const latest = store.getLatest();
  if (!latest) {
    return res.status(400).render('nutrition/plan', {
      latest: null,
      budget,
      error: 'Debes registrar al menos una medicion para calcular tu plan',
      macros: null,
      sugerencias: null,
    });
  }

  const macros = calcularMacros({
    weightLb: latest.weightLb,
    heightIn: latest.heightIn,
    age: req.session.user.age,
    sex: req.session.user.sex,
    goal: latest.goal,
  });

  render(res, { budget, macros, sugerencias: sugerirAlimentos(value) });
});

module.exports = router;
