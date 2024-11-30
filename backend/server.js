const express = require("express");
const sequelize = require("./models/index");

// Import models
// const Event = require('./models/event');
const EventSponsor = require("./models/eventsponsor");
const Organization = require("./models/organization");
// const Sponsor = require('./models/sponsor');
const User = require("./models/user");
const UserEvent = require("./models/userevent");
const Venue = require("./models/venue");
const Category = require("./models/category");

// Import the function to populate mock data
const populateMockData = require("./mockdata/populateMockData"); // Update this path accordingly

// import all the routes here
const eventRoutes = require("./routes/eventRoute");
const organizationRoutes = require("./routes/organizationRoute");
const userRoutes = require("./routes/userRoute");

const app = express();
app.use(express.json());

// Enable CORS for all routes
const cors = require("cors");
const verifyToken = require("./middleware/verifyToken");
app.use(cors());
// temp
const corsOptions = {
  origin: "http://localhost:4200", // Only allow this origin
  optionsSuccessStatus: 200, // Some legacy browsers choke on 204
};
app.use(cors(corsOptions));

// Use the routes for each resource
app.use("/user", userRoutes);
// app.use('/ticket', ticketRoutes);
// app.use('/venue',  venueRoutes);
// app.use("/sponsor", SponsorRoutes);
// app.use('/attendee', attendeeRoutes);

app.use("/event", eventRoutes);

app.use("/organization", organizationRoutes);

// Routes Example (List all venues)
// app.post("/register", async (req, res) => {
// 	console.log("Request received on /user/register");
// 	console.log(req.body); // This will log the body sent in the request

// 	try {
// 		const user = req.body;
// 		res.status(201).json(user);
// 	} catch (error) {
// 		res.status(400).json({ error: error.message });
// 	}
// });

// localhost:3000/venues
app.get("/venues", async (req, res) => {
  console.log("venues");
  try {
    const venues = await Venue.findAll();
    res.json(venues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/venues/:id", async (req, res) => {
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

// Ticket Purchase
app.post("/userevent/purchase", verifyToken, async (req, res) => {
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

// Event Sponsorship
app.post("/eventsponsor", async (req, res) => {
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

// category
app.get("/category/getcategories", async (req, res) => {
  console.log("get categories");
  try {
    let categories = await Category.findAll();

    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Set up associations
require("./models/associations"); // This file contains all the association logic

// for mongodb
// For mongodb related
const connectMongoDB = require("./mongodb/mongodb.js"); // MongoDB connection file
connectMongoDB();
const mongoController = require("./mongodb/Controller/controller.js");

app.use("/mongo", mongoController);
// end of mongodb

// for concurrency
const { Transaction } = require("sequelize");

async function executeWithRetry(task, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const transaction = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
    });
    // try to commit / retry
    try {
      await task(transaction);
      await transaction.commit();
      return;
    } catch (error) {
      await transaction.rollback();
      if (
        error.name === "SequelizeDatabaseError" &&
        error.parent.code === "ER_LOCK_DEADLOCK" &&
        attempt < retries
      ) {
        console.log(
          `Retrying transaction (${attempt}/${retries}) due to deadlock...`,
        );
      } else {
        throw error;
      }
    }
  }
}

async function testConcurrency2() {
  console.log("\n\nTest concurrency \n");

  const task1 = async (transaction) => {
    const user1 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    console.log(`name @task1: ${user1.Name}`);
    user1.Name = "Updated by Transaction 1";
    await user1.save({ transaction });
  };

  const task2 = async (transaction) => {
    const user2 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    console.log(`name @task2: ${user2.Name}`);
    user2.Name = "Updated by Transaction 2.";
    await user2.save({ transaction });
  };

  const task3 = async (transaction) => {
    const user3 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    console.log(`name @task3: ${user3.Name}`);
    user3.Name = "Updated by Transaction 3";
    await user3.save({ transaction });
  };

  const task4 = async (transaction) => {
    const user4 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    console.log(`name @task4: ${user4.Name}`);
    user4.Name = "Updated by Transaction 4";
    await user4.save({ transaction });
  };

  const task5 = async (transaction) => {
    const user5 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    // console.log("name: " + user5.Name + " \n");
    console.log(`name @task5: ${user5.Name}`);

    user5.Name = "Updated by Transaction 5";
    await user5.save({ transaction });
  };

  try {
    // Execute all tasks concurrently with retry logic
    await Promise.all([
      executeWithRetry(task1),
      executeWithRetry(task2),
      executeWithRetry(task3),
      executeWithRetry(task4),
      executeWithRetry(task5),
    ]);

    console.log("All transactions completed successfully");
  } catch (error) {
    console.error("Error during concurrency test:", error);
  }
}

// this works.
// do not touch this for now
async function testConcurrency1() {
  console.log("Test concurrency \n");

  const task1 = async (transaction) => {
    const user1 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    user1.Name = "Updated by Transaction 1";
    await user1.save({ transaction });
  };

  const task2 = async (transaction) => {
    const user2 = await User.findOne({
      where: { UserID: 1 },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });
    user2.Name = "Updated by Transaction 2.";
    await user2.save({ transaction });
  };

  try {
    // Execute both tasks concurrently with retry logic
    await Promise.all([executeWithRetry(task1), executeWithRetry(task2)]);

    console.log("Both transactions completed successfully");
  } catch (error) {
    console.error("Error during concurrency test:", error);
  }
}

// async function testIsolationLevel() {
//   const transaction = await sequelize.transaction({
//     isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE, // Correct usage
//   });

//   try {
//     const [results] = await sequelize.query("SELECT 1", { transaction }); // Example query
//     console.log("Query results:", results);

//     await transaction.commit();
//     console.log("Transaction committed");
//   } catch (error) {
//     console.error("Error during transaction:", error);
//     await transaction.rollback();
//   }
// }

// Sync database and start the server
sequelize
  .sync({ force: true }) // force: true will drop tables if they exist
  //   .sync({ force: false }) // force: true will drop tables if they exist
  .then(() => {
    console.log("Database synced");
    (async () => {
      try {
        // populate data
        await populateMockData();
        console.log("Mock data populated successfully.");

        // Start server
        app.listen(3000, () => console.log("Server is running on port 3000"));

        //concurrency type of code
        // the 2 are ok and checked
        // testConcurrency1();
        testConcurrency2(); // more task as compared to the first one
      } catch (error) {
        console.error("Error populating mock data:", error);
      }
    })();
  })
  .catch((err) => console.log("Error syncing database: " + err));
