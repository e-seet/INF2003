const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Event = require("./event"); // Import the Event model
const User = require("./user");

const EventSponsor = sequelize.define(
  "EventSponsor",
  {
    // EventSponsorID: {
    //     type: DataTypes.INTEGER,
    //     primaryKey: true,
    //     // autoIncrement: true,
    // },
    UserID: {
      type: DataTypes.INTEGER,
      references: {
        model: User, // Refers to the Event model
        key: "UserID",
      },
      allowNull: false,
      onDelete: "CASCADE", // If the event is deleted, the related sponsorship should also be deleted
    },
    EventID: {
      type: DataTypes.INTEGER,
      references: {
        model: Event, // Refers to the Event model
        key: "EventID",
      },
      allowNull: false,
      onDelete: "CASCADE", // If the event is deleted, the related sponsorship should also be deleted
    },

    // SponsorID: {
    // 	type: DataTypes.INTEGER,
    // 	// references: {
    // 	// 	model: User,
    // 	// 	key: "UserID"
    // 	// 	// model: Sponsor, // Refers to the Sponsor model
    // 	// 	// key: "SponsorID",
    // 	// },
    // 	allowNull: false,
    // },
    SponsorshipAmount: {
      // New integer field
      type: DataTypes.INTEGER,
      allowNull: false, // Field cannot be null
      defaultValue: 0, // Default value set to 0 if no amount is provided
    },
    SponsorLevel: {
      // Virtual field
      type: DataTypes.VIRTUAL,
      get() {
        const amount = this.getDataValue("SponsorshipAmount");
        if (amount >= 40000) return "Diamond";
        if (amount >= 20000) return "Platinum";
        if (amount >= 10000) return "Gold";
        if (amount >= 1000) return "Silver";
        if (amount > 0) return "Bronze";
        return "No Sponsorship";
      },
    },
  },
  {
    tableName: "EventSponsor", // Explicitly naming the table in case you want a custom table name
    indexes: [
      {
        fields: ["EventID", "UserID"],
      },
    ],
    timestamps: false, // If you don't need `createdAt` and `updatedAt` columns
  },
);

module.exports = EventSponsor;
