const bcrypt = require('bcrypt');

const plainPassword = 'Password!';
bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error while hashing password:', err);
    return;
  }
  console.log('Hashed password:', hashedPassword);
});
