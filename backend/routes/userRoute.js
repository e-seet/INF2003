// routes/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming a User model exists
const Organization = require("../models/organization");
const verifyToken = require("../middleware/verifyToken");

const SECRET_KEY = "TEMP_KEY";

// 1. Register a new user
router.post("/register", async (req, res) => {
  console.log("Running registration process");
  console.log("Request Body:", req.body);

  try {
    // Step 1: Find or create the Organization based on OrganizationName
    let organization = await Organization.findOne({
      where: { OrganizationName: req.body.OrganizationName },
      attributes: ["OrganizationID"], // Only retrieve OrganizationID
    });

    // If the organization does not exist, create a new one
    if (!organization) {
      console.log("Organization not found. Creating a new organization...");

      organization = await Organization.create({
        OrganizationName: req.body.OrganizationName,
      });

      console.log(
        "New organization created with ID:",
        organization.OrganizationID,
      );
    } else {
      console.log("Organization found with ID:", organization.OrganizationID);
    }

    // Step 2: Create a new user with the OrganizationID
    let newUser = await User.create({
      Name: req.body.Name,
      Password: req.body.Password,
      Email: req.body.Email,
      Phone: req.body.Phone,
      OrganizationID: organization.OrganizationID, // Use the existing or new OrganizationID
    });

    console.log("User created successfully:", newUser);
    console.log("Waiting for new request\n");

    // Return the created user
    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error during registration process:", error);
    console.log("Waiting for new request\n");
    res.status(400).json({ error: error.message });
  }
  // try {
  //     // const user = await User.create(req.body);  // Create new user with request body
  //     res.status(201).json(user);
  // } catch (error) {
  //     res.status(400).json({ error: error.message });
  // }
});

// POST route for user login
router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body; // Extract email and password from request body
    // Check if the user with the given email exists in the database
    const user = await User.findOne({ where: { Email } });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found. Please register first." });
    }

    // Check if the password is correct by comparing it to the hashed password in the database
    const isPasswordValid = await bcrypt.compare(
      Password,
      user.dataValues.Password,
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Invalid password. Please try again." });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userID: user.UserID,
        name: user.Name,
        email: user.Email,
        phone: user.Phone,
        photoUrl: user.Photourl,
        organizationID: user.OrganizationID,
      },
      SECRET_KEY,
      { expiresIn: "1h" }, // Token expires in 1 hour
    );
    // If successful, return user information (excluding sensitive fields like password)
    const userResponse = {
      Name: user.Name,
      Email: user.Email,
      Phone: user.Phone,
      photoUrl: user.Photourl,
      OrganizationID: user.OrganizationID,
    };

    // Return token and user information
    return res.status(200).json({
      message: "Login successful!",
      token: token,
      user: {
        Name: user.Name,
        Email: user.Email,
        Phone: user.Phone,
        photoUrl: user.Photourl,
        OrganizationID: user.OrganizationID,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res
      .status(500)
      .json({ error: "Something went wrong. Please try again later." });
  }
});

// edit user profile
router.post("/editProfile", verifyToken, async (req, res) => {
  console.log("\nedit profile\n");
  let decodedToken = req.user;

  const userId = decodedToken.userID; // Extract userID from decoded token
  const updatedData = req.body;
  try {
    // Find or create the organization by name
    const orgdata = await Organization.findOrCreate({
      where: {
        OrganizationName: updatedData.OrganizationName,
      },
    });

    // Set OrganizationID in updated data
    updatedData.OrganizationID = orgdata[0].OrganizationID;

    // Update user data with the new OrganizationID
    const [updated] = await User.update(updatedData, {
      where: { userID: userId },
    });

    // Handle response based on whether the update was successful
    if (updated > 0) {
      res.status(200).json({ message: "User updated successfully." });
    } else {
      res.status(400).json({ message: "User not found or no changes made." });
    }
  } catch (error) {
    // Send error response if an exception occurs
    res.status(500).json({ error: error.message });
  }
});

// Get the user's organization name
router.get("/profile/organization", verifyToken, async (req, res) => {
  let decodedToken = req.user;

  try {
    const user = await User.findByPk(decodedToken.userID);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Update user profile
// router.put('/profile', verifyToken, async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id);
//     if (!user) return res.status(404).send('User not found');

//     const { name, phoneNumber, organizationName } = req.body;
//     user.name = name;
//     user.phoneNumber = phoneNumber;
//     user.organizationName = organizationName;
//     await user.save();

//     res.json(user);
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// Remove profile picture upload route
// router.post('/profile/picture', verifyToken, upload.single('profilePicture'), async (req, res) => {
//   try {
//     const user = await User.findByPk(req.user.id);
//     if (!user) return res.status(404).send('User not found');

//     user.profilePictureUrl = `/uploads/${req.file.filename}`;
//     await user.save();

//     res.json({ profilePictureUrl: user.profilePictureUrl });
//   } catch (error) {
//     res.status(500).send('Server error');
//   }
// });

// 3. Get user profile
router.get("/profile", verifyToken, async (req, res) => {
  console.log("profile route\n");

  let decodedToken = req.user;
  console.log(decodedToken.userID);
  try {
    data = await User.findOne({
      where: { UserID: decodedToken.userID },
      include: [
        {
          model: Organization,
          //   as: "organization",
          attributes: ["OrganizationName"],
        },
      ],
    });
    console.log(data);
    res.json(data);
  } catch (error) {
    console.log("error");
    console.log(error);
  }
});

module.exports = router;
