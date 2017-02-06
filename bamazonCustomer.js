require ('console.table');
const mysql = require('mysql');
const inquirer = require('inquirer');


// Create SQL connection
const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "userDB",
	password: "",
	database: "Bamazon"
});

connection.query('Select * FROM products', (err, res) => {
    if (err) console.log(err);
    else {
        console.table(res);
        promptUserSelection();
    }
});

const placeOrder = (orderObject, itemQuery) => {
    connection.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - ${orderObject.quantity}
        WHERE item_id = ${orderObject.itemID}`,
    (err, res) => {
        if (err) console.log(err);
        else {
            console.log(
                'Order Complete\n',
                '--------------\n',
                `You purchased ${orderObject.quantity} ${itemQuery.product_name}(s) for $${itemQuery.price * orderObject.quantity}!`
            );
            connection.end();
        } 
    });
};


const validateOrder = (orderObject) => {
    connection.query(`
        SELECT * FROM products
        WHERE item_id = ${orderObject.itemID}`,
    (err, res) => {
        if (err) console.log(err);
        else if (res.length > 0) {
            if (res[0].stock_quantity > orderObject.quantity) {
                placeOrder(orderObject, res[0]);
            } else console.log('Insufficient Quantity');
        } else console.log('Invalid ID');
    });
};

const promptUserSelection = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'itemID',
            message: 'Enter product id of the item you want to purchase.',
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
            message: "Enter the quantity you'd like to purchase.",
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
    .then(
        (validatedInput) => validateOrder(validatedInput)
    );
};
