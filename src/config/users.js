const bcrypt = require('bcryptjs');

const users = [
  {
    username: 'admin',
    passwordHash: bcrypt.hashSync('Admin123!', 10),
    fullName: 'Brian Guzman',
    age: 25,
    sex: 'masculino',
  },
];

function findByUsername(username) {
  return users.find((u) => u.username === username);
}

function verifyPassword(user, plainPassword) {
  return bcrypt.compareSync(plainPassword, user.passwordHash);
}

module.exports = { findByUsername, verifyPassword };
