
const http = require('http');
const fs = require('fs');
const url = require('url');
const mysql = require('mysql');
const path = require('path'); // Import the path module


// MySQL database connection configuration
const db = mysql.createConnection({
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
    database: "wb1uv6dqlflyabu2", port:3306, 
  });
  
/*const dbConfig = {
    host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
  database: "wb1uv6dqlflyabu2", port:3306,
};*/

// Create a MySQL connection pool
db.connect(err => {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      return;
    }
    console.log('Connected to MySQL');
  });
// const pool = mysql.createPool(dbConfig);

// Read the HTML file
// Get the absolute file path to login.html
const loginPagePath = path.join(__dirname, '.', '..', 'Doctor Database', 'Dimi-src', 'home', 'entry.html');

let loginPage;
try {
    loginPage = fs.readFileSync(loginPagePath, 'utf8');
} catch (error) {
    console.error('Error reading entry.html:', error);
    process.exit(1); // Exit the process with an error status code
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const path = url.parse(req.url).pathname;

    if (req.method === 'GET' && path === '/') {
        // Serve the login page
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(loginPage);
    } else if (req.method === 'POST' && path === '/signup') {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            // Parse form data
            const formData = new URLSearchParams(body);
            const fname = formData.get('fname');
            const mname = formData.get('Mname');
            const lname = formData.get('Lname');
            const email = formData.get('email');
            const social = formData.get('ssn');
            //const gender = formData.get('gender');
            const eid = formData.get('eid');
            const password = formData.get('password');


            // Store data in MySQL database
            db.query('INSERT INTO EMPLOYEE (FName, MInitial, LName, Contact, SSN, EID, Passw) VALUES (?, ?, ?, ?, ?, ?, ?)', [fname, mname, lname, email, social, eid, password], (error, results) => {
                if (error) {
                    console.error('Error storing data:', error);
                    res.writeHead(500, {'Content-Type': 'text/plain'});
                    res.end('Internal Server Error');
                } else {
                    console.log('Data stored successfully');
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Login successful');
                }
            });
        });
    } else {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
