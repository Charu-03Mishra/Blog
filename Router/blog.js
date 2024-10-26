const express = require("express");
const router = express.Router();
const User = require("../model/username");
const islogedIn = require("../middelware/login");
const Post = require("../model/postname");
const Comment = require("../model/comments");
const uploads = require("../multer");

router.get("/blog", islogedIn, async function (req, res) {
	try {
		const user = await User.findOne({ username: req.session.passport.user });
		const comment = await Comment.find();
		const blog = await Post.find()
			.populate("user")
			.populate({
				path: "comment",
				populate: {
					path: "user", // Populate the user field within each comment
				},
			});
		res.render("blog", { blog, user, comment });
	} catch (error) {
		console.error("Error fetching blogs:", error);
		res.status(500).send("Error fetching blogs");
	}
});

router.get("/create", islogedIn, async function (req, res) {
	res.render("createpost");
});

router.post("/creates", uploads.single("picture"), async function (req, res) {
	try {
		let { title, description, category } = req.body;
		let users = await User.findOne({ username: req.session.passport.user });

		let post = await Post.create({
			category,
			description,
			title,
			user: users._id,
			picture: req.file.filename,
		});

		users.blogs.push(post._id);
		await users.save();

		res.redirect("/post/blog");
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

router.post("/:id/comment", islogedIn, async (req, res) => {
	const { id } = req.params;

	try {
		const user = await User.findOne({
			username: req.session.passport.user,
		});

		if (!user) {
			return res.status(404).send("User not found");
		}
		const blog = await Post.findById(id);
		if (!blog) return res.status(501).send("Blog not found");

		const comment = await Comment.create({
			content: req.body.content,
			blog: id,
			user: user._id,
		});

		blog.comment.push(comment._id);
		await blog.save();
		res.redirect("/post/blog");
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

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
		res.redirect("/post/blog");
	} catch (error) {
		res.status(500).send("Server Error");
	}
});

module.exports = router;
