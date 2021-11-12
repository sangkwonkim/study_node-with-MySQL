// mysql 에 로그인할 때 사용하는 정보 
var mysql = require('mysql');
var dotenv = require('dotenv')
dotenv.config()

var db = mysql.createConnection({
    host     : 'localhost',
    user     : process.env.DATABASE_USERNAME,
    password : process.env.DATABASE_PASSWORD, 
    database : process.env.DATABASE_DATABASE 
});
db.connect();

module.exports = db; 