const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true,
        required: "Username is required",
        unique: true,
        min: 6,
        max: 15,
        trim: true,
        validate: [(input) => {
            return input.length >= 6;
        }, "Username should be longer."]
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: 'Email address is required',
        trim: true,
        match: [/.+\@.+\..+/, "enter a valid email"]
    },

    password: {
        type: String,
        required: "Password is required",
        min: 6,
        max: 15,
        trim: true,
        validate: [(input) => {
            return input.length >= 6;
        }, "Password should be longer."]
    }
})

var User = module.exports = mongoose.model('User', UserSchema)

module.exports.createUser = function(newUser, callback) {
    bcrypt.genSalt(10, function(error, salt) {
        bcrypt.hash(newUser.password, salt, function(error, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback) {
    let query = { username: username };
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback) {
    let query = { email: email };
    User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(inputPassword, hash, callback) {
    bcrypt.compare(inputPassword, hash, function(error, isMatch) {
        if (error) throw error;
        callback(null, isMatch);
    });
}