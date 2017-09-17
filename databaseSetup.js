var mysql = require('mysql');
var faker = require('faker');

// create mySql connection to create Database
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root'
});

// connect to database
connection.connect(err => {
  if (err) throw err;
  console.log('Connected to database');
  createDatabase();
});

function createDatabase () {
  // drop database if it is exist
  connection.query('DROP DATABASE IF EXISTS bamazon', (err, result) => {
    if (err) throw err;
    console.log('Database dropped');
    // create database - 'if not exists' included if drop database is removed
    connection.query('CREATE DATABASE IF NOT EXISTS bamazon', (err, result) => {
      if (err) throw err;
      console.log('Database created');
      connection.end((err) => {
        if (err) throw err;
        connection = mysql.createConnection({
          host: 'localhost',
          user: 'root',
          database: 'bamazon'
        });
        createProductTable();
      });
    });
  });
}

function createProductTable () {
  var queryString = `CREATE TABLE IF NOT EXISTS products(
    item_id INT(5) AUTO_INCREMENT,
    product_name VARCHAR(100),
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INT(10),
    product_sales DECIMAL(20,2) NOT NULL DEFAULT 0,
    PRIMARY KEY(item_id)
  );`;
  var q = connection.query(queryString, (err, result) => {
    if (err) throw err;
    // console.log(result);
    console.log('Created product table');
    createDepartmentTable();
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
    addDepartment(department);
  }
  connection.end(err => {
    if (err) throw err;
    console.log('Connection ended.');
  });
}

function createDepartmentTable () {
  var queryString = `CREATE TABLE IF NOT EXISTS departments(
    department_id INT(5) AUTO_INCREMENT,
    department_name VARCHAR(100) UNIQUE,
    overheadcosts DECIMAL(10,2),
    PRIMARY KEY(department_id)
  )`;
  connection.query(queryString, (err, result) => {
    if (err) throw err;
    // console.log(result);
    console.log('Created table');
    seedData();
  });
}

function insertNewProduct (dataArray) {
  // console.log('array passed: ', dataArray);
  var query = connection.query('INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?)', [dataArray], (err, results) => {
    if (err) throw err;
    // console.log('Data added: ', results);
  });
  // console.log(query.sql);
}

function addDepartment (department) {
  connection.query('INSERT IGNORE INTO departments(department_name, overheadcosts) VALUES(?,10000)',
[department], (err, res) => {
  // if (err) console.log(err);
});
}
