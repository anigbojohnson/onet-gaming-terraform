const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Name is required" },
      len: { args: [3, 50], msg: "Name must be between 3 and 50 characters" }
    }
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Email is required" },
      isEmail: { msg: "Must be a valid email address" }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: "Password is required" },
      len: { args: [6, 100], msg: "Password must be at least 6 characters" }
    }
  }
});


module.exports = User;

// Sync table
(async () => {
  await sequelize.sync();
})();
