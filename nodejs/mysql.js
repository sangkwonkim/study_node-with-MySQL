var mysql      = require('mysql');
var config = require("./config")
var db = config.database

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : db.password,
  database : 'opentutorials'
});
  
connection.connect();
  
connection.query('SELECT * FROM topic', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});
  
connection.end();