const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	picture: {
		type: String,
	},
	title: {
		type: String,
		require: true,
	},
	description: {
		type: String,
		require: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	likes: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "user",
		},
	],
	comment: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "comment",
		},
	],
	category: {
		type: String,
		require: true,
	},
});

// Use 'Post' for the model name for consistency
const Post = mongoose.model("blog", PostSchema);

module.exports = Post;
