const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Blog");

let db = mongoose.connection;

module.exports = db;
