const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'hotel',
    port: 3306,
    multipleStatements: true
})
module.exports = db