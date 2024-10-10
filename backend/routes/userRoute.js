// routes/users.js
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require("../models/user"); // Assuming a User model exists
const Organization = require("../models/organization");

// 1. Register a new user
router.post("/register", async (req, res) => {
	console.log("running");
	console.log(req.body);

	try {
		// Step 1: Find the OrganizationID based on OrganizationName
		var organization = await Organization.findOne({
			where: {
				OrganizationName: req.body.OrganizationName,
			},
			attributes: ["OrganizationID"], // Only retrieve OrganizationID
		});

		if (organization) {
			console.log("Organization found with ID:", organization.OrganizationID);

			let newUser = await User.create({
				Name: req.body.Name,
				Password: req.body.Password,
				Email: req.body.Email,
				Phone: req.body.Phone,
				OrganizationID: organization.OrganizationID,
			});

			console.log("User created successfully:", newUser);
			console.log("waiting for new request\n");
			// return newUser;
	    	res.status(201).json(newUser);
		} 
		else 
		{
			console.log("Organization not found");
			console.log("waiting for new request\n");
		    res.status(400).json({ error: error.message });
		}
	} catch (error) {
		console.error("Error creating user:", error);
		console.log("waiting for new request\n");
	    res.status(400).json({ error: error.message });
	}

	// try {
	//     // const user = await User.create(req.body);  // Create new user with request body
	//     res.status(201).json(user);
	// } catch (error) {
	//     res.status(400).json({ error: error.message });
	// }
});

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'TEMP_KEY';
// POST route for user login
router.post('/login', async (req, res) => {
	try {	
	  const { Email, Password } = req.body; // Extract email and password from request body
  
	  // Check if the user with the given email exists in the database
	  const user = await User.findOne({ where: { Email } });
  
	  if (!user) {
		return res.status(404).json({ error: 'User not found. Please register first.' });
	  }
  
	  // Check if the password is correct by comparing it to the hashed password in the database
	  const isPasswordValid = await bcrypt.compare(Password, user.Password);
  
	  if (!isPasswordValid) {
		return res.status(401).json({ error: 'Invalid password. Please try again.' });
	  }
	  
	  // Generate JWT token
	  const token = jwt.sign(
		{
		  userId: user.UserID,
		  name: user.Name,
		  email: user.Email,
		  phone: user.Phone,
		  organizationID: user.OrganizationID,
		},
		SECRET_KEY,
		{ expiresIn: '1h' } // Token expires in 1 hour
	  );
	  // If successful, return user information (excluding sensitive fields like password)
	  const userResponse = {
		Name: user.Name,
		Email: user.Email,
		Phone: user.Phone,
		OrganizationID: user.OrganizationID,
	  };
  
	  // Return token and user information
	  return res.status(200).json({
		message: 'Login successful!',
		token: token, 
		user: {
		  Name: user.Name,
		  Email: user.Email,
		  Phone: user.Phone,
		  OrganizationID: user.OrganizationID,
		},
	  });
	} catch (error) {
	  console.error('Error during login:', error);
	  res.status(500).json({ error: 'Something went wrong. Please try again later.' });
	}
  });

// 3. Get user wishlist
router.get("/:id/wishlist", async (req, res) => {
	// try {
	//     // Logic to fetch user's wishlist (events they've saved)
	//     res.json({ wishlist: [] });  // Placeholder response
	// } catch (error) {
	//     res.status(500).json({ error: error.message });
	// }
});

module.exports = router;
