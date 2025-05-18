const express = require("express");
const router = express.Router();
const { User, updateValidation } = require("../model/user");
const logger = require("../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../middleware/role");
const authMw = require("../middleware/auth");

router.get(
  "/me",
  authMw,
  permitRoles("user", "trainer", "admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(`status: ${res.statusCode} | Message: User not found.`);
        return;
      }
      res.send(user);
      logger.info(
        `status: ${res.statusCode} | Message: User sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

router.put(
  "/me",
  authMw,
  permitRoles("user", "trainer", "admin"),
  async (req, res) => {
    const { error } = updateValidation.validate(req.body);
    if (error) {
      res.status(400).send({
        message: "Invalid input fields",
        details: error.details.map((e) => e.message),
      });
      logger.error(
        `status: ${
          res.statusCode
        } | Message: User failed to register, ${error.details.map(
          (e) => e.message
        )}`
      );
      return;
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to update, User not found.`
        );
        return;
      }
      res.send(user);
      logger.info(
        `status: ${res.statusCode} | Message: User updated successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

router.delete(
  "/me",
  authMw,
  permitRoles("admin", "trainer", "user"),
  async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.user._id);
      if (!deletedUser) {
        res.status(400).send("User not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to delete, User not found.`
        );
        return;
      }
      res.send(deletedUser);
      logger.info(
        `status: ${res.statusCode} | Message: User deleted successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
