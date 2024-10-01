const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const UserEvent = sequelize.define(
	"UserEvent",
	{
		UserEventID: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
		},
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users", // References the User model
				key: "UserID",
			},
			primaryKey: true,
		},
		EventID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Events", // References the Event model
				key: "EventID",
			},
			primaryKey: true,
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
	}
);

module.exports = UserEvent;
