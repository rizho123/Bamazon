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

var menuList = {
    "Add a New Product" : addProduct,
    "View Products for Sale": viewProducts,
    "Add to Inventory": addInventory,
    "View Low Inventory": viewLowInventory,
    "Exit Program": exit
};

function menu() {
    inquirer.prompt([
        {
            "type" : "list",
            "name" : "menuOptions",
            "message" : "Select an option:",
            "choices": Object.keys(menuList)
        }
    ]).then(response => {
        menuList[response.menuOptions]();
    })
}

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
        menu();



})
}

function exit() {
    console.log(chalk.green.bgGrey("Exited the console."))
    connect.end();
}

start ();