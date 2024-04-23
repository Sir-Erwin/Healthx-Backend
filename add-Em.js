
const http = require('http');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors module



// MySQL database connection configuration
const db = mysql.createConnection({
  host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
    database: "wb1uv6dqlflyabu2",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

// Create HTTP server
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Allow requests from this origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow specified HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Allow additional headers

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
  //const { method, url: reqUrl } = req;
  //const parsedUrl = url.parse(reqUrl, true);

  // Route request based on URL and HTTP method
   else if (req.method === 'POST' && req.url=== '/addEm') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const data = JSON.parse(body);

      const {eid, fname, lname, email, gender, number, role } = data;
      // Insert data into MySQL table
      //const sql = 'INSERT INTO your_table (column_name) VALUES (?)';
      db.query('INSERT INTO EMPLOYEE (EID, FName, LName, Email, Gender, PhoneNum, Role) VALUES (?, ?, ?, ?, ?, ?, ?)', [eid, fname, lname, email, gender, number, role], (err, result) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Error saving data' }));
          throw err;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Data saved successfully' }));
      });
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

const port = 5000;

// Start server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
