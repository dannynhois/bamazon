var mysql = require('mysql');
var faker = require('faker');

// create mySql connection
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'bamazon'
});

// connect to database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to database');

  /*
  // create database if it doesn't exist
  connection.query('CREATE DATABASE IF NOT EXISTS bamazon', (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log('Database created');
  });
  */

  // create table if it doesn't exist
  createTable();
  seedData();
});

function createTable () {
  var queryString = `CREATE TABLE IF NOT EXISTS products(
    item_id INT(5) AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INT(10),
    PRIMARY KEY(item_id)
  )`;
  connection.query(queryString, (err, result) => {
    if (err) throw err;
    console.log(result);
    console.log('Created table');
  });
}

function seedData () {
  var item;
  for (var i = 0; i < 10; i++) {
    var productName = faker.commerce.productName();
    var department = faker.commerce.department();
    var price = faker.commerce.price();
    var quantity = 10;
    item = [productName, department, price, quantity];
    insertNewProduct(item);
  }
}

function insertNewProduct (dataArray) {
  console.log('array passed: ', dataArray);
  var query = connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?)', [dataArray], (err, results) => {
    if (err) throw err;
    console.log('Data added: ', results);
  });
  console.log(query.sql);
}
