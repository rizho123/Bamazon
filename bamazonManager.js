require("dotenv").config()

var figlet = require("figlet");
var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var {table} = require("table");


var connect = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: process.env.USERID,
    password: process.env.USERPW,
    database: "bamazon_db",
    multipleStatements: true
})

connect.connect(function (error) {
    if (error) throw error
})

function start () {
    figlet("Bamazon", {
        font: "alligator2",
        horizontalLayout: "full",
        verticalLayout: "default"
    }, function(error, data) {
        if (error) {
            console.log(chalk.bgRed.bold.yellow("ERROR - loading title."))
            console.log(error)
            return;
        }
        console.log(chalk.keyword('orange')(data))
        console.log(chalk.bgHex('FFB300').hex('FFFFFF')("--------------------------------" + chalk.bgHex("FFFFFF").black("[MANAGER-CONSOLE]") + "--------------------------------"))
        console.log(chalk.hex('FFB300')("----------------------------------[" + chalk.bgHex('FFB300').hex('FFFFFF')("Richard Zhou") + "]---------------------------------\n"))



})
}

start ();