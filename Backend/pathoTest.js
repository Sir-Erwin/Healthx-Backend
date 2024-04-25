const http from 'http';
const mysql from 'mysql2';
const url = require('url');

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

// Function to insert pathological test results
function insertPathologicalTestResults(data, callback) {
  // Construct the SQL query to insert data into the table
  const sql = `INSERT INTO PATHOLOGICAL_TEST (RID, \`Name Of Test\`, Marge, PValue) VALUES ?`;

  // Data to be inserted
  const values = [
    [data[0].RID, data[0]['Name Of Test'], data[0].Marge, data[0].PValue],
    [data[1].RID, data[1]['Name Of Test'], data[1].Marge, data[1].PValue],
    [data[2].RID, data[2]['Name Of Test'], data[2].Marge, data[2].PValue],
    [data[3].RID, data[3]['Name Of Test'], data[3].Marge, data[3].PValue]
  ];

  // Execute the query with the values
  connection.query(sql, [values], (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Pathological test results inserted successfully');
      callback(null, results);
    }
  });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/insertPathologicalTestResults' && req.method === 'POST') {
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
