const http = require('http');
const mysql = require('mysql');
const fs = require('fs');
const path = require('path');

// MySQL database connection configuration
const db = mysql.createConnection({
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vf3kex8mlhqctqd0",
    password: "eyi36qurfvsqlnuj",
    database: "wb1uv6dqlflyabu2",
    port: 3306,
});

// Create a MySQL connection pool
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

// Create HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/add-appointment') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // Parse form data
            const { name, date, email, time, number, department, gender } = JSON.parse(body);

            // Insert appointment into database
            db.query('INSERT INTO appointments (name, date, email, time, number, department, gender) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [name, date, email, time, number, department, gender],
                (error, results) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        // Redirect or send response as needed
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Appointment added successfully!');
                    }
                });
        });
    } 
    
        if (req.method === 'GET' && req.url === '/view-appointments') {
            // Retrieve appointments from the database
            db.query('SELECT * FROM appointments', (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    // Send JSON response with appointments data
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                }
            });
        }
    
        if (req.method === 'POST' && req.url === '/cancel-appointment') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                // Parse form data
                const { appointmentId } = JSON.parse(body);
    
                // Delete appointment from database
                db.query('DELETE FROM appointments WHERE id = ?', [appointmentId], (error, results) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        // Redirect or send response as needed
                        res.writeHead(200, { 'Content-Type': 'text/plain' });
                        res.end('Appointment canceled successfully!');
                    }
                });
            });
        }

    else {
        // Not found
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});