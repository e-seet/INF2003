const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Attendee = sequelize.define('Attendee', {
    AttendeeID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    AttendeeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Email: {
        type: DataTypes.STRING,
        unique: true,
    },
    Phone: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'Attendees'
});

module.exports = Attendee;