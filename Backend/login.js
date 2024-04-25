// Import required modules
const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path'); // Import the path module

// MySQL database connection configuration
const db = mysql.createConnection({
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
    database: "wb1uv6dqlflyabu2", port:3306, 
  });
// Create a MySQL connection pool
db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL');
  });

  const filePath = path.join(__dirname, '..', 'Doctor Database', 'Dimi-src', 'home', 'login.html');
// Read HTML file containing login form
const loginFormHTML = fs.readFileSync(filePath, 'utf8');


// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Send login form HTML
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(loginFormHTML);
  } else if (req.method === 'POST' && req.url === '/login') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      // Parse form data
      const formData = new URLSearchParams(body);
      const username = formData.get('eid');
      const password = formData.get('password');

      // Check login credentials in the database
      db.query('SELECT EID, Passw FROM EMPLOYEE WHERE EID = ? AND Passw = ?', [username, password], (error, results) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
        } else {
          if (results.length > 0) {
            // Successful login
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Login successful!');
          } else {
            // Invalid credentials
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Invalid username or password');
          }
        }
      });
    });
  } else {
    // Not found
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
