require ('console.table');
const mysql = require('mysql');
const inquirer = require('inquirer');
const choicesArray = [
    'View Products for Sale',
    'View Low Inventory',
    'Add to Inventory',
    'Add New Product'
];
// Create SQL connection
const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "userDB",
	password: "",
	database: "Bamazon"
});

const tableResults = (query) => {
    connection.query(
        query,
        (err, res) => {
            if (err) throw err;
            else console.table (res);
        }
    );
    connection.end();
}

const viewProducts = () => {
    tableResults(`
        SELECT item_id, product_name, price, stock_quantity
        FROM products;`
    );
};

const viewLowInventory = () => {
      tableResults(`
        SELECT item_id, product_name, price, stock_quantity
        FROM products
        WHERE stock_quantity < 5;`
    );
};

const addInventory = () => {

};

const addNewProduct = () => {

};

const determineSelection = (viewSelection) => {
    switch (viewSelection) {
        case choicesArray[0]:
            return viewProducts();
        case choicesArray[1]:
            return viewLowInventory();
        case choicesArray[2]:
            return addInventory();
        case choicesArray[3]:
            return addNewProduct();
        default:
            console.log("Welp, this doesn't make sense.");
    }
};

const init = () => {
    inquirer.prompt([
            {
                type: 'list',
                name: 'viewSelection',
                message: 'Select your option below.',
                choices: choicesArray
            },
            
        ]).then((input)=> {
            determineSelection(input.viewSelection);
        });
}

init();