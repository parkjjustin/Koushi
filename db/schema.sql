CREATE DATABASE praesus_db;
USE praesus_db;

CREATE TABLE burgers(
	id int NOT NULL AUTO_INCREMENT,
	burger_type varchar(255) NOT NULL,
	devoured BOOLEAN DEFAULT false,
	date timestamp DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (id)
);