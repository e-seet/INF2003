const Event = require('../models/event');
const EventSponsor = require("../models/eventsponsor");
const Organizer = require('../models/organizer');
const Sponsor = require('../models/sponsor');
const User = require('../models/user');
const UserEvent = require('../models/userevent');
const Venue = require('../models/venue');

const fs = require('fs');
const path = require('path');
const csvParser = require('csv-parser');

const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

// Function to populate mock data
const populateMockData = async () => {
    try {


		// 1. User Table Mock Data
		const userData = await readCSV(path.join(__dirname, 'csv_data', 'users.csv'));
		await User.bulkCreate(userData);

		// # 3. Venue Table Mock Data
		const venueData = await readCSV(path.join(__dirname, 'csv_data', 'venues.csv'));
		const mappedVenueData = venueData.map(venue => ({
			VenueName: venue.VenueName,  // Ensure field names match your model
			Location: venue.Location,
			Capacity: parseInt(venue.Capacity, 10)  // Cast Capacity to a number if needed
		  }));
		await Venue.bulkCreate(mappedVenueData);

		// # 4. Organization Table Mock Data
		const organizationData = await readCSV(path.join(__dirname, 'csv_data', 'organizations.csv'));
		const mappedOrganizerData = organizationData.map(organizer => ({
			OrganizerName: organizer.OrganizationName,  // Map OrganizationName from CSV to OrganizerName in model
		}));
		await Organizer.bulkCreate(mappedOrganizerData);

		// # 5. Sponsor Table Mock Data
		const sponsorData = await readCSV(path.join(__dirname, 'csv_data', 'sponsors.csv'));
		await Sponsor.bulkCreate(sponsorData);

		// //  2. Event Table Mock Data
		const eventData = await readCSV(path.join(__dirname, 'csv_data', 'events.csv'));
		await Event.bulkCreate(eventData);

		

		// // # 6. UserEvent Table Mock Data (users attending events)
		const usereventData = await readCSV(path.join(__dirname, 'csv_data', 'user_event.csv'));
		// Map the CSV data to match the fields of the UserEvent model
		const mappedUserEventData = usereventData.map(userevent => ({
			UserID: parseInt(userevent.UserID), // Ensure it's a number
			EventID: parseInt(userevent.EventID), // Ensure it's a number
			NumberPurchased: parseInt(userevent.TicketCount), // Ensure it's a number
			TicketType: userevent.TicketType, // Leave as is
			PurchaseDate: new Date(userevent.PurchaseDate) // Convert to Date object
		}));

		await UserEvent.bulkCreate(mappedUserEventData)

		// // # 7. EventSponsor Table Mock Data (sponsors for events)
		const eventSponsorData = await readCSV(path.join(__dirname, 'csv_data', 'event_sponsor.csv'));
		await EventSponsor.bulkCreate(eventSponsorData)


        console.log('Mock data inserted successfully.');
    } catch (error) {
        console.error('Error populating mock data:', error);
    }
};

module.exports = populateMockData;