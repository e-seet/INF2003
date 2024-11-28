const express = require("express");
const router = express.Router();

// const MongoEventSponsor = require("../model/model");
// const MongoUserEvent = require("../model/model");
const { MongoEventSponsor, MongoUserEvent } = require("../model/model");

// Sponsor for event
// get all eventsponsors
router.get("/EventSponsor", async (req, res) => {
  try {
    const eventsponsor = await MongoEventSponsor.find();
    console.log(eventsponsor);
    res.status(200).json(eventsponsor);
  } catch (error) {
    res.status(500).json({ message: "Error fetching eventsponsor", error });
  }
});

// findbyid [Event id + sponsor id required for the use of indexing]
// create
// update

// attendance
//get all
router.get("/UserEvent", async (req, res) => {
  try {
    const userevent = await MongoUserEvent.find();
    res.status(200).json(userevent);
  } catch (error) {
    res.status(500).json({ message: "Error fetching userevent", error });
  }
});
// findbyid[userid + eventid] use this 2 field to query to use indexing
// create
// update

module.exports = router;
