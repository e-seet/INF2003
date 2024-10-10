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
// app.use('/sponsor', sponsorRoutes);
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

// Set up associations
require("./models/associations"); // This file contains all the association logic

// Sync database and start the server
sequelize
	.sync({ force: true }) // force: true will drop tables if they exist
	.then(() => {
		console.log("Database synced");
		populateMockData();
		app.listen(3000, () => console.log("Server is running on port 3000"));
	})
	.catch((err) => console.log("Error syncing database: " + err));
