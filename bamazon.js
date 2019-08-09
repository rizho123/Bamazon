var figlet = require("figlet");
var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var table = require("table");

var connect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db",
    multipleStatements: true
})





function validateInput(value) {
    var int = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    if (int && (sign === 1)) {
        return true;
    } else {
        console.log("Please enter a number greater than 0!")
        return;
    }
}