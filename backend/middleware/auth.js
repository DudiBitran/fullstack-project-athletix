const jwt = require("jsonwebtoken");
const logger = require("../fileLogger/fileLogger");

module.exports = (req, res, next) => {
  const token = req.headers["x-auth-token"];
  if (!token) {
    res.status(400).send("Access denied, No token provided.");
    logger.error(
      `status: ${res.statusCode} | Message: Access denied, No token provided.`
    );
    return;
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    req.user = payload;
    next();
  } catch {
    res.status(400).send("Invalid token.");
    logger.error(`status: ${res.statusCode} | Message: Invalid token.`);
  }
};
