module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define("users", {
        username: {
            type: DataTypes.STRING,
            notEmpty: true,
            len: [6, 15],
            allowNull: false
        },
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
        }
    }, {
        classMethods: {
            associate: function(models) {
                //   users.belongsTo(models.Program);
            }
        },
        timestamps: false
    });
    return users;
};