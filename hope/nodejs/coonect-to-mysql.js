var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "localhost", 
  user: "root",
  password: "Aa09120304072" 
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
