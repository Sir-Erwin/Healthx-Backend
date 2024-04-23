const http = require('http');
const url = require('url');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');
// MySQL connection configuration
const dbConfig = {
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
    database: "wb1uv6dqlflyabu2",
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Allow requests from this origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow specified HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Allow additional headers

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    if (req.method === 'GET' && req.url === '/employees/') {
        // Serve the HTML form
        const filePath = path.join(__dirname, '..', 'HealthX-Final', 'home', 'employee.html');
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain'});
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
      }else if (req.method === 'DELETE' && req.url.startsWith('/employees/')) {
        // Extract employee number from the URL
        const number = req.url.split('/')[2];
        // Delete the employee from the database
        pool.query('DELETE FROM EMPLOYEE WHERE PhoneNum = ?', [number], (error, results) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Delete Internal Server Error' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Employee deleted successfully' }));
            }
        });
    } else if (req.url === '/employees') {
        // Fetch employee details from MySQL database
        pool.query('SELECT EID, FName, LName, Email, Gender, PhoneNum, Role FROM EMPLOYEE', (error, results, fields) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(results));
        });
    } else {
        // Handle other routes
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// Enable CORS for all origins

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});