// 1. 	Insert into Organization
// 2.	Insert into Category
// 3.	Insert into Venues
// 4.	Insert into Users
// 5.	Insert into Events
// 6.	Insert into EventCategory
// 7.	Insert into UserEvent
// 8.	Insert into EventSponsor

const Organization = require("../models/organization");
const Category = require("../models/category");

const Venue = require("../models/venue");
const User = require("../models/user");
const Event = require("../models/event");
const EventCategory = require("../models/eventcategory");
const UserEvent = require("../models/userevent");
const EventSponsor = require("../models/EventSponsor");

const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

const readCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// Function to populate mock data
const populateMockData = async () => {
  try {
    // 1. 	Insert into Organization
    const organizationData = await readCSV(
      path.join(__dirname, "csv_data", "organizations.csv"),
    );
    const mappedOrganizationData = organizationData.map((organization) => ({
      OrganizationName: organization.OrganizationName, // Map OrganizationName from CSV to OrganizationName in model
    }));
    await Organization.bulkCreate(mappedOrganizationData);

    // 2.	Insert into Category
    const categoryData = await readCSV(
      path.join(__dirname, "csv_data", "category.csv"),
    );
    const mappedCategoryData = categoryData.map((category) => ({
      CategoryName: category.CategoryName,
    }));
    await Category.bulkCreate(mappedCategoryData);

    // 3.	Insert into Venues
    const venueData = await readCSV(
      path.join(__dirname, "csv_data", "venues.csv"),
    );
    const mappedVenueData = venueData.map((venue) => ({
      VenueName: venue.VenueName, // Ensure field names match your model
      Location: venue.Location,
      Capacity: parseInt(venue.Capacity, 10), // Cast Capacity to a number if needed
    }));
    await Venue.bulkCreate(mappedVenueData);

    // 4.	Insert into Users
    const userData = await readCSV(
      path.join(__dirname, "csv_data", "users.csv"),
    );
    const mappedUserData = userData.map((user) => ({
      Name: user.Name, // Ensure field names match your model
      Password: user.Password,
      Email: user.Email,
      Phone: user.Phone,
      OrganizationID: user.OrganizationID
        ? parseInt(user.OrganizationID) || null
        : null,
    }));
    await User.bulkCreate(mappedUserData, { individualHooks: true });

    // 5.	Insert into Events
    const eventData = await readCSV(
      path.join(__dirname, "csv_data", "events.csv"),
    );
    await Event.bulkCreate(eventData, { individualHooks: true });

    // 6.	Insert into EventCategory
    // to do
    const eventCategoryData = await readCSV(
      path.join(__dirname, "csv_data", "event_category.csv"),
    );
    const mappedEventCategoryData = eventCategoryData.map((eventCategory) => ({
      CategoryID: parseInt(eventCategory.CategoryID),
      EventID: parseInt(eventCategory.EventID),
    }));
    const uniqueEventCategoryData = mappedEventCategoryData.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.CategoryID === value.CategoryID && t.EventID === value.EventID,
        ),
    );
    await EventCategory.bulkCreate(uniqueEventCategoryData);

    // 7.	Insert into UserEvent
    // Map the CSV data to match the fields of the UserEvent model
    // const usereventData = await readCSV(path.join(__dirname, 'csv_data', 'user_event.csv'));
    // const mappedUserEventData = usereventData.map(userevent => ({
    // 	UserID: parseInt(userevent.UserID), // Ensure it's a number
    // 	EventID: parseInt(userevent.EventID), // Ensure it's a number
    // 	NumberPurchased: parseInt(userevent.TicketCount), // Ensure it's a number
    // 	TicketType: userevent.TicketType, // Leave as is
    // 	PurchaseDate: new Date(userevent.PurchaseDate) // Convert to Date object
    // }));
    // await UserEvent.bulkCreate(mappedUserEventData)

    // /*
    // Map the CSV data to match the fields of the UserEvent model
    const usereventData = await readCSV(
      path.join(__dirname, "csv_data", "user_event.csv"),
    );
    const mappedUserEventData = usereventData.map((userevent) => ({
      UserID: parseInt(userevent.UserID), // Ensure it's a number
      EventID: parseInt(userevent.EventID), // Ensure it's a number
      NumberPurchased: parseInt(userevent.TicketCount), // Ensure it's a number
      TicketType: userevent.TicketType, // Leave as is
      PurchaseDate: new Date(userevent.PurchaseDate), // Convert to Date object
    }));

    // Filter out duplicates (same UserID and EventID combination)
    const uniqueUserEventData = mappedUserEventData.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.UserID === value.UserID && t.EventID === value.EventID,
        ),
    );
    await UserEvent.bulkCreate(uniqueUserEventData);
    // */

    // 8.	Insert into EventSponsor
    const eventSponsorData = await readCSV(
      path.join(__dirname, "csv_data", "event_sponsor.csv"),
    );

    const mappedEventSponsorData = eventSponsorData.map((eventsponsor) => ({
      EventID: parseInt(eventsponsor.EventID), // Ensure it's a number
      UserID: parseInt(eventsponsor.UserID), // Ensure it's a number
      SponsorshipAmount: parseInt(eventsponsor.SponsorshipAmount) || 0, // New field: Ensure it's a number or default to 0
    }));
    // await EventSponsor.bulkCreate(eventSponsorData)

    // Filter out duplicates (same EventID and SponsorID combination)
    const uniqueEventSponsorData = mappedEventSponsorData.filter(
      (value, index, self) =>
        index ===
        self.findIndex(
          (t) => t.EventID === value.EventID && t.SponsorID === value.SponsorID,
        ),
    );
    await EventSponsor.bulkCreate(uniqueEventSponsorData);

    console.log("Mock data inserted successfully.");
  } catch (error) {
    console.error("Error populating mock data:", error);
  }
};

module.exports = populateMockData;
