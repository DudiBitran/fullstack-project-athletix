const logger = require("../fileLogger/fileLogger");

function permitRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).send("Access denied.");
      logger.error(`status: ${req.statusCode} | Message: Access denied.`);
      return;
    }
    next();
  };
}

module.exports = {
  permitRoles,
};
