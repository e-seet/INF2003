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
// http://localhost:3000/mongo/UserEvent
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

// registeration
// send email
router.post("/sendemail", async (req, res) => {
  console.log("Received in /sendemail");

  //   const { sessionid, email, otp } = req.body;
  let email = req.body.email;
  let emailOTP = req.body.otp;
  let sessionid = req.body.sessionid;

  try {
    const currentTime = new Date();

    // Check if the sessionid already exists
    const existingRecord = await MongoRegisteration.findOne({ sessionid });

    // if existing record
    // check if 3 minute passed: if so, take new record, otherwise ask to wait
    if (existingRecord) {
      console.log("got existing record\n");
      const timeDifference =
        (currentTime - new Date(existingRecord.emailcreatedAt)) / 1000; // Time difference in seconds

      if (existingRecord.emailcreatedAt && timeDifference < 30) {
        // If less than 3 minutes (180 seconds)
        // now is 30 sec
        return res.status(429).json({
          message: "Please wait 3 minutes before resending the email.",
        });
      }

      // Update the record with new email and reset email verification status
      existingRecord.email = email;
      existingRecord.emailOTP = emailOTP;
      existingRecord.emailcreatedAt = currentTime;
      existingRecord.emailverified = false;

      await existingRecord.save();
      // I need to send email here
      await awssendemail(email, emailOTP)
        .then((result) => console.log("Email sent successfully:", result))
        .catch((error) => console.error("Failed to send email:", error));

      return res.status(200).json({
        message: "Email updated successfully. Please verify your email.",
        record: existingRecord,
      });
    }

    // If no record exists, create a new one with otp
    const newRecord = new MongoRegisteration({
      sessionid,
      email,
      emailcreatedAt: currentTime,
      emailverified: false,
      emailOTP, // Save OTP for first-time users
    });

    console.log("asve new record");
    const savedRecord = await newRecord.save();
    // I need to send email here
    await awssendemail(email, emailOTP)
      .then((result) => console.log("Email sent successfully:", result))
      .catch((error) => console.error("Failed to send email:", error));

    res.status(201).json({
      message: "New record created. Please verify your email.",
      record: savedRecord,
    });
  } catch (error) {
    console.error("Error in /sendemail:", error);
    res.status(500).json({
      message: "Error processing the request",
      error,
    });
  }
});

// verify email
router.post("/verifyemail", async (req, res) => {
  console.log("Received in /verifyemail");

  //   const { sessionid, otp } = req.body;
  console.log(req.body);
  let sessionid = req.body.sessionid;
  try {
    // Find the record by sessionid
    const existingRecord = await MongoRegisteration.findOne({ sessionid });

    if (!existingRecord) {
      return res.status(404).json({
        message: "Session not found. Please request an OTP again.",
      });
    }

    // Check if the OTP matches
    if (existingRecord.emailOTP === req.body.emailotp) {
      existingRecord.emailverified = true; // Mark as verified
      await existingRecord.save();

      return res.status(200).json({
        message: "Email verified successfully.",
      });
    } else {
      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in /verifyemail:", error);
    res.status(500).json({
      message: "Error verifying OTP.",
      error,
    });
  }
});

// send sms
router.post("/sendsms", async (req, res) => {
  console.log("Received in /sendsms");

  let phone = req.body.phone;
  let sessionid = req.body.sessionid;
  let otp = req.body.otp;

  console.log(phone);
  console.log(sessionid);
  console.log(otp);

  try {
    const currentTime = new Date();

    // Check if the sessionid already exists
    const existingRecord = await MongoRegisteration.findOne({ sessionid });

    if (existingRecord) {
      console.log("Found existing record\n");
      const timeDifference =
        (currentTime - new Date(existingRecord.smsCreatedAt)) / 1000; // Time difference in seconds

      if (existingRecord.smsCreatedAt && timeDifference < 30) {
        // If less than 30 seconds
        return res.status(429).json({
          message: "Please wait 30 seconds before resending the SMS.",
        });
      }

      // Update the record with new phone and reset SMS verification status
      existingRecord.handPhone = phone;
      existingRecord.handPhoneOTP = otp;
      existingRecord.hpcreatedAt = currentTime;
      existingRecord.shpverified = false;

      await existingRecord.save();

      // Send SMS
      await sendSMS(otp, `Your OTP is: ${otp}`)
        .then((result) => console.log("SMS sent successfully:", result))
        .catch((error) => console.error("Failed to send SMS:", error));

      return res.status(200).json({
        message: "SMS updated successfully. Please verify your phone.",
        record: existingRecord,
      });
    }

    // If no record exists, create a new one with OTP
    const newRecord = new MongoRegisteration({
      sessionid,
      handPhone: phone,
      handPhoneOTP: otp, // Save OTP for first-time users
      shpcreatedAt: currentTime,
      hpverified: false,
    });

    console.log("Saving new record");
    const savedRecord = await newRecord.save();

    // Send SMS
    await sendSMS(otp, `Your OTP is: ${otp}`)
      .then((result) => console.log("SMS sent successfully:", result))
      .catch((error) => console.error("Failed to send SMS:", error));

    res.status(201).json({
      message: "New record created. Please verify your phone.",
      record: savedRecord,
    });
  } catch (error) {
    console.error("Error in /sendsms:", error);
    res.status(500).json({
      message: "Error processing the request",
      error,
    });
  }
});

router.post("/verifysms", async (req, res) => {
  console.log("Received in /verifysms");

  let sessionid = req.body.sessionid;
  let phoneNumber = req.body.phoneNumber;
  let otp = req.body.smsotp;

  try {
    // Find the record by sessionid
    const existingRecord = await MongoRegisteration.findOne({ sessionid });

    if (!existingRecord) {
      return res.status(404).json({
        message: "Session not found. Please request an OTP again.",
      });
    }

    // Check if the OTP matches
    if (existingRecord.handPhoneOTP === otp) {
      existingRecord.hpverified = true; // Mark as verified
      await existingRecord.save();

      return res.status(200).json({
        message: "Phone verified successfully.",
      });
    } else {
      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    console.error("Error in /verifysms:", error);
    res.status(500).json({
      message: "Error verifying OTP.",
      error,
    });
  }
});

router.get("/checkverifications/:sessionid", async (req, res) => {
  console.log("/checkverifications");

  sessionid = req.params;

  console.log(sessionid);
  try {
    // Find the record by sessionid
    const existingRecord = await MongoRegisteration.findOne({ sessionid });

    if (!existingRecord) {
      return res.status(404).json({
        message: "Validation not found.",
      });
    }

    // Check if both hpverified and emailverified are true
    const isVerified =
      existingRecord.hpverified === true &&
      existingRecord.emailverified === true;

    return res.status(200).json({
      sessionid: sessionid,
      verified: isVerified,
    });
  } catch (error) {
    console.error("Error in /checkstatus:", error);
    res.status(500).json({
      message: "Error checking status.",
      error,
    });
  }
});
module.exports = router;
