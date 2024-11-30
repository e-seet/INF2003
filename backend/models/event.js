const { DataTypes } = require("sequelize");
const sequelize = require("./index");
const Organization = require("./organization");
const Venue = require("./venue");
const User = require("./user");

const Event = sequelize.define(
  "Event",
  {
    EventID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    EventName: {
      type: DataTypes.STRING(255), // Event name with max length of 255 characters
      allowNull: false,
    },
    EventDate: {
      type: DataTypes.DATE, // Event date
      allowNull: false,
    },
    TicketPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // Optional field
      validate: {
        min: 0, // Ensure price is non-negative
      },
    },
    VenueID: {
      // Foreign key column for Venue
      type: DataTypes.INTEGER,
      references: {
        model: Venue,
        key: "VenueID",
      },
      onDelete: "SET NULL", // Optional: If a venue is deleted, set VenueID to NULL in related events
    },
    OrganizationID: {
      // Foreign key column for Organization
      type: DataTypes.INTEGER,
      references: {
        model: Organization,
        key: "OrganizationID",
      },
      allowNull: true,
      onDelete: "CASCADE", // Optional: If an organization is deleted, related events are deleted
    },
    CreatedBy: {
      // Foreign key column for Organization
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "UserID",
      },
      onDelete: "CASCADE", // Optional: If an organization is deleted, related events are deleted
    },
    // for concurrency Not needed for now
    Version: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: "Events",
    hooks: {
      // Hook to auto-populate OrganizationID before creating an event
      async beforeCreate(event, options) {
        const user = await User.findByPk(event.CreatedBy);
        if (user && user.OrganizationID) {
          event.OrganizationID = user.OrganizationID;
        }
      },
    },
  },
);

// Define the relationships
Event.belongsTo(Organization, { foreignKey: "OrganizationID" });
Event.belongsTo(Venue, { foreignKey: "VenueID" });
// Event.belongsTo(Sponsor, { foreignKey: 'SponsorID' });
Event.belongsTo(User, { foreignKey: "CreatedBy" });

module.exports = Event;
