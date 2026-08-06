const express = require('express');
const store = require('../data/store');
const requireAuth = require('../middleware/requireAuth');
const { validateMeasurement, normalizeMeasurement, OBJETIVOS } = require('../validators/measurementValidator');

const router = express.Router();

const FLASH = {
  created: { tipo: 'success', texto: 'Medicion registrada exitosamente' },
  updated: { tipo: 'success', texto: 'Medicion actualizada exitosamente' },
  deleted: { tipo: 'success', texto: 'Medicion eliminada exitosamente' },
  notfound: { tipo: 'warning', texto: 'Medicion no encontrada' },
};

router.use(requireAuth);

router.get('/', (req, res) => {
  res.render('measurements/list', {
    measurements: store.getAll(),
    flash: FLASH[req.query.msg] || null,
  });
});

router.get('/new', (req, res) => {
  res.render('measurements/form', {
    mode: 'create',
    action: '/measurements',
    values: { date: store.todayISO(), weightLb: '', heightIn: '', chestCm: '', armCm: '', goal: 'mantener' },
    errors: {},
    objetivos: OBJETIVOS,
  });
});

router.post('/', (req, res) => {
  const { valid, errors } = validateMeasurement(req.body);
  if (!valid) {
    return res.status(400).render('measurements/form', {
      mode: 'create',
      action: '/measurements',
      values: req.body,
      errors,
      objetivos: OBJETIVOS,
    });
  }
  store.add(normalizeMeasurement(req.body));
  res.redirect('/measurements?msg=created');
});

router.get('/:id/edit', (req, res) => {
  const measurement = store.findById(req.params.id);
  if (!measurement) return res.redirect('/measurements?msg=notfound');
  res.render('measurements/form', {
    mode: 'edit',
    action: `/measurements/${measurement.id}`,
    values: measurement,
    errors: {},
    objetivos: OBJETIVOS,
  });
});

router.post('/:id', (req, res) => {
  const measurement = store.findById(req.params.id);
  if (!measurement) return res.redirect('/measurements?msg=notfound');

  const { valid, errors } = validateMeasurement(req.body);
  if (!valid) {
    return res.status(400).render('measurements/form', {
      mode: 'edit',
      action: `/measurements/${measurement.id}`,
      values: { id: measurement.id, ...req.body },
      errors,
      objetivos: OBJETIVOS,
    });
  }
  store.update(measurement.id, normalizeMeasurement(req.body));
  res.redirect('/measurements?msg=updated');
});

router.get('/:id/delete/confirm', (req, res) => {
  const measurement = store.findById(req.params.id);
  if (!measurement) return res.redirect('/measurements?msg=notfound');
  res.render('measurements/confirm-delete', { measurement });
});

router.post('/:id/delete', (req, res) => {
  if (!store.remove(req.params.id)) return res.redirect('/measurements?msg=notfound');
  res.redirect('/measurements?msg=deleted');
});

module.exports = router;
