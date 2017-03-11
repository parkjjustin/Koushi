const express = require('express');
const router = express.Router();
const User = require("../models/user")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const validator = require("validator");
// Register
router.get('/register', (request, response) => {
    response.render('register')
});

// Login
router.get('/login', (request, response) => {
    response.render('login')
});

router.get('/profile', isLoggedIn, (request, response) => {
    let user = response.locals.user;
    response.render('profile', user)
});


router.get('/html', isLoggedIn, (request, response) => {
    let user = response.locals.user;
    response.render('html', user)
});

router.get('/css', isLoggedIn, (request, response) => {
    let user = response.locals.user;
    response.render('css', user)
});

router.get('/javascript', isLoggedIn, (request, response) => {
    let user = response.locals.user;
    response.render('javascript', user)
});


// Register User
router.post('/register', (request, response) => {
    User.find({ $or: [{ email: request.body.email }, { username: request.body.username }] }).then(user => {
        let username = request.body.username.trim();
        let email = request.body.email.toLowerCase().trim();
        let password = request.body.password;
        let password2 = request.body.password2;
        request.checkBody('username', 'Username is required').notEmpty();
        request.checkBody('email', 'Email is required').notEmpty();
        request.checkBody('email', 'Email is not valid').isEmail();
        request.checkBody('password', 'Password is required').notEmpty();
        request.checkBody('password2', 'Passwords do not match').equals(password);
        let errors = request.validationErrors();

        if (user[0] === undefined) {

            if (errors) {
                response.render("register", { errors: errors })
            } else {
                let newUser = new User({
                    username: username,
                    email: email,
                    password: request.body.password
                });
                User.createUser(newUser, (errors, user) => {
                    if (errors) throw errors;
                });
                request.flash('success_msg', "You are registered and can now log in");
                response.redirect('/login');
            };

        } else if (user[0].username === username && user[0].email === email) {
            request.flash("error_msg", "Our records show that you have already registered an account. Please log in.");
            response.redirect('/login');
        } else if (user[0].email === email) {
            request.flash("error_msg", "Email is already registered");
            response.redirect('/register');
        } else if (user[0].username === username) {
            request.flash("error_msg", "Username is taken");
            response.redirect('/register');
        }



    })


});


passport.use(new LocalStrategy(
    (username, password, done) => {
        User.getUserByUsername(username, (error, user) => {
            if (error) throw error;
            if (!user) {
                return done(null, false, { message: 'Username not registered' });
            }

            User.comparePassword(password, user.password, (error, isMatch) => {
                if (error) throw error;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Incorrect password' });
                }
            });
        });
    }));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (error, user) => {
        done(error, user);
    });
});

router.post('/login',
    passport.authenticate('local', { successRedirect: '/profile', failureRedirect: '/login', failureFlash: true }),
    (request, response) => {
        response.redirect('/');
    });

router.get('/logout', (request, response) => {
    request.logout();

    request.flash('success_msg', 'You are logged out');

    response.redirect('/');
});

function isLoggedIn(request, response, next) {
    if (request.isAuthenticated()) {
        return next();
    } else {
        request.flash('error_msg', "You are not logged in")
        response.redirect('/login')
    }
}
module.exports = router;