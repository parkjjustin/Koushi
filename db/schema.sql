create database koushi_db;

USE koushi_db;

create table users(
id int(255) auto_increment not null,
first_name varchar(255) not null,
last_name varchar(255) not null,
email varchar(255) not null,
password varchar(255) not null,
primary key(id)
)