const express = require('express');
const store = require('../data/store');
const testOnly = require('../middleware/testOnly');

const router = express.Router();

router.post('/__test__/reset', testOnly, (req, res) => {
  store.resetMeasurements((req.body && req.body.seed) || 'default');
  res.status(200).json({ ok: true });
});

module.exports = router;
