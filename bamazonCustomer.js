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
    connection.query(
        `SELECT * FROM products`,
        function (err, res) {
            console.log("--------------------");
            console.log("Products");
            console.log("--------------------");
            console.log(res);
            placeOrder();
        }
    );
});

function placeOrder() {
    inquirer
        .prompt([
            {
                name: "id",
                type: "input",
                message: "What is the ID of the product you would like to buy?"
            },
            {
                name: "units",
                type: "input",
                message: "How many units of the product would you like to buy?"
            }
        ])
        .then(function (answer) {
            connection.query(
                `
                SELECT * 
                FROM products 
                WHERE item_id = ${answer.id}
                `,
                function (err, res) {
                    console.log("--------------------");
                    console.log("Purchased product");
                    console.log("--------------------");
                    console.log(res);

                    if (res[0].stock_quantity >= answer.units) {
                        console.log("--------------------");
                        console.log("Total cost of purchase");
                        console.log("--------------------");
                        console.log(`$${res[0].price * answer.units}`);
                        connection.query(
                            `
                            UPDATE products
                            SET stock_quantity = ${res[0].stock_quantity - answer.units}
                            WHERE item_id = ${answer.id}
                            `,
                            function (err, res) {}
                        );
                    } else {
                        console.log(`There is an insufficient stock quantity to fill your order`);
                    }
                }
            );
        });
}