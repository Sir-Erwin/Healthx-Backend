// Import required modules
const http = require('http');
const fs = require('fs');
const mysql = require('mysql');
const path = require('path');

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

// Create a HTTP server
const server = http.createServer((req, res) => {
  // Routing for different URL paths
  let filePath;

  if (req.url === '/') {
    filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'login.html');
    serveStaticFile(res, filePath, 'text/html');
  } else if (req.url === '/login.css') {
    filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'login.css');
    serveStaticFile(res, filePath, 'text/css');
  } else if (req.url === '/sunrise.jpg') {
    filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'sunrise.jpg');
    serveStaticFile(res, filePath, 'image/jpeg');
  } else if (req.url === '/login' && req.method === 'POST') {
    handleLoginRequest(req, res);
  } else {
    send404(res);
  }
});

// Function to serve static files
function serveStaticFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      send500(res);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
}

// Example function to handle login requests
function handleLoginRequest(req, res) {
  let body = '';

  req.on('data', (chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    // Handle login logic here
    // Example: Check credentials from form data
    const formData = new URLSearchParams(body);
    const username = formData.get('eid');
    const password = formData.get('password');

    // Example MySQL query (if you're using a database)
     db.query('SELECT EID, Passw FROM EMPLOYEE WHERE EID = ? AND Passw = ?', [username, password], (err, results) => {
      if (err) {
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

    // Respond to client
    //res.writeHead(200, { 'Content-Type': 'text/plain' });
    //res.end('Login successful or not, depending on your logic');
  });
}

// Function to send 404 Not Found response
function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
}

// Function to send 500 Internal Server Error response
function send500(res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Internal Server Error');
}

// Start the server
const PORT = process.env.PORT || 3001; // Use process.env.PORT for Heroku compatibility
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
