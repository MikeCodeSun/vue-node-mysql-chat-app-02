const jwt = require("jsonwebtoken");
// get cookie
module.exports = (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    res.locals.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
