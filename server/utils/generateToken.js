const jwt = require("jsonwebtoken");
module.exports = (id, name, email, avatar, verify, secret, expiresIn) => {
  return jwt.sign({ id, name, email, avatar, verify }, secret, { expiresIn });
};
