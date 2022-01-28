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
// Adds an employee
function addEmployee() {
    db.query(`SELECT * FROM roles;`, (err, data) => {
        if (err) throw err;
        const rolesArray = data.map((roles) => {
          return { name: roles.title, value: roles.id };
        });
        
        db.query(`SELECT * FROM employee;`, (err, data) => {
          if (err) throw err;
          const employeeArray = data.map((employee) => {
            return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id };
          });
    
          const noneOption = { name: "None", value: null };
          employeeArray.push(noneOption);
    
          inquirer
            .prompt([
              {
                type: "input",
                message: "What is the employee's first name?",
                name: "firstName"
              },
              {
                type: "input",
                message: "What is the employee's last name?",
                name: "lastName"
              },
              {
                type: "list",
                message: "Please select the employee's role",
                choices: rolesArray,
                name: "role"
              },
              {
                type: "list",
                message: "Please select the employee's manager",
                choices: employeeArray,
                name: "manager"
              }
            ])
            .then(({ firstName, lastName, roles, manager }) => {
              connection.query(
                `INSERT INTO employee (first_name, last_name, roles_id, manager_id)
                 VALUE (?, ?, ?,?);`,
                [firstName, lastName, roles, manager],
                (err, data) => {
                  if (err) throw err;
                  console.log("Employee was added!");
                  init();
                }
              );
            });
        });
    });
}
function init(){
    inquirer
        .prompt([
            {
                type: "list",
                name: "userMenu",
                message: "What would you like to do?",
                choices: ["View All Employees", "Add Employee", "Update Employee's Role & Manager", "View All Roles", "Add Role", "View All Departments", "Add Department", new inquirer.Separator(), "Quit", new inquirer.Separator()]
            }
        ])
}

