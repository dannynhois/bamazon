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
        'View Product Sales by Department',
        'Create New Department'
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
      case 'View Product Sales by Department':
        showSalesByDepartment();
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

function showSalesByDepartment () {
  console.log('here');
  var sqlQuery = `SELECT department_name, SUM(product_sales) as total_sales FROM products GROUP BY department_name`;
  conn.query(sqlQuery, (err, res) => {
    console.table(res);
  });
}
