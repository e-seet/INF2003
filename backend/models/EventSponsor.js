
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Event = require('./event');  // Import the Event model
const Sponsor = require('./sponsor');  // Import the Sponsor model

const EventSponsor = sequelize.define('EventSponsor', {
    EventSponsorID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    EventID: {
        type: DataTypes.INTEGER,
        references: {
            model: Event,  // Refers to the Event model
            key: 'EventID',
        },
        allowNull: false,
        onDelete: 'CASCADE',  // If the event is deleted, the related sponsorship should also be deleted
    },
    SponsorID: {
        type: DataTypes.INTEGER,
        references: {
            model: Sponsor,  // Refers to the Sponsor model
            key: 'SponsorID',
        },
        allowNull: false,
        onDelete: 'CASCADE',  // If the sponsor is deleted, the related sponsorship should also be deleted
    },
}, {
    tableName: 'EventSponsors',  // Explicitly naming the table in case you want a custom table name
    timestamps: false,  // If you don't need `createdAt` and `updatedAt` columns
});

module.exports = EventSponsor;