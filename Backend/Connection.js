const http = require("http");
const fs = require("fs");
const mysql = require("mysql2");

//const cors = require("cors");

const PORT = process.env.PORT || 8081;

var dat;

const pool = mysql.createPool({
    host: "healthx-server.mysql.database.azure.com", 
    user:"tvoumnlmnu", password:"4U22732E250EVZ38$", 
    database:"healthx", port:3306, 
    ssl:{
        ca:fs.readFileSync("DigiCertGlobalRootCA.crt.pem")
    }
})

const result = conn.query("SELECT * FROM doctor", (err, result, fields) => {
    if(err) throw err;
    dat = JSON.parse(JSON.stringify(result));

});


const server = http.createServer((req, res) => {
    if(req.url == "/" && req.method === "GET"){
        console.log(dat);
        
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("<h1>Route: GET</h1> <h2>URL: \"/\"</h2>");
        res.write("<p>" + JSON.stringify(dat) + "</p>");
        
        res.end();
    }
    else{
        res.statusCode = 404;
        res.setHeader("Content-Type", "text/html");
        res.end("<h1>WRONG TURN!</h1>");
    }   
});

server.listen(PORT, () => {console.log(`Listening on Port ${PORT}`)});

