const http = require('http');
const url = require('url');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Create a MySQL connection
const db = mysql.createConnection({
  host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
  database: "wb1uv6dqlflyabu2", port:3306, 
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Create HTTP server
const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  // Route for handling login requests
  if (pathname === '/login') {
    const { username, password } = query;
    if (!username || !password) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Missing username or password');
      return;
    }

    // Check if user exists in the database
    db.query('select * from doclogindetails WHERE EID = ?', [username], (err, results) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Query Err: Internal server error');
        return;
      }
      if (results.length === 0) {
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.end('Invalid username or password');
        return;
      }

      const user = results[0];
      // Compare hashed password
      
      bcrypt.compare(password, user.Passw, (bcryptErr, bcryptResult) => {
        if (bcryptErr) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.write('Bcrypt Err: Internal server error');
          res.end(JSON.stringify(bcryptErr));
          return;
        }
        if (!bcryptResult) {
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.end('Invalid username or password');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Login successful');
      });
    });
  } else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start the server
const PORT = process.env.PORT || 8081;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
