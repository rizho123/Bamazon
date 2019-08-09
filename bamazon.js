require("dotenv").config()

var figlet = require("figlet");
var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var table = require("table");

var connect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.USERID,
    password: process.env.USERPW,
    database: "bamazon_db",
    multipleStatements: true
})

console.log(process.env.USERID)


connect.connect(function (error) {
    if (error) throw error
    validateInput()
})

figlet("Bamazon", {
    font: "alligator2",
    horizontalLayout: "default",
    verticalLayout: "default"
}, function(error, data) {
    if (error) {
        console.log(chalk.bgRed.bold.yellow("ERROR - loading title."))
        console.log(error)
        return;
    }
    console.log(chalk.keyword('orange')(data))
    console.log(chalk.bgHex('FFB300').hex('FFFFFF')("Welcome to Bamazon!"))
    console.log(chalk.bgHex('FFB300').hex('FFFFFF')("-------------------------------------------Richard Zhou-------------------------------------------"))
})

function start() {
    connect.query("SELECT * FROM products", function (error, data) {
        if (error) throw error;

        console.log(chalk.bgHex("FFB300").hex('FFFFFF')("-------------------------------------------CATALOG-------------------------------------------"))
    })
}




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

connect.end();