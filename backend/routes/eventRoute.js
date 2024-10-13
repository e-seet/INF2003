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
          attributes: ["TicketType", "UserID"],
          where: {
            UserID: decodedToken.userID,
          },
        },
      ],
    });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// get the event i am organizing
router.get("/getMyEventDetails/:id", verifyToken, async (req, res) => {
  decodedToken = req.user;
  var event_id = req.params.id;
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
          attributes: ["SponsorshipAmount", "UserID", "SponsorLevel"],
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
      ],
      order: [["EventDate", "ASC"]],
    });
    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
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
    venueID = await Venue.findOrCreate({
      where: {
        VenueName: req.body.venueName,
        Location: req.body.Location,
        Capacity: req.body.Capacity,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
  }

  var sqlData = {
    EventName: req.body.eventName,
    EventDate: new Date(req.body.eventDate),
    TicketPrice: req.body.ticketPrice,
    VenueID: venueID[0].dataValues.VenueID,
    OrganizationID: decodedToken.organizationID,
    CreatedBy: decodedToken.userID,
  };

  console.log(sqlData);
  Event.create(sqlData)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
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

const eventRoutes = router;
module.exports = eventRoutes;
