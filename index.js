const inquirer = require('inquirer');
const mysql = require('mysql2');
const consolet = require('console.table');
const db = require('./db/connection');
const { connect } = require('./db/connection');
const { left } = require('inquirer/lib/utils/readline');

// initalize the app
db.connect(function (err) {
    if (err) throw err;
    console.log(`Employee Tracker`);
    init();
});
// Views all the employess 
function viewAllEmployees() {
    db.query(
        `SELECT CONCAT(e.first_name, e.last_name) AS 'Employee Name', rs.title AS 'Role', rs.salart AS 'Salary', IFNULL(CONCAT(m.first_name, m.last_name), 'N/A') as 'Manager Name'
        FROM employee e 
        LEFT JOIN employee m ON e.manager_id = m.manager_id
        INNER JOIN roles rs ON rs.id = e.roles_id`,
        (err, data) => {
            if (err) throw err;
            console.table(data)
            init();
        }
    );
};

