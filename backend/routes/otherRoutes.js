// included this route as refactoring. To reduce server.js length
const express = require("express");
const router = express.Router();
// const Organization = require("../models/organization");
const Venue = require("../models/venue");
const Category = require("../models/category");
const UserEvent = require("../models/userevent");
const Event = require("../models/event");
const EventSponsor = require("../models/EventSponsor");
const sequelize = require("../models/index");
const { Transaction } = require("sequelize");

const verifyToken = require("../middleware/verifyToken");

// localhost:3000/venues
router.get("/venues", async (req, res) => {
  console.log("venues");
  try {
    const venues = await Venue.findAll();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/venues/:id", async (req, res) => {
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

// concurrency for Ticket purchase
router.post("/userevent/purchase", verifyToken, async (req, res) => {
  console.log(req.body.UserID.userID);
  console.log(req.body.EventID);
  console.log(req.body.TicketType);

  // const { EventID, TicketType } = req.body;
  let decodedUserID = req.body.UserID.userID;
  let decodedEventId = req.body.EventID;
  let decodedTicketType = req.body.TicketType;

  //   const decodedToken = req.decodedToken; // Assuming the token is decoded and attached to req
  const transaction = await sequelize.transaction();

  try {
    // Check if the user already purchased a ticket for the event
    const existingUserEvent = await UserEvent.findOne({
      where: {
        UserID: decodedUserID, // Assuming decodedToken contains the user ID
        EventID: decodedEventId,
      },
      transaction, // Ensures the check is consistent within a transaction
    });

    if (existingUserEvent) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "User already purchased a ticket for this event." });
    }

    // Lock the event row to prevent race conditions
    const event = await Event.findOne({
      where: decodedEventId,
      lock: transaction.LOCK.UPDATE, // Acquire a lock on the row
      transaction,
    });

    if (!event) {
      await transaction.rollback();
      return res.status(404).json({ error: "Event not found." });
    }

    // Check ticket availability
    // if (event.AvailableTickets < 1) {
    //   await transaction.rollback();
    //   return res.status(400).json({ error: "Tickets sold out." });
    // }

    // Decrement available tickets atomically
    // event.AvailableTickets -= 1;
    // await event.save({ transaction });

    // Create a UserEvent record within the same transaction
    const userEvent = await UserEvent.create(
      {
        UserID: decodedUserID, // Assuming decodedToken contains the user ID
        EventID: decodedEventId,
        TicketType: decodedTicketType,
        PurchaseDate: new Date(),
      },
      { transaction },
    );

    // Commit the transaction after successful operations
    await transaction.commit();

    return res.json({
      message: "Ticket purchased successfully",
      data: userEvent,
    });
  } catch (err) {
    // Rollback the transaction in case of any error
    if (transaction) await transaction.rollback();

    console.error("Error during ticket purchase:", err);
    return res
      .status(500)
      .json({ error: "An error occurred during ticket purchase." });
  }
});

// Ticket Purchase
/*
router.post("/userevent/purchase", verifyToken, async (req, res) => {
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
 */

// Event Sponsorship
//concurrency
// routes/misc.js or appropriate file

router.post("/eventsponsor", verifyToken, async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    // Use findOrCreate within the transaction
    const [sponsorEvent, created] = await EventSponsor.findOrCreate({
      where: {
        UserID: req.body.UserID.userID,
        EventID: req.body.EventID,
      },
      defaults: {
        SponsorshipAmount: req.body.SponsorshipAmount,
        //   SponsorLevel: req.body.SponsorLevel,
      },
      transaction,
    });

    if (!created) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "You have already sponsored this event." });
    }

    await transaction.commit();
    res
      .status(200)
      .json({ message: "Sponsorship submitted successfully", sponsorEvent });
  } catch (err) {
    await transaction.rollback();
    console.error("Error creating sponsorship:", err);
    res.status(500).json({ error: err.message });
  }
});

/* 
router.post("/eventsponsor", async (req, res) => {
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
*/

// category
router.get("/category/getcategories", async (req, res) => {
  console.log("get categories");
  try {
    let categories = await Category.findAll();

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
