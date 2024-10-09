const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = require("./user");

const Organization = sequelize.define(
	"Organization",
	{
		OrganizationID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		OrganizationName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		// Email: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false,
		// 	unique: true,
		// },
		// Phone: {
		// 	type: DataTypes.STRING,
		// },
	},
	{
		tableName: "Organization",
	}
);

module.exports = Organization;
