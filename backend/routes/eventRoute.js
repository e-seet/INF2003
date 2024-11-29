// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Venue = require("../models/venue");
const Organization = require("../models/organization");
const User = require("../models/user");
const { Sequelize } = require("sequelize");

const jwt = require("jsonwebtoken");
const UserEvent = require("../models/userevent");
const Category = require("../models/category");
const EventCategory = require("../models/eventcategory");
const EventSponsor = require("../models/eventsponsor");
const verifyToken = require("../middleware/verifyToken");

// Get all events. [Be it self-organized or by others]
router.get("/getAllEvents", async (req, res) => {
  try {
    data = await Event.findAll({
      // to include these FK to get the tables back
      include: [
        {
          model: Venue,
          // Specify the fields we want to get from Venue
          attributes: ["VenueName", "Location"],
        },
        {
          model: Organization,
          attributes: ["OrganizationName"],
        },
      ],
      order: [
        ["EventDate", "ASC"], // Sorting by 'EventDate' in ascending order ('ASC')
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a particular event data. By event id.
// Can be self-organized or others
router.get("/getEvent/:id", async (req, res) => {
  var id = req.params.id;
  try {
    data = await Event.findAll({
      where: { EventID: id },
      // to include these FK to get the tables back
      include: [
        {
          model: Venue,
          // Specify the fields we want to get from Venue
          attributes: ["VenueName", "Location"],
        },
        {
          model: Organization,
          attributes: ["OrganizationName"],
        },
        {
          model: User, // Fetch the User who created the event
          attributes: ["Name"], // Fetch the name and email of the user who created the event
        },
      ],
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// •	GET /event/getEvent/:id: Get all events.
router.get("/getTicketDetails/:id", verifyToken, async (req, res) => {
  try {
    let decodedToken = req.user;
    data = await Event.findAll({
      where: { EventID: req.params.id },
      include: [
        {
          model: Venue,
          // Specify the fields we want to get from Venue
          attributes: ["VenueName", "Location"],
        },
        {
          model: Organization,
          attributes: ["OrganizationName"],
        },
        {
          model: UserEvent,
          attributes: ["TicketType", "PurchaseDate", "UserID"],
          where: {
            UserID: decodedToken.userID,
          },
        },
        {
          model: User, // Fetch the user who created the event
          attributes: ["Name"], // Fetch only the name of the user
          where: {
            UserID: Sequelize.col("Event.CreatedBy"), // Match with CreatedBy field in the Event table
          },
        },
      ],
    });
    // console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get the event i am organizing
router.get("/getMyEventDetails/:id", verifyToken, async (req, res) => {
  decodedToken = req.user;
  console.log("userid");
  console.log(decodedToken.userID);
  console.log("event id:" + req.params.id);
  var event_id = req.params.id;
  try {
    data = await Event.findOne({
      where: { EventID: event_id, CreatedBy: decodedToken.userID },
      include: [
        {
          model: Category,
          attributes: ["CategoryName"],
        },
        {
          model: EventSponsor,
          attributes: ["SponsorshipAmount", "UserID", "SponsorLevel"],
          // make optional join (left)
          required: false,
          where: { EventID: event_id },
          include: [
            {
              model: User, // This represents the sponsor
              attributes: [
                "UserID",
                "Name",
                "Email",
                "Phone",
                "Photourl",
                "OrganizationID", // Fetching OrganizationID
              ],
              include: [
                {
                  model: Organization, // Fetching Organization details
                  attributes: ["OrganizationName"], // Getting the Organization name
                },
              ],
            },
          ],
        },
        {
          model: Organization, // Organization for the event itself, not sponsor
          attributes: ["OrganizationName"],
        },
        {
          model: Venue,
          attributes: ["VenueName", "Location", "Capacity"],
        },
        {
          model: User, // Fetch the User who created the event
          attributes: ["Name", "Email"], // Fetch the name and email of the user who created the event
        },
      ],
      order: [["EventDate", "ASC"]],
    });
    res.json(data);
  } catch (error) {
    console.log("got error");
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Get all events that the authenticated user has sponsored
router.get("/getSponsorEvents", verifyToken, async (req, res) => {
  decodedToken = req.user;

  try {
    const data = await Event.findAll({
      include: [
        {
          model: EventSponsor,
          attributes: ["SponsorshipAmount", "SponsorLevel"],
          where: { UserID: decodedToken.userID },
        },
        {
          model: Venue,
          attributes: ["VenueName", "Location"],
        },
        {
          model: Organization,
          attributes: ["OrganizationName"],
        },
        {
          model: User, // Fetch the user who created the event
          attributes: ["Name"], // Fetch only the name of the user
          where: {
            UserID: Sequelize.col("Event.CreatedBy"), // Match with CreatedBy field in the Event table
          },
        },
      ],
      order: [["EventDate", "ASC"]], // Sort by event date in ascending order
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No sponsored events found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching sponsored events:", error);
    res.status(500).json({ error: "Failed to retrieve sponsored events" });
  }
});

// Get specific event that the authenticated user has sponsored
router.get("/getSponsorDetails/:id", verifyToken, async (req, res) => {
  decodedToken = req.user;
  console.log("userid");
  console.log(decodedToken.userID);
  console.log("event id:" + req.params.id);
  var event_id = req.params.id;

  try {
    const data = await Event.findAll({
      where: { EventID: event_id },
      include: [
        {
          model: EventSponsor,
          attributes: ["SponsorshipAmount", "SponsorLevel"],
          where: { UserID: decodedToken.userID },
        },
        {
          model: Venue,
          attributes: ["VenueName", "Location"],
        },
        {
          model: Organization,
          attributes: ["OrganizationName"],
        },
        {
          model: User, // Fetch the user who created the event
          attributes: ["Name"], // Fetch only the name of the user
          where: {
            UserID: Sequelize.col("Event.CreatedBy"), // Match with CreatedBy field in the Event table
          },
        },
      ],
      order: [["EventDate", "ASC"]], // Sort by event date in ascending order
    });

    if (data.length === 0) {
      return res.status(404).json({ message: "No sponsored events found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching sponsored events:", error);
    res.status(500).json({ error: "Failed to retrieve sponsored events" });
  }
});

//Create a new event.
// Being a organizer and creating a new event
router.post("/createEvent", verifyToken, async (req, res) => {
  let decodedToken = req.user;
  //   console.log(decodedToken);
  //   console.log(req.body);

  // get venue first
  try {
    const venueID = await Venue.findOrCreate({
      where: {
        VenueName: req.body.venueName,
        Location: req.body.Location,
        Capacity: req.body.Capacity,
      },
    });

    var sqlData = {
      EventName: req.body.eventName,
      EventDate: new Date(req.body.eventDate),
      TicketPrice: req.body.ticketPrice,
      VenueID: venueID[0].dataValues.VenueID,
      OrganizationID: decodedToken.organizationID,
      CreatedBy: decodedToken.userID,
    };

    // Create the event
    const event = await Event.create(sqlData);
    console.log(event);

    // Check if user has selected categories and associate them with the event
    if (req.body.categories && Array.isArray(req.body.categories)) {
      const categoryPromises = req.body.categories.map(async (categoryName) => {
        // Find the categoryID by name
        const category = await Category.findOne({
          where: { CategoryName: categoryName },
        });
        // Create the EventCategory association
        return EventCategory.create({
          EventID: event.EventID,
          CategoryID: category.CategoryID,
        });
      });

      // Wait for all category associations to be created
      await Promise.all(categoryPromises);
    }
      res.json(event);
    } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: error.message });
  }
});

// find all of my tickets
// basically taking my records in user-event
// means getting back what tickets i brought
router.get("/getTickets", verifyToken, async (req, res) => {
  console.log("/getTickets\n");

  let decodedToken = req.user;
  try {
    const data = await UserEvent.findAll({
      where: { UserID: decodedToken.userID },
      include: [
        {
          model: Event,
          include: [
            {
              model: Venue, // Include Venue associated with the Event
              attributes: ["VenueName", "Location"],
            },
            {
              model: Organization, // Include Organization associated with the Event
              attributes: ["OrganizationName"],
            },
          ],
        },
        { model: User },
      ],
    });
    // Return data to client
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user events:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user events" });
  }
});

// for events the user organize
router.get("/getMyEvents", verifyToken, async (req, res) => {
  decodedToken = req.user;

  try {
    data = await Event.findAll({
      where: { CreatedBy: decodedToken.userID },
      include: [
        {
          model: Category,
          attributes: ["CategoryName"],
        },
        {
          model: EventSponsor,
          attributes: ["SponsorshipAmount", "UserID"],
        },
        {
          model: Organization,
          attributes: ["OrganizationName"],
        },
        {
          model: Venue,
          attributes: ["VenueName", "Location", "Capacity"],
        },
      ],
      order: [["EventDate", "ASC"]],
    });
    console.log("retreived my events");
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Update sponsorship amount by its event ID
router.put("/updateSponsor/:id", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const decodedToken = req.user;

  try {
    // Check if the ticket belongs to the current user
    const event = await EventSponsor.findOne({
      where: { EventID: eventId, UserID: decodedToken.userID },
    });

    if (!event) {
      return res.status(404).json({ error: "Sponsorship not found or unauthorized" });
    }

    // Prepare updated event data
    const updatedEventData = {
      SponsorshipAmount: req.body.SponsorshipAmount,
    };

    // Update the event
    await event.update(updatedEventData);
    console.log("Updated sponsorship data:", updatedEventData);

    res.json({ message: "Sponsorship updated successfully", event: updatedEventData });

  } catch (error) {
    console.error("Error updating sponsorship:", error);
    res.status(500).json({ error: "Failed to update sponsorship" });
  }
});

// Delete a sponsorship by its ID
router.delete("/deleteSponsor/:id", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const decodedToken = req.user;

  try {
    // Find the Sponsorship record to delete
    const eventSponsor = await EventSponsor.findOne({
      where: {
        UserID: decodedToken.userID,
        EventID: eventId,
      },
    });

    if (!eventSponsor) {
      return res.status(404).json({ error: "Sponsorship not found or unauthorized" });
    }

    // Delete the Sponsorship record
    await eventSponsor.destroy();
    res.json({ message: "Sponsorship deleted successfully" });
  } catch (error) {
    console.error("Error deleting Sponsorship:", error);
    res.status(500).json({ error: "Failed to delete sponsorship" });
  }
});

// Update ticket type by its event ID
router.put("/updateTicket/:id", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const decodedToken = req.user;

  try {
    // Check if the ticket belongs to the current user
    const event = await UserEvent.findOne({
      where: { EventID: eventId, UserID: decodedToken.userID },
    });

    if (!event) {
      return res.status(404).json({ error: "Ticket not found or unauthorized" });
    }

    // Prepare updated event data
    const updatedEventData = {
      TicketType: req.body.ticketType,
    };

    // Update the event
    await event.update(updatedEventData);
    console.log("Updated event ticket data:", updatedEventData);

    res.json({ message: "Event updated successfully", event: updatedEventData });

  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete a ticket by its ID
router.delete("/deleteTicket/:id", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const decodedToken = req.user;

  try {
    // Find the UserEvent record to delete
    const userEvent = await UserEvent.findOne({
      where: {
        UserID: decodedToken.userID,
        EventID: eventId,
      },
    });

    if (!userEvent) {
      return res.status(404).json({ error: "Ticket not found or unauthorized" });
    }

    // Delete the UserEvent record
    await userEvent.destroy();
    res.json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ error: "Failed to delete ticket" });
  }
});

// Update an event by its ID
router.put("/updateEvent/:id", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const decodedToken = req.user;

  console.log("Update request received for event ID:", eventId);
  console.log("Decoded Token:", decodedToken);
  console.log("Request body:", req.body);

  try {
    // Check if the event belongs to the current user
    const event = await Event.findOne({
      where: { EventID: eventId, CreatedBy: decodedToken.userID },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found or unauthorized" });
    }

    // Find or create the venue
    const venueID = await Venue.findOrCreate({
      where: {
        VenueName: req.body.venueName,
        Location: req.body.location,
        Capacity: req.body.capacity,
      },
    });

    // Prepare updated event data
    const updatedEventData = {
      EventName: req.body.eventName,
      EventDate: new Date(req.body.eventDate),
      TicketPrice: req.body.ticketPrice,
      VenueID: venueID[0].dataValues.VenueID,
      OrganizationID: decodedToken.organizationID,
    };

    // Update the event
    await event.update(updatedEventData);
    console.log("Updated event data:", updatedEventData);

    // Update categories if they are provided
    if (req.body.categories && Array.isArray(req.body.categories)) {
      // First, delete existing categories for the event
      await EventCategory.destroy({ where: { EventID: eventId } });

      // Then, associate new categories
      const categoryPromises = req.body.categories.map(async (categoryName) => {
        // Find the categoryID by name
        const category = await Category.findOne({
          where: { CategoryName: categoryName },
        });
        // Create the EventCategory association
        return EventCategory.create({
          EventID: event.EventID,
          CategoryID: category.CategoryID,
        });
      });

      // Wait for all category updates to complete
      await Promise.all(categoryPromises);
    }

    res.json({ message: "Event updated successfully", event: updatedEventData });

  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete an event by its ID
router.delete("/deleteEvent/:id", verifyToken, async (req, res) => {
  const eventId = req.params.id;
  const decodedToken = req.user;

  try {
    // Check if the event belongs to the current user
    const event = await Event.findOne({
      where: { EventID: eventId, CreatedBy: decodedToken.userID },
    });

    if (!event) {
      return res.status(404).json({ error: "Event not found or unauthorized" });
    }

    // Delete the event
    await Event.destroy({ where: { EventID: eventId } });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

router.get("/getFilteredEvents", async (req, res) => {
  try {
    console.log("Received query params:", req.query); // Log query params
    const { startDate, endDate, priceSortOrder } = req.query;

    // Validate inputs (Optional but recommended)
    if (startDate && isNaN(Date.parse(startDate))) {
      throw new Error("Invalid startDate format");
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw new Error("Invalid endDate format");
    }

    const events = await Event.filterEvents({
      startDate: startDate || null,
      endDate: endDate || null,
      priceSortOrder: priceSortOrder || "asc",
    });

    res.json(events);
  } catch (err) {
    console.error("Error in /getFilteredEvents route:", err); // Log full error
    res.status(500).send("An error occurred while fetching events.");
  }
});

const eventRoutes = router;
module.exports = eventRoutes;
