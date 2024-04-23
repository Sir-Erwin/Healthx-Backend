else if (pathname === '/cancel_app' && req.method === 'POST'){
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
      // Parse form data
      const formData = JSON.parse(body);
      const fname = formData.fname;
      const lname = formData.lname;
      const gender = formData.gender;
      const date = formData. date;
      const email = formData.email;
      const time = formData.time;

      //var eid = (formData.eid) ? formData.eid : 8009;
      //var password = (formData.password) ? formData.password : "Password!";
  
      //bcrypt.hash(password, 10, (err, hashedPassword) => {
  
        if (err) {
          console.log('\x1B[31Error while hashing password:', err);
          return;
        } password = hashedPassword; 
     }).then(pass => { 
      
        if(!formData.aid) {
        db.query('SELECT AID FROM APPOINTMENT', (err, results) => {
          aid = results[results.length - 1].AID+1;
        });
        //password = pass;
      }
     }).then(passw, new_aid => {
      // Example MySQL query (if you're using a database)
      db.query('DELETE FROM APPOINTMENT (FName, LName, Gender, Date, Email, Time) VALUES (?, ?, ?, ?, ?, ?)', 
      [fname, mname, lname, gender,email, date, time], (err, results) => {
        
        if (err) {
          console.error('Error storing data:', err);
          res.writeHead(500, {'Content-Type': 'text/plain'});
          res.end('Internal Server Error');
        } 
      else {
          console.log('Data stored successfully');
          res.writeHead(200, {'Content-Type': 'plain/text'});
          res.end(eid.toString());
          console.log(eid.toString());
        }
     });
     });