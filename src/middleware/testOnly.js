module.exports = function testOnly(req, res, next) {
  if (process.env.NODE_ENV !== 'test') return res.status(404).end();
  next();
};
