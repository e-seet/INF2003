const mongoose = require("mongoose");

// Import models
const { MongoEventSponsor } = require("./model/model");

// MongoDB connection
const connectMongoDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/inf2003db");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Listen for events
mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose connection error:", err);
});

// Sample data
const mockEventSponsors = [
  {
    EventID: "E001",
    SponsorDetails: [
      { SponsorID: "S001", amount: 500 },
      { SponsorID: "S002", amount: 750 },
    ],
  },
  {
    EventID: "E002",
    SponsorDetails: [
      { SponsorID: "S003", amount: 1000 },
      { SponsorID: "S004", amount: 2000 },
      { SponsorID: "S005", amount: 1500 },
    ],
  },
  {
    EventID: "E003",
    SponsorDetails: [
      { SponsorID: "S006", amount: 300 },
      { SponsorID: "S007", amount: 450 },
    ],
  },
];

// Function to populate the database
const populateEventSponsors = async () => {
  try {
    console.log("Populating Event Sponsors...");

    // Clear existing data
    await MongoEventSponsor.deleteMany({});
    console.log("Existing data cleared.");

    // Insert new data
    await MongoEventSponsor.insertMany(mockEventSponsors);
    console.log("Mock data inserted successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
    mongoose.connection.close();
  }
};

// Run the functions
(async () => {
  await connectMongoDB();
  await populateEventSponsors();
})();

module.exports = connectMongoDB;
