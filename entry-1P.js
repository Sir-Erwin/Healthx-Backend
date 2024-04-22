/*function startBackendService() {
    console.log("Backend service started");
}

module.exports = {
    start: startBackendService
}*/
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
    filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'entryP.html');
    serveStaticFile(res, filePath, 'text/html');
  } else if (req.url === '/entry.css') {
    filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'entry.css');
    serveStaticFile(res, filePath, 'text/css');
  } else if (req.url === '/sunrise.jpg') {
    filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'sunrise.jpg');
    serveStaticFile(res, filePath, 'image/jpeg');
  } else if (req.url === '/signuP' && req.method === 'POST') {
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
    // Parse form data
    const formData = new URLSearchParams(body);
    const fname = formData.get('fname');
    const lname = formData.get('Lname');
    const email = formData.get('email');
    const social = formData.get('ssn');
    const number = formData.get('number');
    const gender = formData.get('gender');
    const password = formData.get('password');

    // Example MySQL query (if you're using a database)
     db.query('INSERT INTO PATIENT (Name, Email, SSN, PhoneNum, Gender, Passw) VALUES (?, ?, ?, ?, ?, ?)', [fname + lname, email, social, number, gender, password], (err, results) => {
        if (err) {
            console.error('Error storing data:', err);
            res.writeHead(500, {'Content-Type': 'text/plain'});
            res.end('Internal Server Error');
        } else {
            console.log('Data stored successfully');
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end('Login successful');
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
