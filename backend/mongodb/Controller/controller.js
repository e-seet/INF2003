const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const { awssendemail, sendSMS } = require("./helper");

// const MongoEventSponsor = require("../model/model");
// const MongoUserEvent = require("../model/model");
const {
  MongoEventSponsor,
  MongoUserEvent,
  MongoRegisteration,
} = require("../model/model");

// EVENT SPONSOR ROUTES
// Get all event sponsors
router.get("/EventSponsor", async (req, res) => {
  try {
    const eventsponsor = await MongoEventSponsor.find();
    res.status(200).json(eventsponsor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching eventsponsor", error });
  }
});

// Get event sponsor by ID (using compound index)
router.get("/EventSponsor/:eventId/:sponsorId", async (req, res) => {
  try {
    const eventsponsor = await MongoEventSponsor.findOne({
      EventID: req.params.eventId,
      "SponsorDetails.SponsorID": req.params.sponsorId
    });
    if (!eventsponsor) {
      return res.status(404).json({ message: "Sponsor not found" });
    }
    res.status(200).json(eventsponsor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sponsor", error });
  }
});

// Create event sponsor
router.post("/EventSponsor", verifyToken, async (req, res) => {
  try {
    const newSponsor = new MongoEventSponsor({
      EventID: req.body.EventID,
      SponsorDetails: [{
        SponsorID: req.user.userID,
        amount: req.body.amount
      }]
    });
    await newSponsor.save();
    res.status(201).json(newSponsor);
  } catch (error) {
    res.status(500).json({ message: "Error creating sponsor", error });
  }
});

// Update event sponsor
router.put("/EventSponsor/:eventId/:sponsorId", verifyToken, async (req, res) => {
  try {
    const updated = await MongoEventSponsor.findOneAndUpdate(
      {
        EventID: req.params.eventId,
        "SponsorDetails.SponsorID": req.params.sponsorId,
        "SponsorDetails.SponsorID": req.user.userID // Verify ownership
      },
      { 
        $set: { 
          "SponsorDetails.$.amount": req.body.amount 
        }
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Sponsor not found or unauthorized" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating sponsor", error });
  }
});

// Delete event sponsor
router.delete("/EventSponsor/:eventId/:sponsorId", verifyToken, async (req, res) => {
  try {
    const deleted = await MongoEventSponsor.findOneAndDelete({
      EventID: req.params.eventId,
      "SponsorDetails.SponsorID": req.params.sponsorId,
      "SponsorDetails.SponsorID": req.user.userID // Verify ownership
    });
    if (!deleted) {
      return res.status(404).json({ message: "Sponsor not found or unauthorized" });
    }
    res.status(200).json({ message: "Sponsor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting sponsor", error });
  }
});

// USER EVENT ROUTES
// Get all user events
router.get("/UserEvent", async (req, res) => {
  try {
    const userevents = await MongoUserEvent.find();
    res.status(200).json(userevents);
  } catch (error) {
    res.status(500).json({ message: "Error fetching userevents", error });
  }
});

// Get user event by IDs (using compound index)
router.get("/UserEvent/:userId/:eventId", verifyToken, async (req, res) => {
  try {
    const userevent = await MongoUserEvent.findOne({
      UserID: parseInt(req.params.userId),
      EventID: parseInt(req.params.eventId),
      UserID: req.user.userID // Verify ownership
    });
    if (!userevent) {
      return res.status(404).json({ message: "User event not found" });
    }
    res.status(200).json(userevent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user event", error });
  }
});

// Create user event
router.post("/UserEvent", verifyToken, async (req, res) => {
  try {
    const newUserEvent = new MongoUserEvent({
      UserID: req.user.userID,
      EventID: req.body.EventID,
      TicketType: req.body.TicketType,
      PurchaseDate: new Date(),
      Attendance: false
    });
    await newUserEvent.save();
    res.status(201).json(newUserEvent);
  } catch (error) {
    res.status(500).json({ message: "Error creating user event", error });
  }
});

// Update user event (attendance/ticket type)
router.put("/UserEvent/:eventId", verifyToken, async (req, res) => {
  try {
    const updated = await MongoUserEvent.findOneAndUpdate(
      {
        UserID: req.user.userID,
        EventID: parseInt(req.params.eventId)
      },
      { 
        $set: { 
          Attendance: req.body.Attendance,
          TicketType: req.body.TicketType 
        }
      },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "User event not found" });
    }
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating user event", error });
  }
});

// Delete user event
router.delete("/UserEvent/:eventId", verifyToken, async (req, res) => {
  try {
    const deleted = await MongoUserEvent.findOneAndDelete({
      UserID: req.user.userID,
      EventID: parseInt(req.params.eventId)
    });
    if (!deleted) {
      return res.status(404).json({ message: "User event not found" });
    }
    res.status(200).json({ message: "User event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user event", error });
  }
});

// Analytics Routes
router.get("/EventSponsor/stats/:eventId", async (req, res) => {
  try {
    const stats = await MongoEventSponsor.aggregate([
      { $match: { EventID: req.params.eventId }},
      { $unwind: "$SponsorDetails" },
      { 
        $group: {
          _id: "$EventID",
          totalAmount: { $sum: "$SponsorDetails.amount" },
          sponsorCount: { $sum: 1 }
        }
      }
    ]);
    res.json(stats[0] || { totalAmount: 0, sponsorCount: 0 });
  } catch (error) {
    res.status(500).json({ message: "Error getting stats", error });
  }
});

router.get("/UserEvent/attendance/:eventId", async (req, res) => {
  try {
    const stats = await MongoUserEvent.aggregate([
      { $match: { EventID: parseInt(req.params.eventId) }},
      {
        $group: {
          _id: "$EventID",
          totalTickets: { $sum: 1 },
          attendedCount: { $sum: { $cond: ["$Attendance", 1, 0] }}
        }
      }
    ]);
    res.json(stats[0] || { totalTickets: 0, attendedCount: 0 });
  } catch (error) {
    res.status(500).json({ message: "Error getting attendance stats", error });
  }
});

// Get all events
router.get("/Event", async (req, res) => {
  try {
    const events = await MongoEvent.find()
      .sort({ EventDate: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
});

// Get event by ID 
router.get("/Event/:id", async (req, res) => {
  try {
    const event = await MongoEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error fetching event", error });
  }
});

// Create event
router.post("/Event", verifyToken, async (req, res) => {
  try {
    const event = await MongoEvent.create({
      EventName: req.body.eventName,
      EventDate: new Date(req.body.eventDate),
      TicketPrice: req.body.ticketPrice,
      VenueID: req.body.venueId,
      OrganizationID: req.body.organizationId,
      CreatedBy: req.user.userID
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error creating event", error });
  }
});

// Update event
const withTransaction = async (operation, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const result = await operation(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      if (error.name === 'MongoError' && error.code === 112 && attempt < retries) {
        console.log(`Retrying operation (${attempt}/${retries})`);
        continue;
      }
      throw error;
    } finally {
      session.endSession();
    }
  }
};

router.put("/Event/:id", verifyToken, async (req, res) => {
  try {
    await withTransaction(async (session) => {
      const event = await MongoEvent.findOneAndUpdate(
        { 
          EventID: req.params.id,
          version: req.body.version // Optimistic locking
        },
        { 
          $set: { 
            EventName: req.body.eventName,
            EventDate: new Date(req.body.eventDate),
            TicketPrice: req.body.ticketPrice,
            VenueID: req.body.venueId,
            OrganizationID: req.body.organizationId
          },
          $inc: { version: 1 }
        },
        { new: true, session }
      );

      if (!event) {
        throw new Error('Event not found or version mismatch');
      }

      return event;
    });
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: "Error updating event", error });
  }
});

// Enhanced analytics
router.get("/Event/analytics", async (req, res) => {
  try {
    const stats = await MongoEvent.aggregate([
      {
        $facet: {
          'byOrganization': [
            { $group: {
              _id: '$OrganizationID',
              totalEvents: { $sum: 1 },
              averagePrice: { $avg: '$TicketPrice' }
            }}
          ],
          'byVenue': [
            { $group: {
              _id: '$VenueID',
              eventCount: { $sum: 1 }
            }}
          ],
          'upcomingEvents': [
            { $match: { EventDate: { $gt: new Date() }}},
            { $count: 'total' }
          ]
        }
      }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error getting analytics", error });
  }
});

// Compound queries
router.get("/Event/search", async (req, res) => {
  try {
    const { organizationId, fromDate, toDate, minPrice, maxPrice } = req.query;
    const query = {
      ...(organizationId && { OrganizationID: organizationId }),
      ...(fromDate && toDate && { 
        EventDate: { 
          $gte: new Date(fromDate),
          $lte: new Date(toDate)
        }
      }),
      ...(minPrice && maxPrice && {
        TicketPrice: {
          $gte: parseFloat(minPrice),
          $lte: parseFloat(maxPrice)
        }
      })
    };

    const events = await MongoEvent
      .find(query)
      .sort({ EventDate: 1 });
      
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: "Error searching events", error });
  }
});

// Get all venues
router.get("/Venue", async (req, res) => {
  try {
    const venues = await MongoVenue.find();
    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({ message: "Error fetching venues", error });
  }
});

// Get venue by ID
router.get("/Venue/:id", async (req, res) => {
  try {
    const venue = await MongoVenue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({ message: "Error fetching venue", error });
  }
});

// Handle contact form submissions
router.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Create a new contact document
    const newContact = new MongoContact({
      name,
      email,
      message,
      createdAt: new Date(),
    });

    // Save to MongoDB
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    console.error("Error saving contact form data:", error);
    res.status(500).json({ message: "Error saving contact form data", error });
  }
});

module.exports = router;
