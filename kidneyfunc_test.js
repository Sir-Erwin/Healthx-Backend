const http = require('http');
const mysql = require('mysql2');
const url = require('url');

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

function insertKidneyFuncTestResults(data, callback) {
  let values = '';
  data.forEach((row, index) => {
    values += `(${row.RID}, ${row.Sodium}, ${row.Chloride}, ${row.Bicarbonate}, ${row.Urea}, ${row.Creatinine}, ${row.eGFR}, ${row['Anion Gap']}, ${row.Bilirubin})`;
    if (index !== data.length - 1) {
      values += ', ';
    }
  });

  const sql = `INSERT INTO KIDNEY_FUNC_TEST_RESULT (RID, Sodium, Chloride, Bicarbonate, Urea, Creatinine, eGFR, \`Anion Gap\`, Bilirubin) VALUES ${values}`;

  connection.query(sql, (error, results) => {
    if (error) {
      callback(error, null);
    } else {
      console.log('Kidney function test results inserted successfully');
      callback(null, results);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/insertKidneyFuncTestResults' && req.method === 'POST') {
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
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
