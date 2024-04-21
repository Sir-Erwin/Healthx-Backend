const http = require('http');
const mysql = require('mysql2');
const { insertBloodTestResults } = require('./bloodTestResults');
const { insertLabScan } = require('./labScan');
const { insertPathologicalTestResults } = require('./pathologicalTestResults');
const { insertKidneyFuncTestResults } = require('./insertkidneyFuncTestResults');
const { DoctorAppointments } = require('./doctorAppointments');
const { Patientlist } = require('./Patientlist');
const { DoctorPrescriptions } = require('./doctorPrescriptions');
const {Emplogin}= require('./Emplogin');
const {Plogin}= require('./plogin');
const {Doclogin}= require('./doclogin');
const {Connection} = require('./connection');
// Add more imports as needed

  const connection = mysql.createConnection({
  host: 'nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'vf3kex8mlhqctqd0',
  password: 'eyi36qurfvsqlnuj',
  database: 'wb1uv6dqlflyabu2',
  port: 3306
});

// Create an HTTP server
const server = http.createServer((req, res) => {

if(req.url == "/" && req.method === "GET"){
        console.log(dat);
        
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("<h1>Route: GET</h1> <h2>URL: \"/\"</h2>");
        res.write("<p>" + JSON.stringify(dat) + "</p>");
        res.end();
    }

//Handle Patientlist
else if (req.url === '/Patientlist') { // Updated URL matching
      getAllPatients((error, patients) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(patients));
        }
      });
    } 

//Handle DoctorAppointments
else if (req.url === '/DoctorAppointments') {
      getAllAppointments((error, appointments) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(appointments));
        }
      });
    } 

//Handle DoctorPrescriptions
else if (req.url === '/DoctorPrescriptions') {
      if (req.method === 'GET') {
        // Get all prescriptions
        getAllPrescriptions((error, prescriptions) => {
          if (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(prescriptions));
          }
        });
      } 
else if (req.method === 'POST') {
        // Add a new prescription
        let data = '';
        req.on('data', chunk => {
          data += chunk;
        });
        req.on('end', () => {
          const newPrescription = JSON.parse(data);
          addPrescription(newPrescription, (error, result) => {
            if (error) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Internal Server Error' }));
            } else {
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(result));
            }
          });
        });
} 
else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      }

// Handle Emplogin
else if (pathname === '/emplogin' && req.method === 'POST') {
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
      db.query('select * from emplogindetails WHERE EID = ?', [username], (err, results) => {
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

// Handle doclogin
else if (pathname === '/doclogin' && req.method === 'POST') {
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
      db.query('select * from doclogindetails WHERE EID = ?', [username], (err, results) => {
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

// Handle Plogin
 else if (pathname === '/plogin' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
        
      // Bad Request
      if (!email || !password) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Missing email or password');
        return;
      }

      // Check if user exists in the database
      db.query('select * from patientlogindetails WHERE PID = ?', [email], (err, results) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Query Err: Internal server error');
          return;
        }
        if (results.length === 0) { // User Doesn't Exist
          res.writeHead(401, { 'Content-Type': 'text/plain' });
          res.end('Invalid email or password');
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
            res.end('Invalid email or password');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('Login successful');
        });
      });
    });
  }
 
    // Handle insertBloodTestResults request
 else if (req.url === '/insertBloodTestResults' && req.method === 'POST') {
    let data = '';
    // Receive the data from the request body
    req.on('data', chunk => {
      data += chunk;
    });
    // Parse and insert the received data into the database
    req.on('end', () => {
      const bloodTestResults = JSON.parse(data);
      insertBloodTestResults(bloodTestResults, (error, result) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } 
        else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        }
      });
    });
  }
   
 
    // Handle insertKidneyFuncTestResults request
  else if (req.url === '/insertKidneyFuncTestResults' && req.method === 'POST') {
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });
    req.on('end', () => {
      const kidneyFuncTestResults = JSON.parse(data);
      insertKidneyFuncTestResults(kidneyFuncTestResults, (error, result) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        }
      });
    });
  }
   
// Handle insertLabScan'
 else if (req.url === '/insertLabScan' && req.method === 'POST') {
    let data = '';

    // Receive the data from the request body
    req.on('data', chunk => {
      data += chunk;
    });

    // Parse and insert the received data into the database
    req.on('end', () => {
      const labScanData = JSON.parse(data);
      insertLabScan(labScanData, (error, result) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        }
      });
    });
  }

else if (req.url === '/insertPathologicalTestResults' && req.method === 'POST') {
    let data = '';

    // Receive the data from the request body
    req.on('data', chunk => {
      data += chunk;
    });

    // Parse and insert the received data into the database
    req.on('end', () => {
      const pathologicalTestResults = JSON.parse(data);
      insertPathologicalTestResults(pathologicalTestResults, (error, result) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        }
      });
    });
  }

else {
    // Handle other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
