// routes/organizers.js
const express = require('express');
const router = express.Router();
const Event = require('../models/event');  // Assuming an Event model exists

// 1. Get organizer's dashboard
router.get('/dashboard', async (req, res) => {
    const { organizerId } = req.query;
    try {
        const events = await Event.findAll({ where: { organizerId } });
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Get event analytics for organizer
router.get('/:id/analytics', async (req, res) => {
    try {
        // Logic to fetch event analytics (ticket sales, demographics, etc.)
        res.json({ analytics: {} });  // Placeholder response
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;