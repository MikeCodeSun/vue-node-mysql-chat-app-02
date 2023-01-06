const jwt = require("jsonwebtoken");

module.exports = (token, secret) => {
  const decoded = jwt.verify(token, secret);
  return decoded;
};
