const logger = require("../fileLogger/fileLogger");
const { User } = require("../model/user");

function permitRoles(...allowedRoles) {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user || !allowedRoles.includes(user.role)) {
        res.status(403).send("Access denied.");
        logger.error(`status: ${res.statusCode} | Message: Access denied.`);
        return;
      }

      next();
    } catch (err) {
      logger.error(`status: 500 | Message: ${err.message}`);
      res.status(500).send("Internal server error.");
    }
  };
}

module.exports = {
  permitRoles,
};
