const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const UserEvent = sequelize.define(
	"UserEvent",
	{
		UserEventID: {  // This will be the unique identifier for each purchase
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,  // Unique auto-increment ID for each purchase
        },
        UserID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "User", // References the User model
                key: "UserID",
            },
        },
        EventID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Event", // References the Event model
                key: "EventID",
            },
        },
		NumberPurchased: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1, // Each user must purchase at least one ticket
		},
		TicketType: {
			type: DataTypes.STRING, // E.g., 'VIP', 'General Admission', 'Early Bird', etc.
			allowNull: false,
		},
		PurchaseDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW, // Automatically set to current date
		},
	},
	{
		tableName: "UserEvent",
		indexes: [
            {
                fields: ['UserID', 'EventID'],
                unique: false,  // Remove the unique constraint here
            }
        ],
	}
);

module.exports = UserEvent;
