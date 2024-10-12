const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Event = require('./event'); // Import the Event model
const Category = require('./category'); // Import the Sponsor model

const EventCategory = sequelize.define(
  'EventCategory',
  {
    EventID: {
      type: DataTypes.INTEGER,
      references: {
        model: Event, // Refers to the Event model
        key: 'EventID',
      },
      allowNull: false,
      onDelete: 'CASCADE', // If the event is deleted, the related sponsorship should also be deleted
    },
    CategoryID: {
      type: DataTypes.INTEGER,
      references: {
        model: Category, // Refers to the Sponsor model
        key: 'CategoryID',
      },
      allowNull: false,
    },
  },
  {
    tableName: 'EventCategory', // Explicitly naming the table in case you want a custom table name
    timestamps: false, // If you don't need `createdAt` and `updatedAt` columns
  },
);

module.exports = EventCategory;
