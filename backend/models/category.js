const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Category = sequelize.define(
  'Category',
  {
    CategoryID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    CategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'Category',
  },
);

module.exports = Category;
