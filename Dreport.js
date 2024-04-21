const http = require('http');
const mysql = require('mysql');
const url = require('url');
const fs = require('fs');

// Create a connection pool to manage connections to the database
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vf3kex8mlhqctqd0",
    password: "eyi36qurfvsqlnuj",
    database:  "wb1uv6dqlflyabu2"
});

// Function to retrieve employee data from the database
function getEmployeeData(callback) {
    const sql = "SELECT eid, first_name, last_name, email, gender, phone_number, role FROM employees";
    pool.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
            return;
        }
        callback(null, results);
    });
}

// Function to insert employee data into the database
function insertEmployeeData(formData, callback) {
    const sql = "INSERT INTO employees (first_name, last_name, email, gender, phone_number, role) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [formData.first_name, formData.last_name, formData.email, formData.gender, formData.phone_number, formData.role];

    pool.query(sql, values, (err, result) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/form' && req.method === 'GET') {
        // Serve HTML file with form
        fs.readFile('add-employee.html', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (reqUrl.pathname === '/table' && req.method === 'GET') {
        // Serve HTML file with table
        fs.readFile('employee.html', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (reqUrl.pathname === '/submit' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = JSON.parse(body);

            // Insert data into the database
            insertEmployeeData(formData, (err) => {
                if (err) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ error: 'Internal Server Error' }));
                    return;
                }
                
                res.statusCode = 200;
                res.end(JSON.stringify({ message: 'Employee added successfully' }));
            });
        });
    } else if (reqUrl.pathname === '/employees' && req.method === 'GET') {
        // Retrieve employee data from the database
        getEmployeeData((err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
                return;
            }

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        });
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
