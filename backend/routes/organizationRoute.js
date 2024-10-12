// routes/organization.js
const express = require('express');
const router = express.Router();
const Organization = require('../models/organization');

// Get an Organization by id
router.get('/:id', async (req, res) => {
  var id = req.params.id;
  try {
    console.log(id);
    const data = await Organization.findAll({ where: { OrganizationID: id } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all Organization
router.get('/', async (req, res) => {
  try {
    const events = await Organization.findAll();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Get event analytics for organization
// router.get('/:id/analytics', async (req, res) => {
//     try {
//         // Logic to fetch event analytics (ticket sales, demographics, etc.)
//         res.json({ analytics: {} });  // Placeholder response
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = router;
