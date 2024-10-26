const express = require("express");
const router = express.Router();
const User = require("../model/username");
const islogedIn = require("../middelware/login");
const uploads = require("../multer");
const Post = require("../model/postname");
const Comment = require("../model/comments");

router.get("/bio", islogedIn, async function (req, res) {
	try {
		const user = await User.findOne({
			username: req.session.passport.user,
		}).populate("blogs");

		if (!user) {
			return res.status(404).send("User not found");
		}

		res.render("profile", { user: user });
	} catch (err) {
		// Handle any errors that occur
		console.error(err);
		res.status(500).send("Server Error");
	}
});

router.get("/edit", islogedIn, async function (req, res) {
	const user = await User.findOne({ username: req.session.passport.user });
	res.render("edit", { user: user });
});

router.post(
	"/upload",
	islogedIn,
	uploads.single("image"),
	async function (req, res) {
		try {
			// Destructure necessary fields from the request body
			const { username, bio, AccountType } = req.body;

			// Find and update the user's username and bio
			const user = await User.findOneAndUpdate(
				{ username: req.session.passport.user },
				{ username, bio, AccountType },
				{ new: true }
			);

			// Handle case if the user is not found
			if (!user) {
				return res.status(404).send("User not found");
			}

			// If a file is uploaded, update the profile image
			if (req.file) {
				user.Image = req.file.filename;
			}
			await user.save();

			// Redirect to the bio page after updating
			res.redirect("/profile/bio");
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
);

router.post(
	"/update/:id",
	uploads.single("picture"),
	async function (req, res) {
		try {
			let { title, description, category } = req.body;
			let { id } = req.params;
			const picture = req.file;

			let post = await Post.findByIdAndUpdate(
				id,
				{ title, description, category },
				{ new: true }
			);
			if (!post) {
				return res.status(404).send("Post not found");
			}
			if (picture) {
				post.picture = picture.filename;
			}
			await post.save();

			res.redirect("/profile/bio");
		} catch (error) {
			console.error(error);
			res.status(500).send("Server Error");
		}
	}
);
router.get("/like/:id", async function (req, res) {
	try {
		let { id } = req.params;
		let user = await User.findOne({ username: req.session.passport.user });
		let post = await Post.findById(id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
		if (post.likes.indexOf(user._id) === -1) {
			post.likes.push(user._id);
		} else {
			post.likes.splice(post.likes.indexOf(user._id), 1);
		}

		await post.save();
		res.redirect("/profile/bio");
	} catch (error) {}
});

router.get("/delete/:id", async function (req, res) {
	try {
		let { id } = req.params;
		let post = await Post.findByIdAndDelete(id);
		if (!post) {
			return res.status(404).json({ message: "post not found" });
		}
		res.redirect("/profile/bio");
	} catch (error) {
		console.error(error);
		res.status(500).send("Server Error");
	}
});
module.exports = router;
