/*const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  let filePath = '.' + req.url; // Construct the file path based on the request URL

  // If the request URL is '/', serve index.html by default
  if (filePath === './') {
    filePath = './index.html';
  }

  
  // Determine the content type based on the file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    // Add other content types as needed
  }[extname] || 'application/octet-stream';

  // Check if the requested file exists
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // If the file doesn't exist, return a 404 response
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('File not found');
    } else {
      // Determine the content type based on the file extension
      const contentType = getContentType(filePath);
      
      // Serve the file with the appropriate content type
      res.writeHead(200, {'Content-Type': contentType});
      res.end(data);
    }
  });
});

// Function to determine the content type based on the file extension
function getContentType(filePath) {
  const extname = path.extname(filePath);
  switch (extname) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'text/javascript';
    default:
      return 'text/plain';
  }
}

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';
    if (extname === '.css') {
        contentType = 'text/css';
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File not found
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                // Server error
                res.writeHead(500);
                res.end('500 Internal Server Error: ' + err.code);
            }
        } else {
            // Successful response
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
