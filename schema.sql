CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	item_id INTEGER AUTO_INCREMENT,
    product_name varchar(30),
    department_name varchar(30),
    price DECIMAL(5,2) NOT NULL,
    stock_quantity SMALLINT NOT NULL,
	PRIMARY KEY (item_id)
);