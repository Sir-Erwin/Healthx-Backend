const http = require('http');
const mysql = require('mysql');

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
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Allow specified HTTP methods
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Allow additional headers

    if (req.method === 'DELETE' && req.url.startsWith('/doc/')) {
        // Extract employee ID from the URL
        const id = req.url.split('/')[2];

        // Delete the employee from the database
        pool.query('DELETE FROM EMPLOYEE WHERE EID = ?', [id], (error, results) => {
            if (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Employee deleted successfully' }));
            }
        });
    } else if (req.url === '/doc') {
        // Fetch employee details from MySQL database
        pool.query('SELECT EID, FName, LName, Contact, Gender, PhoneNum FROM DOCTOR', (error, results, fields) => {
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
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/doc`);
});