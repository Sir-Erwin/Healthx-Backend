const bcrypt = require('bcrypt');

const plainPassword = 'Password!';

bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.log('\x1B[31Error while hashing password:', err);
    return;
  }
  console.log('Hashed password:', hashedPassword);

  bcrypt.compare(plainPassword, hashedPassword, (bcryptErr, bcryptResult) => {
    if (bcryptErr) {
      console.log('Bcrypt Err: Internal server error' + JSON.stringify(bcryptErr));
    }
    if (!bcryptResult) {
      console.log(plainPassword + "\n" + hashed);
    }
    else console.log('Login successful');
  });
});

