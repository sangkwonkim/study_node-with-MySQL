// mysql 에 로그인할 때 사용하는 정보 
var mysql = require('mysql');
var config = require("../config")
var sqldata = config.database

var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : sqldata.password,
    database : sqldata.database
});
db.connect();

module.exports = db;  