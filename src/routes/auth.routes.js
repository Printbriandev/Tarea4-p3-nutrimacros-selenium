const express = require('express');
const { findByUsername, verifyPassword } = require('../config/users');

const router = express.Router();

router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/measurements');
  res.render('login', { error: null, username: '' });
});

router.post('/login', (req, res) => {
  const username = String(req.body.username || '').trim();
  const password = String(req.body.password || '');

  if (username === '') {
    return res.status(400).render('login', { error: 'El usuario es requerido', username });
  }
  if (password === '') {
    return res.status(400).render('login', { error: 'La contrasena es requerida', username });
  }

  const user = findByUsername(username);
  if (!user || !verifyPassword(user, password)) {
    return res.status(401).render('login', { error: 'Usuario o contrasena incorrectos', username });
  }

  req.session.user = { username: user.username, fullName: user.fullName, age: user.age, sex: user.sex };
  res.redirect('/measurements');
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

module.exports = router;
