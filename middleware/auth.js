// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
