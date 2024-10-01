const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = require("./user");

const Sponsor = sequelize.define(
	"Sponsor",
	{
		SponsorID: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true, // Ensures this is auto-incremented
		},
		SponsorName: {
			type: DataTypes.STRING(255), // Max length of 255 characters
			allowNull: false, // This field is required
		},
		SponsorEmail: {
			type: DataTypes.STRING(255),
			allowNull: false,  // Field is required
			validate: {
				isEmail: true,  // Ensures that the field contains a valid email address
			},
			unique: true,  // Ensure no duplicate emails
		},
		SponsorPhone: {
			type: DataTypes.STRING(50),
			allowNull: true,  // Optional field
		},
	},
	{
		tableName: "Sponsors", // Explicitly set the table name to 'Sponsors'
	}
);

module.exports = Sponsor;
