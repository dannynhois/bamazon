# Bamazon

An Amazon-like storefront with MySQL and a command line interface. A customer will be able to purchase items. A manager will be able manage inventory. A supervisor will be able to view revenue information.

## 

## Getting Started

`node databaseSetup.js` - create the bamazon database along with the necessary tables.

![database setup](images/databaseSetup.png?raw=true)

`node bamazonCustomer.js` - purchase items.

![database setup](images/bamazonCustomer.png?raw=true)

`node bamazonManager.js` - view prodcuts, update inventory,  or add new products.

![database setup](images/bamazonManagerProductSale.png?raw=true)
![database setup](images/bamazonManagerLowInventory.png?raw=true)
![database setup](images/bamazonManagerAddInventory.png?raw=true)
![database setup](images/bamazonManagerAddProduct.png?raw=true)

`node bamazonSupervisor.js` - view sales information.

![database setup](images/bamazonSupervisorSales.png?raw=true)
![database setup](images/bamazonSupervisorOHCost.png?raw=true)


### Prerequisites

Need to be installed prior to using

* NodeJS
* MySQL
* npm

### Installation

Clone repository and then run `npm install`


## Built With

* [MySQL](https://github.com/mysql/mysql-js) - Used to store product information.
* [Faker](https://github.com/Marak/faker.js/tree/master/.npm/package) - Used to seed database with fake data.
* [inquirer](https://github.com/SBoudrias/Inquirer.js/) - Used to provide user with command-line interface.
* [console.table](https://github.com/bahmutov/console.table) - Used to provide user with command-line interface.

## Authors

Danny Nhoisaykham 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone who posted on stackoverflow

