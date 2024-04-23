const http = require('http');
const url = require('url');
const fs = require('fs');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');


// Create a MySQL connection
const db = mysql.createConnection({
  host: "nj5rh9gto1v5n05t.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "vf3kex8mlhqctqd0", password: "eyi36qurfvsqlnuj",
  database: "wb1uv6dqlflyabu2", port:3306, 
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + db.threadId);
});

// Create HTTP server
const server = http.createServer((req, res) => {

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
      // Respond with 200 OK status
      res.writeHead(200);
      res.end();
      return;
  }

const { pathname, query } = url.parse(req.url, true);
/**
 * Employee Login
 */
if (pathname === '/emp_login' && req.method === 'POST') {
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
      console.log("Username: " + username + "\nPassword: " + password + "\nHashedPassw: " + user.Passw + "\n");
            
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
        res.end(user.Role);
      });
    });
  });
}

/**
 * Patient Login
 */
else if (pathname === '/pat_login' && req.method === 'POST') {
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
    db.query('select * from patlogindetails WHERE Email = ?', [username], (err, results) => {
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
      console.log("Username: " + username + "\nPassword: " + password + "\nHashedPassw: " + user.Passw + "\n");
            
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
        res.end(JSON.stringify(user.PID));
      });
    });
  });
}

/**
 * Employee Creation
 */
else if (pathname === '/emp_signup' && req.method === 'POST'){
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    // Parse form data
    const formData = JSON.parse(body);
    const fname = formData.fname;
    const mname = formData.Mname;
    const lname = formData.Lname;
    const email = formData.email;
    const number = formData.number;
    const social = formData.ssn;
    const role = formData.role
    const gender = formData.gender;
    var eid = (formData.eid) ? formData.eid : 8009;
    var password = (formData.password) ? formData.password : "Password!";

    /*bcrypt.hash(password, 10, (err, hashedPassword) => {

      if (err) {
        console.log('\x1B[31Error while hashing password:', err);
        return;
      } password = hashedPassword; 
   }).then(pass => { 
    if(!formData.eid) {
      db.query('SELECT EID FROM EMPLOYEE', (err, results) => {
        eid = results[results.length - 1].EID+1;
      });
      password = pass;
    }
   }).then(passw, new_eid => {
    // Example MySQL query (if you're using a database)
    db.query('INSERT INTO EMPLOYEE (FName, MInitial, LName, Email, SSN, EID, Passw, PhoneNum, Role, Gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [fname, mname, lname, email, social, new_eid, passw, number, role, gender], (err, results) => {
    if (err) {
        console.error('Error storing data:', err);
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Internal Server Error');
    } else {
        console.log('Data stored successfully');
        res.writeHead(200, {'Content-Type': 'plain/text'});
        res.end(eid.toString());
        console.log(eid.toString());
    }
  });
   });*/
   bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.log('\x1B[31Error while hashing password:', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    } 
  
    password = hashedPassword;
  
    // If new employee, get new employee ID
    if (!formData.eid) {
      db.query('SELECT EID FROM EMPLOYEE', (err, results) => {
        if (err) {
          console.error('Error getting new employee ID:', err);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Internal Server Error');
          return;
        }
        eid = results[results.length - 1].EID + 1;
  
        // Insert data into EMPLOYEE table
        db.query('INSERT INTO EMPLOYEE (FName, MInitial, LName, Email, SSN, EID, Passw, PhoneNum, Role, Gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
          [fname, mname, lname, email, social, eid, password, number, role, gender], (err, results) => {
            if (err) {
              console.error('Error storing data:', err);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Internal Server Error');
              return;
            }
            console.log('Data stored successfully');
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(eid.toString());
            console.log(eid.toString());
          });
      });
    } else { // If existing employee, insert data directly
      db.query('INSERT INTO EMPLOYEE (FName, MInitial, LName, Email, SSN, EID, Passw, PhoneNum, Role, Gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [fname, mname, lname, email, social, formData.eid, password, number, role, gender], (err, results) => {
          if (err) {
            console.error('Error storing data:', err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
          }
          console.log('Data stored successfully');
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end(formData.eid.toString());
          console.log(formData.eid.toString());
        });
    }
  });
  
  });
/* Adding Employees to the table */
}
else if (req.method === 'POST' && req.url=== '/addEm') {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const data = JSON.parse(body);

    const {eid, fname, lname, email, gender, number, role } = data;
    // Insert data into MySQL table
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
}
/*Displaying Employees on the table */
else if (req.method === 'DELETE' && req.url.startsWith('/employees/')) {
  // Extract employee number from the URL
  const number = req.url.split('/')[2];
  // Delete the employee from the database
  db.query('DELETE FROM EMPLOYEE WHERE PhoneNum = ?', [number], (error, results) => {
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
  db.query('SELECT EID, FName, LName, Email, Gender, PhoneNum, Role FROM EMPLOYEE', (error, results, fields) => {
      if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
  });
}
/*Displaying Doctors */
else if (req.method === 'DELETE' && req.url.startsWith('/doc/')) {
  // Extract employee ID from the URL
  const id = req.url.split('/')[2];

  // Delete the employee from the database
  db.query('DELETE FROM EMPLOYEE WHERE EID = ?', [id], (error, results) => {
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
  db.query('SELECT EID, FName, LName, Contact, Gender, PhoneNum FROM DOCTOR', (error, results, fields) => {
      if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
  });
}
/*Add Doctors */
else if (req.method === 'POST' && req.url=== '/addDoc') {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const data = JSON.parse(body);

    const {eid, fname, lname, email, gender, number, role } = data;
    // Insert data into MySQL table
    db.query('INSERT INTO DOCTOR (EID, FName, LName, Contact, Gender, PhoneNum, Department) VALUES (?, ?, ?, ?, ?, ?, ?)', [eid, fname, lname, email, gender, number, role], (err, result) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error saving data' }));
        throw err;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Data saved successfully' }));
    });
  });
}
/*View Doctors */
else if (req.method === 'DELETE' && req.url.startsWith('/Sapp/')) {
  // Extract employee ID from the URL
  const id = req.url.split('/')[2];

  // Delete the employee from the database
  db.query('DELETE FROM EMPLOYEE WHERE EID = ?', [id], (error, results) => {
      if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
      } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Employee deleted successfully' }));
      }
  });
} else if (req.url === '/Sapp') {
  // Fetch employee details from MySQL database
  db.query('SELECT PATIENT_PID, FName, LName, Gender, Date, Time FROM APPOINTMENT', (error, results, fields) => {
      if (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(results));
  });
}
else {
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
}
});
/*Show Appointments in appointment tab*/

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
