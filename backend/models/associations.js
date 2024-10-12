// models/associations.js
const User = require("./user");
const Event = require("./event");
const Venue = require("./venue");
const Organization = require("./organization");
// const Sponsor = require('./sponsor');
const UserEvent = require("./userevent");
const EventSponsor = require("./eventsponsor");

const Category = require("./category");

// Venue-Event association (one-to-many)
Venue.hasMany(Event, { foreignKey: "VenueID" });
Event.belongsTo(Venue, { foreignKey: "VenueID" });

// Organization-Event association (one-to-many)
// Organization.hasMany(Event, { foreignKey: 'OrganizationID' });
// Event.belongsTo(Organization, { foreignKey: 'OrganizationID' });

// User-Event association (many-to-many through UserEvent)
// first set
User.belongsToMany(Event, { through: "UserEvent", foreignKey: "UserID" });
Event.belongsToMany(User, { through: "UserEvent", foreignKey: "EventID" });
UserEvent.belongsTo(User, { foreignKey: "UserID" });
UserEvent.belongsTo(Event, { foreignKey: "EventID" });
// User.belongsToMany(Event, { through: UserEvent, foreignKey: "UserID" });
// Event.belongsToMany(User, { through: UserEvent, foreignKey: "EventID" });

// UserEvent.belongsTo(User, { foreignKey: "UserID" });
// UserEvent.belongsTo(Event, { foreignKey: "EventID" });

Category.belongsToMany(Event, {
  through: "EventCategory",
  foreignKey: "CategoryID",
});
Event.belongsToMany(Category, {
  through: "EventCategory",
  foreignKey: "EventID",
});

// Setup a One-to-Many relationship between User and Grant
// A User can have many UserEvent entries
// Setup the one-to-many relationship

// An Event can have many UserEvent entries:
// We use this so that we can have a primary key instead of composite primary key
// why? Because i can buy many tickets at the same time:
// eg: i buy 1 ticket  for BTS, i can buy another ticket for BTS again.
// Event.hasMany(UserEvent, { foreignKey: 'EventID' });
// UserEvent.belongsTo(Event, { foreignKey: 'EventID' });

// User.hasMany(UserEvent, { foreignKey: 'UserID' });
// UserEvent.belongsTo(User, { foreignKey: 'UserID' });

// For event and sponsor association
// Event-Sponsor association (many-to-many through EventSponsor)
// first set: Means it is a composite primary id
// Event.belongsToMany(Sponsor, { through: 'EventSponsor', foreignKey: 'EventID' });
// Sponsor.belongsToMany(Event, { through: 'EventSponsor', foreignKey: 'SponsorID' });

// For linking both Event and User
Event.belongsToMany(User, { through: "EventSponsor", foreignKey: "EventID" });
User.belongsToMany(Event, { through: "EventSponsor", foreignKey: "UserID" });

// if i ever need a primary key instead of composite priamry key
// Event.hasMany(EventSponsor, { foreignKey: 'EventID'});
// EventSponsor.belongsTo(Event, {foreignKey: 'EventID'});
// Sponsor.hasMany(EventSponsor, { foreignKey: 'SponsorID' });
// EventSponsor.belongsTo(Sponsor, { foreignKey: 'SponsorID' });

// for user
// User.associate = function(models) {
//     User.belongsTo(Organization, {
//       foreignKey: 'OrganizationID',
//       as: 'organization'
//     });
// };

//   Organization.associate = function(models) {
//     Organization.hasMany(models.User, {
//       foreignKey: 'OrganizationID',
//       as: 'user',
//       onDelete: 'SET NULL'  // If organization is deleted, set organizationId to NULL for users
//     });
//   };

User.belongsTo(Organization, {
  foreignKey: "OrganizationID",
  as: "organization",
});

Organization.hasMany(User, {
  foreignKey: "OrganizationID",
  as: "user",
  onDelete: "SET NULL", // If organization is deleted, set organizationId to NULL for users
});

module.exports = {
  User,
  Event,
  Venue,
  Organization,
  // Sponsor,
  UserEvent,
  EventSponsor,
};
