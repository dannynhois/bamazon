var mysql = require('mysql');
var inquirer = require('inquirer');
require('console.table');

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'bamazon'
});

promptForAction();

function promptForAction () {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      choices: [
        'View Products For Sale',
        'View Low Inventory',
        'Add to Inventory',
        'Add New Product'
      ],
      message: 'Select an action:'
    },
    // prompts for adding to inventory
    {
      type: 'input',
      name: 'id',
      message: 'What is the item_id of the product you want to add inventory to:',
      when: function (answer) {
        return (answer.action === 'Add to Inventory');
      },
      validate: function checkForNumber (count) {
        return Number.isInteger(parseInt(count));
      }
    },

    // prompts for adding new product
    {
      type: 'input',
      name: 'productName',
      message: 'Enter product name:',
      when: function (answer) {
        return (answer.action === 'Add New Product');
      },
      validate: function checkIsEmpty (input) {
        return input !== '';
      }
    },
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter department name:',
      when: function (answer) {
        return (answer.action === 'Add New Product');
      },
      validate: function checkIsEmpty (input) {
        return input !== '';
      }
    },
    {
      type: 'input',
      name: 'price',
      message: 'Enter price of product:',
      when: function (answer) {
        return (answer.action === 'Add New Product');
      },
      validate: function checkForNumber (count) {
        return Number.isInteger(parseInt(count));
      }
    },
    // quantity prompt for both adds

    {
      type: 'input',
      name: 'quantity',
      message: 'How many items do you want to add:',
      when: function (answer) {
        return (answer.action === 'Add to Inventory' || answer.action === 'Add New Product');
      },
      validate: function checkForNumber (count) {
        return Number.isInteger(parseInt(count));
      }
    }
  ]).then(response => {
    switch (response.action) {
      case 'View Products For Sale':
        showProducts();
        break;
      case 'View Low Inventory':
        showLowInventory();
        break;
      case 'Add to Inventory':
        addInventory(response.id, response.quantity);
        break;
      case 'Add New Product':
        addProduct([response.productName, response.departmentName, response.price, response.quantity]);
        break;
      default:
    }
  });
}

function showProducts () {
  conn.query(`SELECT item_id, product_name, FORMAT(price, 'C') as price, stock_quantity FROM products`, (err, res) => {
    if (err) throw err;
    console.table('Products for sale', res);
    promptForAction();
  });
}

function showLowInventory () {
  conn.query(`SELECT item_id, product_name, FORMAT(price, 'C') as price, stock_quantity FROM products WHERE stock_quantity <=5`, (err, res) => {
    if (err) throw err;
    console.table('Low Inventory. Items with 5 or less quantity.', res);
    promptForAction();
  });
}

function addInventory (id, quantity) {
  var query = conn.query('UPDATE products SET stock_quantity = stock_quantity + ' + quantity + ' WHERE item_id = ' + id, function (err, res) {
    if (err) console.log('Quantity not updated');
    else { console.log('Quantity added'); }
    promptForAction();
  });
}

function addProduct (dataArray) {
  var query = conn.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?)', [dataArray], (err, results) => {
    if (err) console.log('Unable to add product')
    else {
      console.log('Product added.');
      addDepartment(dataArray[1]);
      promptForAction();
    }
  });
}

function addDepartment (department) {
  conn.query('INSERT IGNORE INTO departments(department_name, overheadcosts) VALUES(?,10000)',
[department], (err, res) => {
  // if (err) console.log(err);
});
}
