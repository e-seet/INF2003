// routes/events.js
const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Venue = require("../models/venue");
const Organization = require("../models/organization");
const User = require("../models/user");

const jwt = require("jsonwebtoken");
const UserEvent = require("../models/userevent");
const SECRET_KEY = "TEMP_KEY";

// •	GET /event/getAllEvents: Get all events.
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

// •	GET /event/getEvent/:id: Get all events.
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

//Create a new event.
// •	GET /event/getEvent/:id: Get all events.
router.post("/createEvent", async (req, res) => {
  console.log("event/createEvent\n");

  var token = null;
  var decodedToken = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract the token part
    console.log("token:" + token); // This will output just the token string
  } else {
    console.log("No token found or invalid format");
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    // console.log(decoded);
    decodedToken = decoded;
  });

  console.log("decoded token");
  console.log(decodedToken);
  console.log("\nreq body\n");
  console.log(req.body);
  // create event
  // event catregory
  // var id = req.params.id;

  console.log(req.body.venueName);
  // get venue first
  try {
    venueID = await Venue.findOrCreate({
      where: {
        VenueName: req.body.venueName,
        Location: req.body.Location,
        Capacity: req.body.Capacity,
      },
    });
    // console.log(venueID[0].dataValues.VenueID);
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
  console.log("sql data");
  console.log(sqlData);
  //   console.log(typeof sqlData.EventDate);

  //   try {
  //     data = await Event.create(sqlData);
  //     console.log(data);
  //     res.json(data);
  //   } catch (error) {
  //     res.status(500).json({ error: error.message });
  //   }

  Event.create(sqlData)
    .then((data) => {
      console.log(data);
      res.json(data);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Get all of my ticket details
// Event, User, UserEvent
router.get("/getTickets", async (req, res) => {
  console.log("/getTickets\n");
  var token = null;
  var decodedToken = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Extract the token part
  } else {
    console.log("No token found or invalid format");
  }

  if (token == null || token == "null") {
    return res.status(401).send({ message: "Unauthorized!" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    // console.log(decoded);
    decodedToken = decoded;
  });

  console.log(decodedToken);
  if (decodedToken.userID) {
    return res.status(200).send({ message: "error" });
  }
  console.log(decodedToken.userID);

  UserEvent.findAll({
    where: { UserID: decodedToken.userID },
    include: [{ model: Event }, { model: User }],
  })
    .then((data) => {
      console.log(data[0]);
      console.log("\n\n\n");
      console.log(data[1]);
      res.status(200).json(data);
    })
    .catch((error) => {
      console.error("Error fetching user events:", error);
      res
        .status(500)
        .json({ error: "An error occurred while fetching user events" });
    });
});

// •	POSt /api/events/:id: Update an existing event by ID.
// •	DELETE /api/events/:id: Delete an event by ID.

// 2. Filter events by category
// router.get('/categories', async (req, res) => {
//     // const { category } = req.query;
//     // try {
//     //     const events = await Event.findAll({ where: { category } });
//     //     res.json(events);
//     // } catch (error) {
//     //     res.status(500).json({ error: error.message });
//     // }
// });

// 3. Personalized event recommendations
// router.get('/recommendations', async (req, res) => {
//     // const { userId } = req.query;
//     // try {
//     //     // Fetch events personalized to the user
//     //     const recommendations = await Event.findAll({
//     //         where: {
//     //             // Add logic for event recommendations based on user preferences
//     //         }
//     //     });
//     //     res.json(recommendations);
//     // } catch (error) {
//     //     res.status(500).json({ error: error.message });
//     // }
// });

// 4. Get event details
// router.get('/:id', async (req, res) => {
//     try {
//         const event = await Event.findByPk(req.params.id);
//         if (event) {
//             res.json(event);
//         } else {
//             res.status(404).json({ message: 'Event not found' });
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// 5. RSVP to an event
// router.post('/:id/rsvp', async (req, res) => {
//     // try {
//     //     // Logic to handle RSVP, e.g., add user to the attendees list
//     //     res.status(200).json({ message: 'RSVP successful' });
//     // } catch (error) {
//     //     res.status(500).json({ error: error.message });
//     // }
// });

// 6. Submit a review for an event?
// router.post('/:id/reviews', async (req, res) => {
//     // try {
//     //     const { rating, comment } = req.body;
//     //     const review = await Review.create({
//     //         eventId: req.params.id,
//     //         rating,
//     //         comment,
//     //         userId: req.user.id,  // Assuming `req.user` is set after authentication
//     //     });
//     //     res.status(201).json(review);
//     // } catch (error) {
//     //     res.status(400).json({ error: error.message });
//     // }
// });

// 7. Set notifications/alerts for an event
// router.post('/:id/notifications', async (req, res) => {
//     // try {
//     //     // Logic to handle notifications
//     //     res.status(200).json({ message: 'Notification set successfully' });
//     // } catch (error) {
//     //     res.status(500).json({ error: error.message });
//     // }
// });

// // 8. Share an event on social media
// router.post('/:id/share', async (req, res) => {
//     // try {
//     //     // Logic for sharing event (e.g., generate a shareable link or social media integration)
//     //     res.status(200).json({ message: 'Event shared successfully' });
//     // } catch (error) {
//     //     res.status(500).json({ error: error.message });
//     // }
// });

const eventRoutes = router;
module.exports = eventRoutes;
