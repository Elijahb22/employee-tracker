const inquirer = require('inquirer');
const consoleT= require('console.table');
const mysql = require('mysql2')

const connection = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'calofduty1)',
      database: 'employee-tracker'
    },
    console.log('Connected to employee-tracker database')
);
// initalize the app
connection.connect(function (err) {
    if (err) throw err;
    console.log(`Employee Tracker`);
    init();
});
// Views all the employess 
function viewAllEmployees() {
    connection.query(
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
    connection.query(`SELECT * FROM roles;`, (err, data) => {
        if (err) throw err;
        const rolesArray = data.map((roles) => {
          return { name: roles.title, value: roles.id };
        });
        
        connection.query(`SELECT * FROM employee;`, (err, data) => {
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
                message: "Please select the employee's roles",
                choices: rolesArray,
                name: "roles"
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
// Update an employees' role
function updateEmployeeRole() {
    connection.query(`SELECT * FROM roles;`, (err, data) => {
      if (err) throw err;
      const rolesArray = data.map((role) => {
        return { name: role.title, value: role.id };
      });
  
      connection.query(`SELECT * FROM employee;`, (err, data) => {
        if (err) throw err;
        const employeeArray = data.map((employee) => {
          return { name: `${employee.first_name} ${employee.last_name}`, value: employee.id };
        });
  
        const noneOption = { name: "None", value: null };
        const managerArray = employeeArray.concat(noneOption);
  
        inquirer
          .prompt([
            {
              type: "list",
              message: "Which employee would you like to update?",
              name: "employee",
              choices: employeeArray
            },
            {
              type: "list",
              message: "Which role would you like to assign the employee?",
              name: "roles",
              choices: rolesArray
            },
            {
              type: "list",
              message: "Please select the employee's new manager",
              choices: managerArray,
              name: "manager"
            }
          ])
          .then(({ employee, role, manager }) => {
            connection.query(
           `UPDATE employee
            SET roles_id = ?, manager_id = ?
            WHERE id = ?;`, 
            [role, manager, employee], (err, data) => {
              if (err) throw err;
              console.log("Employee's roles has been updated!");
              init();
            });
          });
      });
    });
};
// View all roles
function viewRoles() {
    connection.query(
   `SELECT r.id, r.title, r.salary, d.name as 'Department'
    FROM role r
    LEFT JOIN department d
        on r.department_id = d.id;`,
      (err, data) => {
      if (err) throw err;
      console.table(data);
      init();
    });
};
  
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

        .then(({ userMenu }) => {
            switch (userMenu) {
                case "View All Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Update Employee's Role & Manager":
                    updateEmployeeRole()
                    break;
            }
        })
    
}

