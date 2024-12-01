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
  MongoPhotoSubmission,
} = require("../model/model");

// Sponsor for event
// get all eventsponsors
router.get("/EventSponsor", async (req, res) => {
  const session = await MongoRegisteration.startSession();
  session.startTransaction();
  try {
    const eventsponsor = await MongoEventSponsor.find().session(session);
    console.log(eventsponsor);
    await session.commitTransaction();
    res.status(200).json(eventsponsor);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error fetching eventsponsor", error });
  } finally {
    session.endSession();
  }
});

// findbyid [Event id + sponsor id required for the use of indexing]
// create
// update

// attendance
//get all
// http://localhost:3000/mongo/UserEvent
router.get("/UserEvent", async (req, res) => {
  const session = await MongoUserEvent.startSession();
  session.startTransaction();

  try {
    const userevent = await MongoUserEvent.find().session(session);
    await session.commitTransaction();
    res.status(200).json(userevent);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error fetching userevent", error });
  } finally {
    session.endSession();
  }
});
// findbyid[userid + eventid] use this 2 field to query to use indexing
// create
// update

// registeration
// send email
router.post("/sendemail", async (req, res) => {
  console.log("Received in /sendemail");
  const session = await MongoRegisteration.startSession();
  session.startTransaction();

  //   const { sessionid, email, otp } = req.body;
  let email = req.body.email;
  let emailOTP = req.body.otp;
  let sessionid = req.body.sessionid;

  try {
    const currentTime = new Date();

    // Check if the sessionid already exists
    const existingRecord = await MongoRegisteration.findOne({
      sessionid,
    }).session(session);

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

      await existingRecord.save({ session });
      // I need to send email here
      await awssendemail(email, emailOTP)
        .then((result) => console.log("Email sent successfully:", result))
        .catch((error) => console.error("Failed to send email:", error));

      await session.commitTransaction();

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
    const savedRecord = await newRecord.save({ session });
    // I need to send email here
    await awssendemail(email, emailOTP)
      .then((result) => console.log("Email sent successfully:", result))
      .catch((error) => console.error("Failed to send email:", error));

    await session.commitTransaction();

    res.status(201).json({
      message: "New record created. Please verify your email.",
      record: savedRecord,
    });
  } catch (error) {
    console.error("Error in /sendemail:", error);
    await session.abortTransaction();
    res.status(500).json({
      message: "Error processing the request",
      error,
    });
  } finally {
    session.endSession();
  }
});

// verify email
router.post("/verifyemail", async (req, res) => {
  console.log("Received in /verifyemail");
  const session = await MongoRegisteration.startSession();
  session.startTransaction();

  //   const { sessionid, otp } = req.body;
  console.log(req.body);
  let sessionid = req.body.sessionid;
  try {
    // Find the record by sessionid
    const existingRecord = await MongoRegisteration.findOne({
      sessionid,
    }).session(session);

    if (!existingRecord) {
      return res.status(404).json({
        message: "Session not found. Please request an OTP again.",
      });
    }

    // Check if the OTP matches
    if (existingRecord.emailOTP === req.body.emailotp) {
      existingRecord.emailverified = true; // Mark as verified
      await existingRecord.save({ session });
      await session.commitTransaction();

      return res.status(200).json({
        message: "Email verified successfully.",
      });
    } else {
      return res.status(400).json({
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error("Error in /verifyemail:", error);
    res.status(500).json({
      message: "Error verifying OTP.",
      error,
    });
  } finally {
    session.endSession();
  }
});

// send sms
router.post("/sendsms", async (req, res) => {
  console.log("Received in /sendsms");
  const session = await MongoRegisteration.startSession();
  session.startTransaction();

  let phone = req.body.phone;
  let sessionid = req.body.sessionid;
  let otp = req.body.otp;

  console.log(phone);
  console.log(sessionid);
  console.log(otp);

  try {
    const currentTime = new Date();

    // Check if the sessionid already exists
    const existingRecord = await MongoRegisteration.findOne({
      sessionid,
    }).session(session);

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

      await existingRecord.save({ session });

      // Send SMS
      await sendSMS(otp, `Your OTP is: ${otp}`)
        .then((result) => console.log("SMS sent successfully:", result))
        .catch((error) => console.error("Failed to send SMS:", error));

      await session.commitTransaction();
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
    await newRecord.save({ session });

    // Send SMS
    await sendSMS(otp, `Your OTP is: ${otp}`)
      .then((result) => console.log("SMS sent successfully:", result))
      .catch((error) => console.error("Failed to send SMS:", error));
    await session.commitTransaction();

    res.status(201).json({
      message: "New record created. Please verify your phone.",
      record: savedRecord,
    });
  } catch (error) {
    console.error("Error in /sendsms:", error);
    await session.abortTransaction();
    res.status(500).json({
      message: "Error processing the request",
      error,
    });
  } finally {
    session.endSession();
  }
});

router.post("/verifysms", async (req, res) => {
  console.log("Received in /verifysms");
  const session = await MongoRegisteration.startSession();
  session.startTransaction();

  let sessionid = req.body.sessionid;
  let phoneNumber = req.body.phoneNumber;
  let otp = req.body.smsotp;

  try {
    // Find the record by sessionid
    const existingRecord = await MongoRegisteration.findOne({
      sessionid,
    }).session(session);

    if (!existingRecord) {
      return res.status(404).json({
        message: "Session not found. Please request an OTP again.",
      });
    }

    // Check if the OTP matches
    if (existingRecord.handPhoneOTP === otp) {
      existingRecord.hpverified = true; // Mark as verified
      await existingRecord.save({ session });
      await session.commitTransaction();

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
    await session.abortTransaction();
    res.status(500).json({
      message: "Error verifying OTP.",
      error,
    });
  } finally {
    session.endSession();
  }
});

router.get("/checkverifications/:sessionid", async (req, res) => {
  console.log("/checkverifications");
  const session = await MongoRegisteration.startSession();
  session.startTransaction();

  sessionid = req.params;

  console.log(sessionid);
  try {
    // Find the record by sessionid
    const existingRecord = await MongoRegisteration.findOne({
      sessionid,
    }).session(session);

    if (!existingRecord) {
      return res.status(404).json({
        message: "Validation not found.",
      });
    }

    // Check if both hpverified and emailverified are true
    const isVerified =
      existingRecord.hpverified === true &&
      existingRecord.emailverified === true;

    await session.commitTransaction();

    return res.status(200).json({
      sessionid: sessionid,
      verified: isVerified,
    });
  } catch (error) {
    console.error("Error in /checkstatus:", error);
    await session.abortTransaction();

    res.status(500).json({
      message: "Error checking status.",
      error,
    });
  } finally {
    session.endSession();
  }
});
module.exports = router;

// Send SMS
router.post("/sendsms", async (req, res) => {
  const session = await MongoRegisteration.startSession();
  session.startTransaction();

  let { phone, sessionid, otp } = req.body;
  const currentTime = new Date();

  try {
    const existingRecord = await MongoRegisteration.findOne({
      sessionid,
    }).session(session);

    if (existingRecord) {
      const timeDifference =
        (currentTime - new Date(existingRecord.smsCreatedAt)) / 1000;

      if (existingRecord.smsCreatedAt && timeDifference < 30) {
        return res.status(429).json({
          message: "Please wait 30 seconds before resending the SMS.",
        });
      }

      existingRecord.handPhone = phone;
      existingRecord.handPhoneOTP = otp;
      existingRecord.hpcreatedAt = currentTime;
      existingRecord.hpverified = false;

      await existingRecord.save({ session });
      await sendSMS(otp, `Your OTP is: ${otp}`);

      await session.commitTransaction();
      return res.status(200).json({
        message: "SMS updated successfully. Please verify your phone.",
        record: existingRecord,
      });
    }

    const newRecord = new MongoRegisteration({
      sessionid,
      handPhone: phone,
      handPhoneOTP: otp,
      shpcreatedAt: currentTime,
      hpverified: false,
    });

    await newRecord.save({ session });
    await sendSMS(otp, `Your OTP is: ${otp}`);

    await session.commitTransaction();
    res.status(201).json({
      message: "New record created. Please verify your phone.",
      record: newRecord,
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error processing the request", error });
  } finally {
    session.endSession();
  }
});

// Save photo
router.post("/savephoto", async (req, res) => {
  const session = await MongoPhotoSubmission.startSession();
  session.startTransaction();

  const { EventId, userID, userName, Photourl } = req.body;

  try {
    // Check if the record already exists
    let submission = await MongoPhotoSubmission.findOne({
      EventID: EventId,
      AttendeeID: userID,
    }).session(session);

    if (submission) {
      // Filter out photos that already exist
      const newPhotos = Photourl.files.filter(
        (photo) => !submission.Photos.includes(photo),
      );

      if (newPhotos.length > 0) {
        // Append only new photos
        submission.Photos.push(...newPhotos);
        await submission.save({ session });
        await session.commitTransaction();
        return res.status(200).json({
          message: "Photos added successfully.",
          submission,
        });
      } else {
        await session.commitTransaction();
        return res.status(200).json({
          message: "No new photos to add. All provided photos already exist.",
          submission,
        });
      }
    } else {
      // If no record exists, create a new one
      submission = new MongoPhotoSubmission({
        EventID: EventId,
        AttendeeID: userID,
        username: userName,
        Photos: Photourl.files,
      });

      await submission.save({ session });
      await session.commitTransaction();
      return res.status(201).json({
        message: "New photo submission created successfully.",
        submission,
      });
    }
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("Error in /savephoto:", error);
    res.status(500).json({
      message: "Error saving photos.",
      error,
    });
  } finally {
    session.endSession();
  }
});

// Get photo submissions
// router.get("/getphotos/:EventID", async (req, res) => {
//   console.log("getphoto");
//   console.log(req.query);
//   //   console.log(req.body);

//   try {
//     const { EventID } = req.query; // Extract query parameters

//     // Build the query object based on provided filters
//     const query = { EventID };
//     // if (EventID) {
//     //   query.EventID = EventID;
//     // }
//     // Fetch photo submissions based on query
//     const photoSubmissions = await MongoPhotoSubmission.find(query);

//     if (photoSubmissions.length === 0) {
//       return res.status(404).json({
//         message: "No photo submissions found.",
//       });
//     }

//     return res.status(200).json({
//       message: "Photo submissions fetched successfully.",
//       data: photoSubmissions,
//     });
//   } catch (error) {
//     console.error("Error fetching photo submissions:", error);
//     return res.status(500).json({
//       message: "Error fetching photo submissions.",
//       error,
//     });
//   }
// });

router.get("/getphotos/:EventID", async (req, res) => {
  console.log("Fetching photos by EventID");

  try {
    // Extract EventID from route parameters
    const { EventID } = req.params;

    if (!EventID) {
      return res.status(400).json({
        message: "EventID is required to fetch photo submissions.",
      });
    }

    // Build the query object
    const query = { EventID };

    // Fetch photo submissions based on query
    const photoSubmissions = await MongoPhotoSubmission.find(query);

    if (photoSubmissions.length === 0) {
      return res.status(404).json({
        message: "No photo submissions found for the provided EventID.",
      });
    }

    return res.status(200).json({
      message: "Photo submissions fetched successfully.",
      data: photoSubmissions,
    });
  } catch (error) {
    console.error("Error fetching photo submissions:", error);
    return res.status(500).json({
      message: "Error fetching photo submissions.",
      error,
    });
  }
});

module.exports = router;
