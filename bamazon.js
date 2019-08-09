require("dotenv").config()

var figlet = require("figlet");
var inquirer = require("inquirer");
var mysql = require("mysql");
var chalk = require("chalk");
var {table} = require("table");

function title() {
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
    console.log(chalk.bgHex('FFB300').hex('FFFFFF')("--------------------------------Welcome to Bamazon!-----------------------------"))
    console.log(chalk.bgHex('FFB300').hex('FFFFFF')("------------------------------------Richard Zhou--------------------------------"))
})
}
title()


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

function start() {
    connect.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        console.log(chalk.bgHex("FFB300").hex('FFFFFF')("-------------------------------------------CATALOG---------------------------------------------\n"))

        var data = [
            ['ID', 'Product Name', 'Department', 'Price(USD)', '# of Stock']
        ];
        var output;

        for (var i = 0; i < results.length; i++) {
            data.push([results[i].item_id, results[i].product_name, results[i].department_name, "$" + results[i].price, results[i].stock_quantity])
        }
        output = table(data)
        console.log(output)
        buy()
    })
}

function buy() {
    inquirer.prompt([{
        type: "input",
        name: "item_id",
        message: "Enter the ID of the Product you wish to purchase!",
        validate: validateInput,
        filter: Number
    },
    {
        type: "input",
        name: "quantity",
        message: "How many did you want to purchase?",
        validate: validateInput,
        filter: Number
    }
]).then(function (input) {
    var item = input.item_id;
    var quantity = input.quantity;

    connect.query("SELECT * FROM products WHERE ?", {
        item_id: item}, function (error, data) {
            if (error) throw error;
            if (data.length === 0) {
                console.log(chalk.bgRed.bold.yellow("ERROR - Invalid item ID"))
                start();
            } else {
                var product = data[0];
                if (quantity <= product.stock_quantity) {
                    console.log(chalk.bgGreen.white("Your order has been processed!"));
                    connect.query("UPDATE products SET stock_quantity = " + (product.stock_quantity - quantity) + " WHERE item_id = " + item, function(error,data) {
                        if (error) throw error;
                        console.log(chalk.green("Your total is $" + (product.price * quantity)))
                        console.log(chalk.hex("FFB300")("Thank you for shopping with us today!"))
                        connect.end();
                    })
                } else {
                    console.log(chalk.bgYellow.black.bold("Sorry! Not enough in stock to fufill your order."))
                    start();
                }
            }
        }
    )
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

start();