// models/associations.js
const User = require('./user');
const Event = require('./event');
const Venue = require('./venue');
const Organization = require('./organizer');
const Sponsor = require('./sponsor');
const UserEvent = require('./userevent');
const EventSponsor = require('./eventsponsor');

// Venue-Event association (one-to-many)
Venue.hasMany(Event, { foreignKey: 'VenueID' });
Event.belongsTo(Venue, { foreignKey: 'VenueID' });

// Organization-Event association (one-to-many)
Organization.hasMany(Event, { foreignKey: 'OrganizationID' });
Event.belongsTo(Organization, { foreignKey: 'OrganizationID' });

// User-Event association (many-to-many through UserEvent)
// first set
// User.belongsToMany(Event, { through: 'UserEvent', foreignKey: 'UserID', uniqueKey: false });
// Event.belongsToMany(User, { through: 'UserEvent', foreignKey: 'EventID', uniqueKey: false });

// Setup a One-to-Many relationship between User and Grant
// A User can have many UserEvent entries
// Setup the one-to-many relationship

// An Event can have many UserEvent entries:
// We use this so that we can have a primary key instead of composite primary key
// why? Because i can buy many tickets at the same time:
// eg: i buy 1 ticket  for BTS, i can buy another ticket for BTS again.
Event.hasMany(UserEvent, { foreignKey: 'EventID' });
UserEvent.belongsTo(Event, { foreignKey: 'EventID' });

User.hasMany(UserEvent, { foreignKey: 'UserID' });
UserEvent.belongsTo(User, { foreignKey: 'UserID' });

// For event and sponsor association
// Event-Sponsor association (many-to-many through EventSponsor)
// first set: Means it is a composite primary id
Event.belongsToMany(Sponsor, { through: 'EventSponsor', foreignKey: 'EventID' });
Sponsor.belongsToMany(Event, { through: 'EventSponsor', foreignKey: 'SponsorID' });

// if i ever need a primary key instead of composite priamry key
// Event.hasMany(EventSponsor, { foreignKey: 'EventID'});
// EventSponsor.belongsTo(Event, {foreignKey: 'EventID'});
// Sponsor.hasMany(EventSponsor, { foreignKey: 'SponsorID' });
// EventSponsor.belongsTo(Sponsor, { foreignKey: 'SponsorID' });

module.exports = {
    User,
    Event,
    Venue,
    Organization,
    Sponsor,
	UserEvent,
	EventSponsor
};