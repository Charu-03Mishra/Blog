const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		blogs: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "blog", // Ensure this matches the name of your Blog model
			},
		],
		comment: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "comment", // Ensure this matches the name of your Blog model
			},
		],

		bio: {
			type: String,
		},
		Image: {
			type: String,
		},
		AccountType: {
			type: String,
		},
	},
	{ timestamps: true }
);

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model("user", UserSchema);

module.exports = User;
