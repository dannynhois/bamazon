var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var listOfItems = [];
var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'bamazon'
});

displayAll();

function displayAll () {
  conn.query('SELECT item_id, product_name, price FROM products', (err, result) => {
    if (err) throw err;
    listOfItems = [];
    result.forEach(item => {
      listOfItems.push(item.item_id);
    });
    console.table('Welcome to Bamazon!', result);
    promptForPurchase();
  });
}

function promptForPurchase () {
  inquirer.prompt([
    {
      type: 'input',
      name: 'item',
      message: 'Enter the item ID of the item you want to purchase:',
      validate: function checkForNumber (id) {
        return (listOfItems.indexOf(parseInt(id)) > -1);
      }
    },
    {
      type: 'input',
      name: 'quantity',
      message: 'Enter the number of quantity you want to purchase:',
      validate: function checkForNumber (count) {
        return Number.isInteger(parseInt(count));
      }
    }
  ]).then(response => {
    purchaseItem(parseInt(response.item), parseInt(response.quantity));
  });
}

// function purchaseItem (id, quantity) {
//   var query = conn.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantity + ', product_sales = product_sales + ' + +' WHERE ? AND ' + 'stock_quantity >' + quantity, [
//     {
//       item_id: id
//     }
//   ], function (err, res) {
//     if (err) throw err;
//
//     if (res.affectedRows > 0) {
//       conn.query(`SELECT price,product_name FROM products WHERE item_id = ${id}`, (err, res) => {
//         if (err) throw err;
//         console.log(`You purchased ${quantity} of ${res[0].product_name} at $${res[0].price} for a total of $${res[0].price * quantity}`);
//         // promptForPurchase();
//       });
//     } else {
//       conn.query(`SELECT stock_quantity,product_name FROM products WHERE item_id = ${id}`, (err, res) => {
//         if (err) throw err;
//         console.log(`Sorry we don't have ${quantity} of ${res[0].product_name} in stock. We have only ${res[0].stock_quantity} in stock.`);
//         // promptForPurchase();
//       });
//     }
//   });
// }

function purchaseItem (id, quantity) {
  var sqlQuery = `SELECT * FROM products WHERE ?`;
  conn.query(sqlQuery, {
    item_id: id
  }, (err, res) => {
    if (err) throw err;
    var item = res[0];
    // check if enough quantity
    if (item.stock_quantity < quantity) {
      console.log(`Sorry we don't have ${quantity} of ${item.product_name} in stock. We have only ${item.stock_quantity} in stock.`);
      displayAll();
    } else {
      // update database if enough quantity
      sqlQuery = `UPDATE products SET ? WHERE ?`;
      var q = conn.query(sqlQuery,
        [
          {
            stock_quantity: item.stock_quantity - quantity,
            product_sales: item.product_sales + (quantity * item.price)
          },
          {
            item_id: id
          }
        ], (err, res) => {
          if (err) throw err;
          console.log(`You purchased ${quantity} ${item.product_name} at $${item.price} for a total of $${item.price * quantity}`);
          displayAll();
        }
      );
    }
  });
}
