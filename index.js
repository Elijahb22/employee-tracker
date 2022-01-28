const inquirer = require('inquirer');
const mysql = require('mysql2');
const consolet = require('console.table');
const db = require('./db/connection');

// initalize the app
db.connect(function (err) {
    if (err) throw err;
    console.log(`Employee Tracker`);
    init();
});


