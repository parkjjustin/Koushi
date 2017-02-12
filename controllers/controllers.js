const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();
const db = require("../models");
const bcrypt = require('bcryptjs');
const path = require("path");

module.exports = (app) => {
    app.get("/", (request, response) => {
        response.render("index");
    });

    app.get("/login", (request, response) => {
        response.render("login");
    });

    app.get("/signup", (request, response) => {
        response.render("signup");
    });
    
    app.post('/login', passport.authenticate('local-signIn',
       {  successRedirect: '/profile',
       failureRedirect: '/',
       failureFlash: true
   }
   ));

    app.get("/profile", isLoggedIn, (request, response) => {
        db.users.findOne({}).then(function(content) {
            let hbsObject = {
                content: content
            };
            response.render("user", hbsObject);

        });
    });


    app.post("/register", (request, response) => {
         let firstName = request.body.first_name.substr(0, 1).toUpperCase() + request.body.first_name.substr(1, request.body.first_name.length);
         let lastName = request.body.last_name.substr(0, 1).toUpperCase() + request.body.last_name.substr(1, request.body.last_name.length);
         let email = request.body.email;
         let password = request.body.password;
         let password2 = request.body.password2;

        db.users.findAll({}).then(function(content) {
            for(var i = 0; i < content.length; i++) {
                if (email === content[i].email) {
                  response.redirect("/register") // if the user tries to register with an email that is already in the database, we need to write a code that throws an error that says email is already registered, and redirects to login
                } else {
                    request.checkBody('first_name', 'First name is required').notEmpty();
                    request.checkBody('last_name', 'Last name is required').notEmpty();
                    request.checkBody('email', 'Email is required').notEmpty();
                    request.checkBody('email', 'Email is not valid').isEmail();
                    request.checkBody('password', 'Password is required').notEmpty();
                    request.checkBody('password2', 'Passwords do not match').equals(password);

                    let errors = request.validationErrors();
                    
                        if(errors){
                            response.redirect("/signup", {errors, errors})
                        } else {

                            let salt = bcrypt.genSaltSync(10)
                            let hashedPassword = bcrypt.hashSync(password, salt) 
                        db.users.create({
                            first_name: firstName,
                            last_name: lastName,
                            email: email,
                            password: hashedPassword,
                            salt: salt
                        })
                        .then((user)=>{
                                passport.authenticate("local-signIn", {failureRedirect:"/signup", successRedirect: "/profile"})(request, response)
                                request.flash('success_msg', 'You are registered and can now login');
                                })
                    }
                }
            }
        });
    });
// ******************************************************************************
// *************************** PASSPORT CONFIG***********************************
// ******************************************************************************
      passport.use('local-signIn', new LocalStrategy.Strategy(
        (email, password, done) => {
        db.users.findOne({ where: { 'email': email }}).then((user) => {
            if(!user){return done(null, false, {message:'Unknown User'})}
            let hashedPW = bcrypt.hashSync(password, user.salt) 
            if(user.password === hashedPW){
              return  done(null, user);
            }
            return done(null, false , { message: 'Incorrect password.'})
          })
        }
      ));
     // function that allowes rout access only to logged in users /// 
      function isLoggedIn(request, response, next){
          if(request.isAuthenticated()){
              return next();
          }
          response.redirect('/profile');
          
      }
    // function that allowes rout access only to logged in users /// 
          function notLoggedIn(request, response, next){
          if(!request.isAuthenticated()){
              return next();
          }
          response.redirect( '/');
      }
    // Serialize Session 
      passport.serializeUser((user, done) => {
        done(null, user);
      });

    //   Deserialize Sessions
      passport.deserializeUser((user, done) => {
        db.users.findOne({where: {'email': user.email}}).then((user) => {
          done(null, user);
        }).catch((err) => {
          done(err, null)
        });
      });

};

