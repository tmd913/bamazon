const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

function start() {
    inquirer
        .prompt([
            {
                name: "action",
                type: "list",
                choices: [
                    "View Products for Sale",
                    "View Low Inventory",
                    "Add to Inventory",
                    "Add New Product"
                ],
                message: "Choose an action:"
            }
        ])
        .then(function (answer) {
            switch (answer.action) {
                case "View Products for Sale":
                    viewProducts();
                    break;

                case "View Low Inventory":
                    viewLowInventory();
                    break;

                case "Add to Inventory":
                    addToInventory();
                    break;

                case "Add New Product":
                    addNewProduct();
                    break;

                default:
                    break;
            }
        });
}

function viewProducts() {
    connection.query(
        `SELECT * FROM products`,
        function (err, res) {
            console.log("--------------------");
            console.log("Products");
            console.log("--------------------");
            console.log(res);
        }
    );
    connection.end();
}

function viewLowInventory() {
    connection.query(
        `
        SELECT * 
        FROM products
        WHERE stock_quantity < 5 
        `,
        function (err, res) {
            console.log("--------------------");
            console.log("Low Inventory Products");
            console.log("--------------------");
            console.log(res);
        }
    );
    connection.end();
}

function addToInventory() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the product for which you would like to add inventory?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units would you like to add?"
            }
        ])
        .then(function (answer) {
            connection.query(
                `
                UPDATE products
                SET stock_quantity = stock_quantity + ${answer.units}
                WHERE item_id = ${answer.id}
                `,
                function (err, res) {
                    console.log("Inventory updated...");
                    connection.end();
                }
            );
        });
}

function addNewProduct() {
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the product?"
            },
            {
                name: "department",
                type: "list",
                choices: [
                    "Beauty & Health",
                    "Books & Audible",
                    "Clothing, Shoes & Jewelry",
                    "Electronics, Computers & Office",
                    "Home, Garden & Tools",
                    "Movies, Music & Games",
                    "Pet Supplies",
                    "Restaurants, Food & Grocery",
                    "Sports & Outdoors",
                    "Toys, Kids & Baby",
                    "Other"
                ],
                message: "What is the department name in which the product belongs?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of the product?"
            },
            {
                name: "stock",
                type: "input",
                message: "What is the stock quantity of the product?"
            }
        ])
        .then(function (answer) {
            // connection.query(
            //     `
            //     INSERT INTO products (product_name, department_name, price, stock_quantity)
            //     VALUES (${answer.name}, ${answer.department}, ${answer.price}, ${answer.stock})
            //     `,
            //     function (err, res) {
            //         console.log("New product added...");
            //         console.log(res);
            //         console.log(answer);
            //     }
            // );

            connection.query(
                `
                INSERT INTO products (product_name, department_name, price, stock_quantity)
                VALUES (?, ?, ?, ?)
                `,
                [
                    answer.name, 
                    answer.department, 
                    answer.price,
                    answer.stock
                ],
                function (err, res) {
                    console.log("New product added...");
                    console.log(res);
                    console.log(answer);
                    connection.end();
                }
            );
        });
}