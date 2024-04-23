const http = require('http');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');


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
  const path = url.parse(req.url).pathname;

  /*Dont Change*/{
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
      // Respond with 200 OK status
      res.writeHead(200);
      res.end();
      return;
  }
  }
  
  //const { pathname, query } = url.parse(req.url, true);

  const loginPagePath = path.join(__dirname, '.', '..', 'Doctor Database', 'Dimi-src', 'home', 'entry.html');

let loginPage;
try {
    loginPage = fs.readFileSync(loginPagePath, 'utf8');
} catch (error) {
    console.error('Error reading entry.html:', error);
    process.exit(1); // Exit the process with an error status code
}

  // Route for handling login requests

  if (pathname === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
        
      // Bad Request
      if (!username || !password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing username or password');
        return;
      }

      // Check if user exists in the database
      db.query('select EID from EMPLOYEE WHERE EID = ?', [username], (err, results) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Query Err: Internal server error');
          return;
        }
        if (results.length === 0) { // User Doesn't Exist
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.end('Invalid username or password');
          return;
        }
        
        // Compare hashed password
        const user = results[0];
              
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
    });
  }

  else{
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
    
});

// Start the server
<<<<<<< HEAD
const PORT = process.env.PORT || 9099;
=======
const PORT = process.env.PORT || 3000;
>>>>>>> a2468801d9899904047f85d2123c72b647742292
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
