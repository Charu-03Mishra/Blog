const express = require("express");
const app = express();
const path = require("path");
const express_session = require("express-session"); // Corrected typo here
const passport = require("passport");
const router = require("./Router/user");
const profileRoute = require("./Router/profile");
const postRoute = require("./Router/blog");

const db = require("./config/mongoose");
const User = require("./model/username");

const cookie = require("cookie-parser");
const bodyParser = require("body-parser");

require("dotenv").config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(cookie());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
	express_session({
		// Corrected typo here
		resave: false,
		secret: `${process.env.SECRET}`,
		saveUninitialized: false,
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", router);
app.use("/profile", profileRoute);
app.use("/post", postRoute);

app.listen(3000);
