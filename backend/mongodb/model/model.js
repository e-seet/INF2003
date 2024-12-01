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

const registerSchema = new mongoose.Schema({
  sessionid: { type: String, required: true }, // User identifier

  handPhone: { type: String },
  handPhoneOTP: { type: String },
  hpcreatedAt: { type: Date },
  hpverified: { type: Boolean, default: false },

  email: { type: String },
  emailOTP: { type: String },
  emailcreatedAt: { type: Date },
  emailverified: { type: Boolean, default: false },
});

// Define a compound index to ensure UserID and EventID are unique
// indexing
userEventSchema.index({ UserID: 1, EventID: 1 }, { unique: true });
// Indexing for event sponsor
eventSponsorSchema.index(
  { EventID: 1, "SponsorDetails.SponsorID": 1 },
  { unique: true },
);

registerSchema.index({ sessionid: 1 });
registerSchema.index(
  { sessionid: 1, handPhone: 1 },
  { unique: true, sparse: true }, // Sparse ensures only documents with both fields present are indexed
);
registerSchema.index(
  { sessionid: 1, email: 1 },
  { unique: true, sparse: true }, // Sparse ensures only documents with both fields present are indexed
);

// Create Models
// collection name: eventsponsor, userevent inside mongo compass
const MongoEventSponsor = mongoose.model("eventsponsor", eventSponsorSchema);
const MongoUserEvent = mongoose.model("userevent", userEventSchema);
const MongoRegisteration = mongoose.model("register", registerSchema);

// Export Models
module.exports = { MongoEventSponsor, MongoUserEvent, MongoRegisteration };
