DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;
-- Table for products
CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  stock_quantity INT NULL DEFAULT true,
  PRIMARY KEY (item_id)
);
-- testing inserts
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES ("dog_bone", "10", "pets", "20");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES ("cat_nip", "2", "pets", "10");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("dog_hedgehog", "11", "pets", "5");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("dog_ball", "4", "pets", "20");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("cat_costume", "17", "pets", "3");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("dog_bed", "33", "pets", "7");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("cat_ferret_toy", "7", "pets", "10");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("dog_collar", "15", "pets", "15");
INSERT INTO products (item_name, price, department_name, stock_quantity)
VALUES("dog_bandana", "10", "pet_toys", "5");

