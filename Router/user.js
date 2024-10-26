const express = require("express");
const router = express.Router();
const passport = require("passport");
const initializingPassport = require("../middelware/passport"); // Corrected 'middelware' to 'middleware'
const bcrypt = require("bcrypt");
const User = require("../model/username");
initializingPassport(passport); // Initialize passport strategies
const genratetoken = require("../utils/islogedin");
const Post = require("../model/postname");

// Route to home page

router.get("/home", async function (req, res) {
	const rnproduct = await Post.aggregate([{ $sample: { size: 1 } }]);
	const rnpost = await Post.aggregate([{ $sample: { size: 3 } }]);
	res.render("index", { user: req.user || null, rnproduct, rnpost });
});

// Route to sign-up page
router.get("/sign", async function (req, res) {
	res.render("signup");
});

// Route to handle user registration
router.post("/register", async function (req, res) {
	let { username, email, password } = req.body;
	try {
		let user = await User.findOne({ username });
		if (user) {
			return res.status(401).send("User is already registered");
		}

		const salt = await bcrypt.genSalt(10); // Use await for promises
		const hash = await bcrypt.hash(password, salt); // Use await for promises

		let newUser = await User.create({
			username,
			email,
			password: hash,
		});
		let token = genratetoken({ email });
		res.cookie("token", token, {
			httpOnly: true,
			secure: true,
			maxage: 30 * 24 * 60 * 60 * 1000,
		});
		return res.redirect("/signin");
	} catch (err) {
		console.error("Error during user sign-up:", err);
		return res.status(500).send({ message: "Server error", success: false });
	}
});

// Route to sign-in page
router.get("/signin", function (req, res) {
	res.render("signin");
});

// Route to handle user login
router.post(
	"/loged", // Corrected the route name from '/loged'
	passport.authenticate("local", {
		successRedirect: "/home",
		failureRedirect: "/signin", // Optional: Redirect on failure
	})
);

router.get("/logout", function (req, res, next) {
	req.logout(function (err) {
		if (err) return next(err);
		req.session.destroy((err) => {
			if (err) return next(err);
			res.clearCookie("connect.sid", { path: "/" }); // specify path and other options
			res.redirect("/home");
		});
	});
});

module.exports = router;
