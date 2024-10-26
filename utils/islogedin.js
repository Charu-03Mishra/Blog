let jwt = require("jsonwebtoken");
require("dotenv").config();

const genratetoken = (data) => {
	jwt.sign(data, process.env.JWT_PRIVATE);
};
module.exports = genratetoken;
