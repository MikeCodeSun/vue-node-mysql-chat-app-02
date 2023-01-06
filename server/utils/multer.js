const multer = require("multer");

module.exports = multer({
  limits: 3 * 1024 * 1024,
});
