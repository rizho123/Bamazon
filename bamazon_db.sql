DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

use bamazon_db;

CREATE TABLE products (
	item_id INTEGER auto_increment NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(8,2) NOT NULL,
    stock_quantity INTEGER(10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox One S", "Video Games", 199.99, 200),
		("Resident Evil 2 (2019)", "Video Games", 24.99, 50),
        ("Samsung Gear S3 Frontier", "Electronics", 179.99, 35),
        ('TCL 65" 4k UHD TV with ROKU', "Electronics", 599.99, 80),
        ('VIZIO 65" 4k UHD TV', "Electronics", 649.99, 55),
        ("Frito Lay - Cheetos (12pk)", "FRESH", 7.49, 9123),
        ("Pringles (4pk)", "FRESH", 6.49, 8239),
        ("Corsair Void PRO RGB Headset", "Computers/Laptops/Accessories", 44.99, 932),
        ("Acer Nitro 5", "Computers/Laptops/Accessories", 429.99, 482);
        
SELECT * FROM products