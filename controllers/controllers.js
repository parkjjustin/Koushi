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

    app.get("/user/profile", isLoggedIn, (request, response) => {
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
       
         let firstName = properFirst
         let lastName = properLast
         let email = request.body.email;
         let password = request.body.password;
         let password2 = request.body.password2;
       
          request.checkBody('firstName', 'First name is required').notEmpty();
          request.checkBody('lastName', 'Last name is required').notEmpty();
          request.checkBody('email', 'Email is required').notEmpty();
          request.checkBody('email', 'Email is not valid').isEmail();
          request.checkBody('username', 'username is required').notEmpty()
          request.checkBody('password', 'Password is required').notEmpty()
          request.checkBody('password2', 'Passwords do not match').equals(request.body.password);

           let errors = request.validationErrors();
              if(errors){
                  response.redirect('/register', {errors: errors});
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
              .then(()=>{
                    passport.authenticate("local-signIn", {failureRedirect:"/login", successRedirect: "/user/profile"})(request, response) 
                    request.flash('success_msg', 'You are registered and can now login');
                    })
                }

    });


    
// ******************************************************************************
// *************************** PASSPORT CONFIG***********************************
// ******************************************************************************
    passport.use('local-signIn', new LocalStrategy.Strategy(
         (email, password, done) => {
            if(!user){return done(null, false, {message:'Unknown User'})}
            let hashedPW = bcrypt.hashSync(password, user.salt) 
            if(user.password === hashedPW){
              return  done(null, user);
            }
             return done(null, false , { message: 'Incorrect password.'})
         }
     ))
     // function that allowes rout access only to logged in users /// 
      function isLoggedIn(request, response, next){
          if(request.isAuthenticated()){
              return next();
          }
          response.redirect('/');
          
      }
    // function that allowes rout access only to logged in users /// 
          function notLoggedIn(request, response, next){
          if(!request.isAuthenticated()){
              return next();
          }
          response.redirect('/');
      }
    // Serialize Session 
      passport.serializeUser((user, done) => {
        done(null, user);
      });

    //   Deserialize Sessions
      passport.deserializeUser((user, done) => {
        db.User.findOne({where: {'username': user.email}}).then((user) => {
          done(null, user);
        }).catch((err) => {
          done(err, null)
        });
      });

};


//  db.users.create({
//             first_name: properFirst,
//             last_name: properLast,
//             email: request.body.email,
//             password: request.body.password
//         }).then(function(content) {
//             response.redirect("/register");
//         });