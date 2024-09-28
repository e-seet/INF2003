const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Event = require('./event');
const Attendee = require('./attendee');

const Ticket = sequelize.define('Ticket', {
    TicketID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    PurchaseDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    Price: {
        type: DataTypes.DECIMAL(10, 2),
        validate: {
            min: 0,
        },
    }
}, {
    tableName: 'Tickets'
});

// Define relationships
Ticket.belongsTo(Event, { foreignKey: 'EventID' });
Ticket.belongsTo(Attendee, { foreignKey: 'AttendeeID' });

module.exports = Ticket;