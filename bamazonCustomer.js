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
                { value: "view_inventory", name: "View inventory" },
                { value: "select_item_for_purchase", name: "Select an item to purchase" }
                // {value:"Find data within a specific range",
                // "Search for a specific song"
            ]

        }]).then(function(response) {
            switch (response.action) {
                case "view_inventory":
                    showItems();
                    break;
                case "select_item_for_purchase":
                    placeOrder();
                    break;
            }

        });
}

function showItems() {
    inquirer
        .prompt([{
            name: "choice",
            type: "list",
            message: "Would you like to view all items or a specific item?",
            choices: [
                "All Items",
                "Specific Items"
            ]

        }]).then(function(response) {
            if (response.choice == "Specific Items") {
                connection.end();
            }
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

        });

}

function placeOrder() {
    inquirer
        .prompt([{
                type: "input",
                message: "Please indicate what you would like to order by typing in the item's unique ID here:",
                name: "itemID"
            },
            {
                type: "input",
                message: "How many of these items do you need?",
                name: "desiredQuantity",

            }
        ]).then(function(response) {
            var query = connection.query("SELECT stock_quantity, price FROM products WHERE ?", { item_id: response.itemID }, function(err, res) {
                if (err) throw err;

                var selectedItem = response.itemID;
                var selectedQuantity = response.desiredQuantity;
                var newStockQuantity = res[0].stock_quantity - response.desiredQuantity;
                var displayPrice = selectedQuantity * res[0].price;
                console.log("YOUR PRICE: " + displayPrice);
                if (response.desiredQuantity <= res[0].stock_quantity) {
                    updateInventory();

                    function updateInventory() {
                        var query = connection.query("UPDATE products SET ? WHERE ?", [{ stock_quantity: newStockQuantity }, { item_id: selectedItem }], function(err, res) {
                            if (err) throw err;
                            console.log(res.affectedRows + " product(s) were updated!");
                            console.log("The stock for this item is now: " + newStockQuantity);
                            startBamazon();
                        });
                    }

                }
                else {
                    console.log("There isn't enough left in stock for this purchase. Refer to our inventory list and try a different quantity.");
                    startBamazon();
                }

            })
        });

}
