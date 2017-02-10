const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const db = require("../models");

module.exports = (app) => {
    app.get("/", (request, response) => {
        response.render("index");
    });

    app.get("/login", (request, response) => {
        response.render("login");
    });

    app.get("/register", (request, response) => {
        response.render("register");
    });

    app.get("/user/profile", (request, response) => {
        db.users.findAll({
            order: [
                ["id"]
            ]
        }).then(function(content) {
            let hbsObject = {
                content: content
            };
            response.render("user", hbsObject);
        });
    });


    app.post("/register", (request, response) => {
        let properFirst = request.body.first_name.substr(0, 1).toUpperCase() + request.body.first_name.substr(1, request.body.first_name.length);
        let properLast = request.body.last_name.substr(0, 1).toUpperCase() + request.body.last_name.substr(1, request.body.last_name.length);
        db.users.create({
            first_name: properFirst,
            last_name: properLast,
            email: request.body.email,
            password: request.body.password
        }).then(function(content) {
            response.redirect("/register");
        });
    });

// Passport.js
};