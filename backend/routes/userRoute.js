// routes/users.js
const express = require("express");
const router = express.Router();
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

// 2. User login
router.post("/login", async (req, res) => {
	// try {
	//     // Logic to handle login (check username/password, issue token, etc.)
	//     res.status(200).json({ message: 'Login successful' });
	// } catch (error) {
	//     res.status(400).json({ error: error.message });
	// }
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
