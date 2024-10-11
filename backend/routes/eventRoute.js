// routes/events.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');
const Venue = require('../models/venue');
const Organization = require('../models/organization');

// •	GET /event/getAllEvents: Get all events.
router.get('/getAllEvents', async (req, res) => {
	try {
        data = await Event.findAll(
			{
				// to include these FK to get the tables back
				include:[
					{
						model: Venue,
						// Specify the fields we want to get from Venue
						attributes: ['VenueName', 'Location']  
					},
					{
						model: Organization,
						attributes: ['OrganizationName']
					}
				],
				order: [
					['EventDate', 'ASC']  // Sorting by 'EventDate' in ascending order ('ASC')
				]
			}
		);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// •	GET /event/getEvent/:id: Get all events.
router.get('/getEvent/:id', async (req, res) => {
	var id = req.params.id;  
    try {
		data = await Event.findAll(
			{
				where:{ EventID: id},
				// to include these FK to get the tables back
				include:[
					{
						model: Venue,
						// Specify the fields we want to get from Venue
						attributes: ['VenueName', 'Location']  
					},
					{
						model: Organization,
						attributes: ['OrganizationName']
					}
				]
			}
		);
		res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// •	POST /api/events: Create a new event.
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

const eventRoutes = router
module.exports = eventRoutes;