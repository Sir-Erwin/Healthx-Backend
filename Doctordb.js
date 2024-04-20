import http from 'http';
import mysql from 'mysql2';
import cors from 'cors'; // Import the cors package

const connection = mysql.createConnection({
  host: 'nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user: 'vf3kex8mlhqctqd0',
  password: 'eyi36qurfvsqlnuj',
  database: 'wb1uv6dqlflyabu2',
  port: 3306
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Function to get all patients
export function getAllPatients(callback) {
  connection.query('SELECT * FROM PATIENT', (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Got patients');
      callback(null, results);
    }
  });
}

// Function to get all appointments
export function getAllAppointments(callback) {
  connection.query('SELECT * FROM APPOINTMENT', (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Got appointments');
      callback(null, results);
    }
  });
}

// Function to get all prescriptions
export function getAllPrescriptions(callback) {
  connection.query('SELECT * FROM PRESCRIPTION', (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Got prescriptions');
      callback(null, results);
    }
  });
}

// Function to add prescription
export function addPrescription(prescriptionData, callback) {
  connection.query('INSERT INTO PRESCRIPTION SET ?', prescriptionData, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Prescription added successfully');
      callback(null, results);
    }
  });
}

const server = http.createServer((req, res) => {
  // Allow all origins
  cors()(req, res, () => {
    // Handle HTTP requests
    if (req.url === '/Patientlist') { // Updated URL matching
      getAllPatients((error, patients) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(patients));
        }
      });
    } else if (req.url === '/DoctorAppointments') {
      getAllAppointments((error, appointments) => {
        if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(appointments));
        }
      });
    } else if (req.url === '/DoctorPrescriptions') {
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
      } else if (req.method === 'POST') {
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
      } else {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not Found' }));
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default connection;
