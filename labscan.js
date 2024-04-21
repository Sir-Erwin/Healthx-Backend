const http from 'http';
const mysql from 'mysql2';

// Create a MySQL connection
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

// Function to insert lab scan data
function insertLabScan(data, callback) {
  // Construct the SQL query to insert data into the table
  const sql = `INSERT INTO LAB_SCAN (RID, Type, File, LAB_ACTION_Lab_Tech_EID, LAB_ACTION_APPOINTMENT_AID) VALUES (?, ?, ?, ?, ?)`;

  // Data to be inserted
  const values = [data.RID, data.Type, data.File, data.LAB_ACTION_Lab_Tech_EID, data.LAB_ACTION_APPOINTMENT_AID];

  // Execute the query with the values
  connection.query(sql, values, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Lab scan data inserted successfully');
      callback(null, results);
    }
  });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/insertLabScan' && req.method === 'POST') {
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
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
