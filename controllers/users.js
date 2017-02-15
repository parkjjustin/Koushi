const express = require('express');
const router = express.Router();
const User = require("../models/user")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// Register
router.get('/register', (request, response) => {
    response.render('register')
});

// Login
router.get('/login', (request, response) => {
    response.render('login')
});

router.get('/profile', isLoggedIn, (request, response) => {
    response.render('profile')
});

// Register User
router.post('/register', (request, response) => {
    let username = request.body.username;
    let email = request.body.email.toLowerCase();
    let password = request.body.password;
    let password2 = request.body.password2;

    // Validation
    request.checkBody('username', 'Username is required').notEmpty();
    request.checkBody('email', 'Email is required').notEmpty();
    request.checkBody('email', 'Email is not valid').isEmail();
    request.checkBody('password', 'Password is required').notEmpty();
    request.checkBody('password2', 'Passwords do not match').equals(password);
    let errors = request.validationErrors();

    if (errors) {
        response.render("register", { errors: errors })
    } else {
        let newUser = new User({
            username: username,
            email: email,
            password: password
        });
        User.createUser(newUser, (errors, user) => {
            if (errors) throw errors;
            console.log(user);

        });

        request.flash('success_msg', "You are registered and can now log in");
        response.redirect('/users/login');
    };
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
    passport.authenticate('local', { successRedirect: '/users/profile', failureRedirect: '/users/login', failureFlash: true }),
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
        response.redirect('users/login')
    }
}
module.exports = router;