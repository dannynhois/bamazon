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
        'Change Overhead Cost of Department'
      ],
      message: 'Select an action:'
    },
    {
      type: 'input',
      name: 'departmentID',
      message: 'Enter department ID:',
      when: function (answer) {
        return (answer.action === 'Change Overhead Cost of Department');
      },
      validate: function checkIsEmpty (input) {
        return Number.isInteger(parseInt(input));
      }
    },
    {
      type: 'input',
      name: 'cost',
      message: 'Enter new overhead cost:',
      when: function (answer) {
        return (answer.action === 'Change Overhead Cost of Department');
      },
      validate: function checkIsEmpty (input) {
        return Number.isInteger(parseInt(input));
      }
    }

  ]).then(response => {
    switch (response.action) {
      case 'View Product Sales by Department':
        showSalesByDepartment();
        break;
      case 'Change Overhead Cost of Department':
        changeOverheadCost(response.departmentID, response.cost);
        break;
      default:
    }
  });
}

function showSalesByDepartment () {
  var sqlQuery = `SELECT departments.department_id, departments.department_name, FORMAT(departments.overheadcosts,'C') as 'Overhead Cost', FORMAT(SUM(products.product_sales),'C') as 'Total Sales', FORMAT((SUM(products.product_sales) - departments.overheadcosts), 'C') as Profits
    FROM departments LEFT JOIN products ON departments.department_name = products.department_name
    GROUP BY departments.department_id;`;
  conn.query(sqlQuery, (err, res) => {
    console.table(res);
    promptForAction();
  });
}

function changeOverheadCost (departmentID, cost) {
  var sqlQuery = `UPDATE departments SET ? WHERE ?`;
  conn.query(sqlQuery,
    [
      {
        overheadcosts: cost
      },
      {
        department_id: departmentID
      }
    ], (err, res) => {
      // console.log(res);
      if (err) throw err;
      if (res.changedRows === 0) {
        console.log('FAILED to update overhead cost');
      } else {
        console.log('SUCCESSFULLY updated overhead cost');
      }
      promptForAction();
    });
}
