const mysql = require('mysql2');
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'calofduty1)',
      database: 'employee-tracker'
    },
    console.log('Connected to employee-tracker database')
)

module.exports = db; 