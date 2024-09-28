const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Venue = sequelize.define('Venue', {
    VenueID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    VenueName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1
        }
    }
}, {
    tableName: 'Venues'
});

module.exports = Venue;