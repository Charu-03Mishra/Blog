const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	blog: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "blog",
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	content: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const comment = mongoose.model("comment", commentSchema);
module.exports = comment;
