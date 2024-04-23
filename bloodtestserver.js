import http from 'http';
import mysql from 'mysql2';
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

// Function to insert blood test results
function insertBloodTestResults(data, callback) {
  // Construct the SQL query to insert data into the table
  const sql = `INSERT INTO BLOOD_CNT_TST_RSLT (RID, RedCellBloodCount, WhiteCellBloodCount, PlateletCount, MeanCorpuscularVolume, HemoglobinTest, HematocritTest, EnzymeMarker, LipoproteinPanel, PregnancyTest, AmmoniaTest, CO2Test, CoagulationTests) VALUES (${data.RID}, ${data.RedCellBloodCount}, ${data.WhiteCellBloodCount}, ${data.PlateletCount}, ${data.MeanCorpuscularVolume}, ${data.HemoglobinTest}, ${data.HematocritTest}, ${data.EnzymeMarker}, ${data.LipoproteinPanel}, ${data.PregnancyTest}, ${data.AmmoniaTest}, ${data.CO2Test}, ${data.CoagulationTests})`;

  // Execute the query
  connection.query(sql, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Blood test results inserted successfully');
      callback(null, results);
    }
  });
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/insertBloodTestResults' && req.method === 'POST') {
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
