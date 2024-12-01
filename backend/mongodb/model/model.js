const mongoose = require("mongoose");

// Event Sponsor Schema
const eventSponsorSchema = new mongoose.Schema({
  EventID: { type: String, required: true },
  SponsorDetails: [
    {
      SponsorID: { type: String, required: true }, // Sponsor ID
      amount: { type: Number, required: true }, // Contribution amount
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Automatically set when a document is created
});

// User Event Schema (Attendance)
const userEventSchema = new mongoose.Schema({
  UserID: { type: Number, required: true }, // User identifier
  EventID: { type: Number, required: true }, // Event identifier
  TicketType: { type: String, required: false }, // Ticket type (e.g., VIP, Regular)
  PurchaseDate: { type: Date, required: false }, // Date of ticket purchase
  createdAt: { type: Date, default: Date.now }, // Automatically set when a document is created
  updatedAt: { type: Date, default: Date.now }, // Automatically updated on changes
  Attendance: { type: Boolean, default: false }, // Attendance status
});

// Add Event Schema with versioning for optimistic locking
const eventSchema = new mongoose.Schema({
  EventID: { type: String, required: true },
  EventName: { type: String, required: true },
  EventDate: { type: Date, required: true },
  TicketPrice: { type: Number, min: 0 },
  VenueID: { type: String, required: true },
  OrganizationID: { type: String, required: true },
  CreatedBy: { type: String, required: true },
  version: { type: Number, default: 0 }
});

// Add indexes
eventSchema.index({ EventName: 1 });
eventSchema.index({ EventDate: 1 });
eventSchema.index({ CreatedBy: 1 });

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Define a compound index to ensure UserID and EventID are unique
// indexing
userEventSchema.index({ UserID: 1, EventID: 1 }, { unique: true });
// Indexing for event sponsor
eventSponsorSchema.index(
  { EventID: 1, "SponsorDetails.SponsorID": 1 },
  { unique: true },
);

// Create Models
// collection name: eventsponsor, userevent inside mongo compass
const MongoEventSponsor = mongoose.model("eventsponsor", eventSponsorSchema);
const MongoUserEvent = mongoose.model("userevent", userEventSchema);
const MongoEvent = mongoose.model("event", eventSchema);
const MongoContact = mongoose.model("contact", contactSchema);

// Export Models
module.exports = { MongoEventSponsor, MongoUserEvent, MongoEvent, MongoContact };
