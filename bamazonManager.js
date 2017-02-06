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

const table = (res) => console.table(res);
const tableResults = (query, callback = table) => {
    connection.query(
        query,
        (err, res) => {
            if (err) throw err;
            else callback(res);
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
    inquirer.prompt([
        {
            type: 'input',
            name: 'itemID',
            message: 'Enter product id of the item you want to update.',
            validate: function (input) {
                if (!isNaN(input) && input.length > 0) {
                    return true;
                } else {
                    console.log('\n You must enter a valid item id')
                    return false;
                } 
            }
        },
         {
            type: 'input',
            name: 'quantity',
            message: "Enter the quantity you'd like to add to inventory.",
            validate: (input) => {
                if (!isNaN(input) && input.length > 0) {
                    return true;
                } else {
                    console.log('\n You must enter a valid quantity')
                    return false;
                } 
            }
        }
    ])
    .then((validatedInput) => {
        connection.query(`
            UPDATE products 
            SET stock_quantity = stock_quantity + ${Math.abs(parseInt(validatedInput.quantity))}
            WHERE item_id = ${validatedInput.itemID}`,
        (err, res) => {
            if (err) console.log(err);
            else console.log(
                `\nYou have successfully increased the inventory of ${validatedInput.itemID} by ${Math.abs(validatedInput.quantity)}.`
                );
        });
        connection.end();
    });
};

const addNewProduct = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'product_name',
            message: 'Enter product name.',
            validate: function (input) {
                if (input.length > 0) {
                    return true;
                } else {
                    console.log('\n You must enter a valid product name');
                    return false;
                } 
            }
        },
        {
            type: 'list',
            name: 'department_name',
            message: "Select the department.",
            choices: [
                'Health & Household',
                'Books',
                'Movies',
                'Tablets',
                'Audio'
            ]
        },
        {
            type: 'input',
            name: 'price',
            message: 'Input the price in dollars $[xx.xx]',
            validate: function(input) {
                if (/^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(input)) return true;
                else console.log('\nInvalid numeric value. Must be a decimal value to the hundreth place.');
            }
        },
        {
            type: 'input',
            name: 'stock_quantity',
            message: 'Input the quantity of the new item',
            validate: function(input) {
                if (!isNaN(input) && input.length > 0) {
                    return true;
                } else {
                    console.log('\n You must enter a valid quantity')
                    return false;
                } 
            }
        }
    ]).then((newItem) => {
        connection.query(`
        INSERT INTO products (product_name, department_name, price, stock_quantity)
        VALUES ('${newItem.product_name}', '${newItem.department_name}', ${parseFloat(newItem.price)}, ${parseInt(newItem.stock_quantity)});`,
        (err, res) => {
            if (err) console.log(err);
            else console.log(`You have added ${newItem.stock_quantity} ${newItem.product_name}(s) into the inventory.`);
        });
        connection.end();
    });
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

(() => {
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
})();