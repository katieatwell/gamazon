var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    startBamazon();
});

function startBamazon() {
    inquirer
        .prompt([{
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                { value: "view_inventory", name: "Inventory Menu" },
                { value: "add_to_inventory", name: "Add New Inventory" }
                // {value:"Find data within a specific range",
                // "Search for a specific song"
            ]

        }]).then(function(response) {
            switch (response.action) {
                case "view_inventory":
                    showItems();
                    break;
                case "add_to_inventory":
                    addInventory();
                    break;
            }

        });
}

function showItems() {
    inquirer
        .prompt([{
            name: "choice",
            type: "list",
            message: "Select from the following menu options:",
            choices: [
                "All Items",
                "Low Inventory"
            ]

        }]).then(function(response) {
            if (response.choice == "All Items") {
                connection.query("SELECT * FROM products", function(err, res) {
                    if (err) throw err;
                    // Log all results of the SELECT statement
                    else {
                        console.log("You may place an order for any of the items listed below:");
                        for (var i = 0; i < res.length; i++) {
                            console.log(" ");
                            console.log("ITEM ID: " + res[i].item_id + "| " + "ITEM NAME: " + res[i].item_name +
                                "| " + "ITEM PRICE: " + res[i].price + "| " + "ITEM DEPARTMENT: " + res[i].department_name + "| " +
                                "# IN STOCK: " + res[i].stock_quantity);
                        }

                    }
                    startBamazon();
                });

            }
            if (response.choice === "Low Inventory") {
                connection.query("SELECT stock_quantity, item_name, department_name FROM products", function(err, res) {
                    if (err) throw err;
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].stock_quantity <= 5) {
                            console.log("Low inventory alert for: " + res[i].item_name + " //Items left in stock: " + res[i].stock_quantity);
                        }
                    }
                })
            }

        });

}

function addInventory() {
    inquirer
        .prompt([{
                type: "input",
                name: "itemName",
                message: "Enter the product name here: "
            },
            {
                type: "input",
                name: "stockQuantity",
                message: "Enter the stock quantity here: "

            }
        ]).then(function(response) {
            var query = connection.query("INSERT INTO products SET ?", [{ item_name: response.itemName }, { stock_quantity: response.stockQuantity }], function(err, res) {
                console.log("You have added this item(s): " + res);
            })
        })

}
