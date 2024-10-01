const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = require("./user");

const Organizer = sequelize.define(
	"Organizer",
	{
		OrganizerID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		OrganizerName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		tableName: "Organizers",
	}
);

module.exports = Organizer;
