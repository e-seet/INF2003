const express = require('express');
const sequelize = require('./models/index');

// Import models
const Venue = require('./models/venue');
const Organizer = require('./models/organizer');
const Sponsor = require('./models/sponsor');
const Event = require('./models/event');
const Attendee = require('./models/attendee');
const Ticket = require('./models/ticket');

const app = express();
app.use(express.json());

// Routes Example (List all venues)
app.get('/venues', async (req, res) => {
    try {
        const venues = await Venue.findAll();
        res.json(venues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Sync database and start the server
sequelize.sync({ force: false })  // force: true will drop tables if they exist
    .then(() => {
        console.log('Database synced');
		populateData();
        app.listen(3000, () => console.log('Server is running on port 3000'));
    })
    .catch(err => console.log('Error syncing database: ' + err));