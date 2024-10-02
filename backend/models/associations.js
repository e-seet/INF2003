// models/associations.js
const User = require('./user');
const Event = require('./event');
const Venue = require('./venue');
const Organization = require('./organizer');
const Sponsor = require('./sponsor');

// Venue-Event association (one-to-many)
Venue.hasMany(Event, { foreignKey: 'VenueID' });
Event.belongsTo(Venue, { foreignKey: 'VenueID' });

// Organization-Event association (one-to-many)
Organization.hasMany(Event, { foreignKey: 'OrganizationID' });
Event.belongsTo(Organization, { foreignKey: 'OrganizationID' });

// Event-Sponsor association (many-to-many through EventSponsor)
Event.belongsToMany(Sponsor, { through: 'EventSponsor', foreignKey: 'EventID' });
Sponsor.belongsToMany(Event, { through: 'EventSponsor', foreignKey: 'SponsorID' });

// User-Event association (many-to-many through UserEvent)
// User.belongsToMany(Event, { through: 'UserEvent', foreignKey: 'UserID' });
// Event.belongsToMany(User, { through: 'UserEvent', foreignKey: 'EventID' });
User.belongsToMany(Event, { through: 'UserEvent', foreignKey: 'UserID', uniqueKey: false });
Event.belongsToMany(User, { through: 'UserEvent', foreignKey: 'EventID', uniqueKey: false });

module.exports = {
    User,
    Event,
    Venue,
    Organization,
    Sponsor
};