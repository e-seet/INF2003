const Venue = require('../models/venue');
const Organizer = require('../models/organizer');
const Sponsor = require('../models/sponsor');
const Event = require('../models/event');
const Attendee = require('../models/attendee');
const Ticket = require('../models/ticket');

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

		// Insert venues
		// Read CSV data
		const venueData = await readCSV(path.join(__dirname, 'csv_data', 'venues.csv'));
		// Hardcoded additional data
		const hardcodedVenues = [
			{ VenueName: 'Main Hall', Location: '123 Main St', Capacity: 500 },
			{ VenueName: 'Outdoor Arena', Location: '456 Park Ave', Capacity: 2000 },
			{ VenueName: 'Conference Room', Location: '789 Business Blvd', Capacity: 200 },
			{ VenueName: 'Grand Theater', Location: '1011 Broadway', Capacity: 1200 },
			{ VenueName: 'Exhibition Center', Location: '1213 Expo Ave', Capacity: 3000 },
		];
		// Combine CSV data with hardcoded data
		const allVenues = [...venueData, ...hardcodedVenues];
		// Insert all data into the database in one call
		await Venue.bulkCreate(allVenues);

        // Insert organizers
    	// Read CSV data
		const organizerData = await readCSV(path.join(__dirname, 'csv_data', 'organizers.csv'));
		const hardcodedOrganizers =[
            { OrganizerName: 'Event Pros', ContactEmail: 'contact@eventpros.com', ContactPhone: '123-456-7890' },
            { OrganizerName: 'Global Gatherings', ContactEmail: 'info@globalgatherings.com', ContactPhone: '234-567-8901' },
            { OrganizerName: 'Future Events', ContactEmail: 'future.events@example.com', ContactPhone: '345-678-9012' },
            { OrganizerName: 'Urban Festivals', ContactEmail: 'urban.festivals@example.com', ContactPhone: '456-789-0123' },
        ];
		// Combine CSV data with hardcoded data
		const allOrganizers = [...organizerData, ...hardcodedOrganizers];
		// Insert all data into the database in one call
		await Organizer.bulkCreate(allOrganizers);


        // Insert sponsors
		const sponsorData = await readCSV(path.join(__dirname, 'csv_data', 'sponsors.csv'));
		const hardcodedSponsors = [
            { SponsorName: 'Tech Corp', SponsorType: 'Technology', Contact: 'contact@techcorp.com' },
            { SponsorName: 'Green Energy', SponsorType: 'Environment', Contact: 'sustainability@greenenergy.com' },
            { SponsorName: 'Foodies United', SponsorType: 'Food & Beverage', Contact: 'support@foodiesunited.com' },
            { SponsorName: 'Media Masters', SponsorType: 'Media', Contact: 'info@mediamasters.com' },
            { SponsorName: 'Travel Globe', SponsorType: 'Travel', Contact: 'info@travelglobe.com' },
        ]
		const allSponsors = [...sponsorData, ...hardcodedSponsors];
        await Sponsor.bulkCreate(allSponsors);

        // Insert events
		const eventData = await readCSV(path.join(__dirname, 'csv_data', 'events.csv'));
		const hardcodedEvents = [
            { EventName: 'Tech Expo 2024', EventDate: '2024-06-15', OrganizerID: 1, VenueID: 1, SponsorID: 1, TicketPrice: 99.99 },
            { EventName: 'Sustainability Summit', EventDate: '2024-09-25', OrganizerID: 2, VenueID: 2, SponsorID: 2, TicketPrice: 49.99 },
            { EventName: 'Gourmet Food Festival', EventDate: '2024-07-10', OrganizerID: 3, VenueID: 3, SponsorID: 3, TicketPrice: 39.99 },
            { EventName: 'Music Fest 2024', EventDate: '2024-08-20', OrganizerID: 4, VenueID: 4, SponsorID: 4, TicketPrice: 59.99 },
            { EventName: 'Travel World Conference', EventDate: '2024-10-05', OrganizerID: 1, VenueID: 5, SponsorID: 5, TicketPrice: 79.99 },
            { EventName: 'Startup Showcase', EventDate: '2024-11-12', OrganizerID: 2, VenueID: 1, SponsorID: 1, TicketPrice: 99.99 },
            { EventName: 'Innovation and Design Expo', EventDate: '2024-12-01', OrganizerID: 3, VenueID: 4, SponsorID: 2, TicketPrice: 89.99 },
        ]
		const allEvents = [...eventData, ...hardcodedEvents];
		await Event.bulkCreate(allEvents);

        // Insert attendees
		const attendeeData = await readCSV(path.join(__dirname, 'csv_data', 'attendees.csv'));
		const hardcodedAttendees = [
            { AttendeeName: 'John Doe', Email: 'john.doe@example.com', Phone: '555-123-4567' },
            { AttendeeName: 'Jane Smith', Email: 'jane.smith@example.com', Phone: '555-234-5678' },
            { AttendeeName: 'Alex Johnson', Email: 'alex.johnson@example.com', Phone: '555-345-6789' },
            { AttendeeName: 'Sara Williams', Email: 'sara.williams@example.com', Phone: '555-456-7890' },
            { AttendeeName: 'Chris Brown', Email: 'chris.brown@example.com', Phone: '555-567-8901' },
            { AttendeeName: 'Michael Lee', Email: 'michael.lee@example.com', Phone: '555-678-9012' },
            { AttendeeName: 'Olivia Davis', Email: 'olivia.davis@example.com', Phone: '555-789-0123' },
        ]
		const allAttendees = [...attendeeData, ...hardcodedAttendees];
        await Attendee.bulkCreate(allAttendees);

        // Insert tickets
		const ticketData  = await readCSV(path.join(__dirname, 'csv_data', 'tickets.csv'));
		const hardcodedTickets = [
            { EventID: 1, AttendeeID: 1, PurchaseDate: '2024-05-01', Price: 99.99 },
            { EventID: 2, AttendeeID: 2, PurchaseDate: '2024-08-10', Price: 49.99 },
            { EventID: 3, AttendeeID: 3, PurchaseDate: '2024-06-25', Price: 39.99 },
            { EventID: 4, AttendeeID: 4, PurchaseDate: '2024-07-15', Price: 59.99 },
            { EventID: 5, AttendeeID: 5, PurchaseDate: '2024-09-01', Price: 79.99 },
            { EventID: 6, AttendeeID: 6, PurchaseDate: '2024-10-20', Price: 99.99 },
            { EventID: 7, AttendeeID: 7, PurchaseDate: '2024-11-05', Price: 89.99 },
        ]
		const allTickets = [...ticketData, ...hardcodedTickets];
        await Ticket.bulkCreate(allTickets);

        console.log('Mock data inserted successfully.');
    } catch (error) {
        console.error('Error populating mock data:', error);
    }
};

module.exports = populateMockData;