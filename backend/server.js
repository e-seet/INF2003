const express = require("express");
const sequelize = require("./models/index");

// Import models
// const Event = require('./models/event');
const EventSponsor = require("./models/eventsponsor");
const Organization = require("./models/organization");
// const Sponsor = require('./models/sponsor');
const User = require("./models/user");
const UserEvent = require("./models/userevent");
const Venue = require("./models/venue");
const Category = require("./models/category");

// Import the function to populate mock data
const populateMockData = require("./mockdata/populateMockData"); // Update this path accordingly

// import all the routes here
const eventRoutes = require("./routes/eventRoute");
const organizationRoutes = require("./routes/organizationRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
app.use(express.json());

// Enable CORS for all routes
const cors = require("cors");
app.use(cors());
// temp
const corsOptions = {
  origin: "http://localhost:4200", // Only allow this origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

// Use the routes for each resource
app.use("/user", userRoutes);
// app.use('/ticket', ticketRoutes);
// app.use('/venue',  venueRoutes);
// app.use("/sponsor", SponsorRoutes);
// app.use('/attendee', attendeeRoutes);

app.use("/event", eventRoutes);

app.use("/organization", organizationRoutes);

// Routes Example (List all venues)
// app.post("/register", async (req, res) => {
// 	console.log("Request received on /user/register");
// 	console.log(req.body); // This will log the body sent in the request

// 	try {
// 		const user = req.body;
// 		res.status(201).json(user);
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// });

// localhost:3000/venues
app.get("/venues", async (req, res) => {
  console.log("venues");
  try {
    const venues = await Venue.findAll();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/venues/:id", async (req, res) => {
  // console.log(id);
  console.log(req.params.id);
  id = req.params.id;
  try {
    const venues = await Venue.findAll({ where: { VenueID: id } });
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ticket Purchase
app.post("/userevent/purchase", async (req, res) => {
  console.log(req.body.UserID.userID);
  console.log(req.body.EventID);
  console.log(req.body.TicketType);

  try {
    let data = await UserEvent.create({
      UserID: req.body.UserID.userID,
      EventID: req.body.EventID,
      TicketType: req.body.TicketType,
    });
    console.log(data);
    res.json({ message: "Ticket purchased successfully", data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Ticket Purchase Confirmation
app.get("/userevent/:userId/:eventId", async (req, res) => {
  const { userId, eventId } = req.params;
  try {
    const orderDetails = await UserEvent.findOne({
      where: { UserID: userId, EventID: eventId },
      include: [{ model: Event }, { model: User }], // Include related data if needed
    });

    if (orderDetails) {
      res.json(orderDetails);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Event Sponsorship
app.post("/eventsponsor", async (req, res) => {
  try {
    let sponsorEvent = await EventSponsor.create({
      UserID: req.body.UserID.userID,
      EventID: req.body.EventID,
      SponsorshipAmount: req.body.SponsorshipAmount,
    });

    res
      .status(200)
      .json({ message: "Sponsorship submitted successfully", sponsorEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// category
app.get("/category/getcategories", async (req, res) => {
  console.log("get categories");
  try {
    let categories = await Category.findAll();

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set up associations
require("./models/associations"); // This file contains all the association logic

// for user

// Sync database and start the server
sequelize
  //   .sync({ force: true }) // force: true will drop tables if they exist
  .sync({ force: false }) // force: true will drop tables if they exist
  .then(() => {
    console.log("Database synced");
    populateMockData();
    app.listen(3000, () => console.log("Server is running on port 3000"));
  })
  .catch((err) => console.log("Error syncing database: " + err));
