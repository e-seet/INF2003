const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Organizer = sequelize.define('Organizer', {
    OrganizerID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    OrganizerName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ContactEmail: {
        type: DataTypes.STRING,
        unique: true,
    },
    ContactPhone: {
        type: DataTypes.STRING,
    },
}, {
    tableName: 'Organizers'
});

module.exports = Organizer;