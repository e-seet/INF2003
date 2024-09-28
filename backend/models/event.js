const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Organizer = require('./organizer');
const Venue = require('./venue');
const Sponsor = require('./sponsor');

const Event = sequelize.define('Event', {
    EventID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    EventName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    EventDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    TicketPrice: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
            min: 0,
        },
    }
}, {
    tableName: 'Events'
});

// Define the relationships
Event.belongsTo(Organizer, { foreignKey: 'OrganizerID' });
Event.belongsTo(Venue, { foreignKey: 'VenueID' });
Event.belongsTo(Sponsor, { foreignKey: 'SponsorID' });

module.exports = Event;