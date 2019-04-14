var mysql = require("mysql");
var inquirer = require('inquirer');

var con = mysql.createConnection({
    host: 'localhost',
    port: '8889',
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

var purhcased;
var itemQty;
var price;

function displayInv() {
    con.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + "$" + res[i].price + " | " + res[i].stock_quantity);
        }
    });
}

function chooseItem() {
    inquirer.prompt([{
        name: 'itemId',
        type: 'input',
        message: 'Choose an item ID that you would like to purchase.'
    }, {
        name: 'amount',
        type: 'input',
        message: 'How many units would you like to purchase?'
    }
    ]).then((answers) => {
        console.log("Answer received!");
        purhcased = parseFloat(answers.itemId)
        itemQty = parseFloat(answers.amount)
        var newQuery = "SELECT * FROM products WHERE item_id=" + purhcased;
        con.query(newQuery, function (err, result) {
            var itemName = result[0].product_name
            var stock = parseFloat(result[0].stock_quantity);
            price = parseFloat(result[0].price);


            if (stock == 0 || stock < itemQty) {
                console.log("Insufficient quantity!");
            } else {
                var finalStockAmount = stock - itemQty
                var stockString = finalStockAmount.toString();
                var updateQuery = "UPDATE products SET stock_quantity=" + stockString + " WHERE item_id = " + purhcased;
                con.query(updateQuery, function (err, response) {
                    console.log("You've spent $" + price * itemQty + " on " + itemName);
                });
            }

        });
    });
}


con.connect(function (err) {
    if (err) console.log(err)
    console.log(`connected as id ${con.threadId}`);
    displayInv();
    chooseItem();
});