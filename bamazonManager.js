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

var DepartAndItems = "SELECT DISTINCT department_name FROM products; SELECT item_id, product_name FROM products;";

connect.query(DepartAndItems, function(error, response) {
    if (error) throw error
    response[1].forEach(r => items[r.product_name] = r.item_id)
    var depart = response[0]
    for (var i = 0; i < depart.length; i++) {
        departments.push(depart[i].department_name)
    }
})

var menuList = {
    "Add a New Product" : addProduct,
    "View Products for Sale": viewProducts,
    "Add to Inventory": addInventory,
    "View Low Inventory": viewLowInventory,
    "Exit Program": exit
};

var items = {}
var departments = []

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

function addProduct() {
    console.log("Product Details...\n")

    inquirer.prompt([
        {
            "type" : "input",
            "name" : "departmentNames",
            "message" : "What department will this product belong to?",
            "validate": validateInput
        },
        {
            "type" : "input",
            "name" : "productNames",
            "message" : "What's the product?",
            "validate": validateInput
        },
        {
            "type" : "input",
            "name" : "productPrices",
            "message" : "What's the cost(USD) of this product?",
            "validate": validateInput
        },
        {
            "type" : "input",
            "name" : "productStocks",
            "message" : "How many products are available?",
            "validate": validateInput
        }
    ]).then(function(response) {
        var departmentName = response.departmentNames
        var productName = response.productNames
        var productPrice = response.productPrices
        var productStock = response.productStocks

        var sql = 
            `INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES ("${productName}", "${departmentName}", ${productPrice}, ${productStock});`

        connect.query(sql, function(error, results) {
            if (error) throw error
            console.log(chalk.bgHex('FFB300').hex('FFFFFF')(productName + " was successfully added!"))
            setTimeout(menu, 2000);
        })
    })
}

function viewProducts() {
    console.log("Viewing products!")
    connect.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        console.log(chalk.bgHex("FFFFFF").hex('FFB300')("--------------------------------------------CATALOG--------------------------------------------"))

        var data = [
            ['ID', 'Product Name', 'Department', 'Price(USD)', '# of Stock']
        ];
        var output;

        for (var i = 0; i < results.length; i++) {
            data.push([results[i].item_id, results[i].product_name, results[i].department_name, "$" + results[i].price, results[i].stock_quantity])
        }
        output = table(data)
        console.log(output)
        setTimeout(menu, 1000);
    })
}

function addInventory() {
    console.log("Adding inventory!")
    inquirer.prompt([
        {
            "type" : "list",
            "name" : "productName",
            "message" : "Which product do you want to update?",
            "choices": Object.keys(items)
        },
        {
            "type" : "input",
            "name" : "updateStock",
            "message" : "How many do you want to add to the current inventory?",
            "validate": validateInput
        }
    ]).then(function(response) {
        var itemId = response.productName;
        var newStock = response.updateStock;

        var sql = 
            `UPDATE products SET stock_quantity=stock_quantity + ${newStock} WHERE product_name="${itemId}"`

        connect.query(sql, function(error, results) {
            if (error) throw error
            console.log(chalk.bgHex('FFB300').hex('FFFFFF')("Added " + newStock + " to the inventory."))
            setTimeout(menu, 1000);
        })
    })
}

function viewLowInventory() {
    console.log("Viewing low inventory!")

    var sql = 
        `SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE stock_quantity < 5 ORDER BY stock_quantity DESC`

    connect.query(sql, function (error, results) {
        if (error) throw error;

        console.log(chalk.bgHex("FFFFFF").red("--------------------------------------------Products with LOW INVENTORY--------------------------------------------"))

        var data = [
            ['ID', 'Product Name', 'Department', 'Price(USD)', '# of Stock']
        ];
        var output;

        for (var i = 0; i < results.length; i++) {
            data.push([results[i].item_id, results[i].product_name, results[i].department_name, "$" + results[i].price, results[i].stock_quantity])
        }
        output = table(data)
        console.log(output)
        setTimeout(menu, 1000);
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

function validateInput (input) {
        if (input !== null) {
            return true;
        } else {
            return "Can't be blank!"
        }
    }

function exit() {
    console.log(chalk.keyword("orange").bgHex("#626262")("Exited the console."))
    connect.end();
}

start ();