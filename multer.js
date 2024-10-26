const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");

// Ensure the directory exists
const uploadDir = path.join(__dirname, "public", "images", "uploads");
if (fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

const diskStorage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, uploadDir); // Changed from a string to a variable
	},

	filename: function (req, file, cb) {
		const unique = uuidv4();
		cb(null, unique + path.extname(file.originalname));
	},
});

const uploads = multer({ storage: diskStorage });

module.exports = uploads;
