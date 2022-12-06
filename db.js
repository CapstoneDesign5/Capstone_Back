const mysql = require('mysql');
// db 연결 
const client = mysql.createConnection({
    host : '127.0.0.1',
    port : 3306,
    user : 'capstone',
    password : '1234',
    database : 'capstone_design',
    dateStrings: 'date'
});

module.exports = client;