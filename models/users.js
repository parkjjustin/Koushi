const bcrypt = require('bcryptjs');
var Sequelize = require('sequelize'),
 sequelize = new Sequelize("sequelize_test", "root");

module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define("users", {
        first_name: {
            type: DataTypes.STRING,
            notEmpty: true,
            isAlpha: true,
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING,
            notEmpty: true,
            isAlpha: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            notEmpty: true,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            len: [6, 15],
            notEmpty: true,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING,
            notEmpty: true,
            allowNull: false
        }
    }, {
        classMethods: {
            associate: function(models) {
            }
        },
        timestamps: false
    });
    return users;
};
