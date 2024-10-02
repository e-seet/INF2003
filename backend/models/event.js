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
        type: DataTypes.STRING(255),  // Event name with max length of 255 characters
        allowNull: false,
    },
    EventDate: {
        type: DataTypes.DATE,  // Event date
        allowNull: false,
    },
    TicketPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,  // Optional field
        validate: {
            min: 0,  // Ensure price is non-negative
        },
    },
    VenueID: {  // Foreign key column for Venue
        type: DataTypes.INTEGER,
        references: {
            model: Venue,
            key: 'VenueID',
        },
        onDelete: 'SET NULL',  // Optional: If a venue is deleted, set VenueID to NULL in related events
    },
	OrganizerID: {  // Foreign key column for Organizer
        type: DataTypes.INTEGER,
        references: {
            model: Organizer,
            key: 'OrganizerID',
        },
        onDelete: 'CASCADE',  // Optional: If an organizer is deleted, related events are deleted
    },
}, {
    tableName: 'Events'
});

// Define the relationships
Event.belongsTo(Organizer, { foreignKey: 'OrganizerID' });
Event.belongsTo(Venue, { foreignKey: 'VenueID' });
Event.belongsTo(Sponsor, { foreignKey: 'SponsorID' });

module.exports = Event;