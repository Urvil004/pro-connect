const cloudinary = require("cloudinary").v2;

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dmcttdza4",
  api_key: process.env.CLOUDINARY_API_KEY || "166559345995163",
  api_secret: process.env.CLOUDINARY_API_SECRET || "UYJ7rRnBD9Z6AJdxRn788dWMBQA",
});

module.exports = cloudinary;
