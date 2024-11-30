// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    Phone: {
      type: DataTypes.STRING,
    },
    Photourl: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    OrganizationID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      //   allowNull: false,
      defaultValue: -1,
    },
    admin: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        isIn: {
          args: [[0, 1]], // Ensures 'available' is either 0 or 1
          msg: "Available value must be either 0 or 1",
        },
      },
    },
    // for concurrency Not needed for now
    Version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    // Add a compound index on admin and OrganizationID
    //   indexes: [
    //   {
    //     fields: ["UserID", "OrganizationID"],
    //   },
    // ],

    // Enable optimistic locking
    // version: true, // Tells Sequelize to use the `Version` field for optimistic locking

    hooks: {
      // Hash the password before saving the user
      beforeSave: async (user) => {
        if (user.Password) {
          const salt = await bcrypt.genSalt(10);
          user.Password = await bcrypt.hash(user.Password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.Password) {
          const salt = await bcrypt.genSalt(10);
          user.Password = await bcrypt.hash(user.Password, salt);
        }
      },
    },
  },
);

// Method to compare password
User.prototype.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.Password);
};

module.exports = User;
