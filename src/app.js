const path = require('path');
const express = require('express');
const session = require('express-session');

const authRoutes = require('./routes/auth.routes');
const measurementsRoutes = require('./routes/measurements.routes');
const nutritionRoutes = require('./routes/nutrition.routes');
const testRoutes = require('./routes/test.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nutrimacros-dev-secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.get('/', (req, res) => res.redirect(req.session.user ? '/measurements' : '/login'));

app.use(authRoutes);
app.use('/measurements', measurementsRoutes);
app.use('/nutrition', nutritionRoutes);
app.use(testRoutes);

module.exports = app;
