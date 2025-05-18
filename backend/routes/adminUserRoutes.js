const express = require("express");
const router = express.Router();
const { User, updateValidation } = require("../model/user");
const logger = require("../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../middleware/role");
const authMw = require("../middleware/auth");

router.get("/", authMw, permitRoles("admin"), async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(400).send("User not found.");
      logger.error(`status: ${res.statusCode} | Message: User not found.`);
      return;
    }
    res.send(users);
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

router.put(
  "/:id/assign-trainer",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      res.status(400).send("No data provided.");
      logger.error(`status: ${res.statusCode} | Message: No data provided.`);
      return;
    }
    const { trainerId } = req.body;
    if (!trainerId) {
      res.status(400).send("trainerId is required.");
      logger.error(
        `status: ${res.statusCode} | Message: trainerId is required.`
      );
      return;
    }
    try {
      const { trainerId } = req.body;
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send("User not found.");
        logger.error(`status: ${res.statusCode} | Message: User not found.`);
        return;
      }
      if (req.user.role === "trainer" && req.user._id !== trainerId) {
        res.status(403).send("Trainers can only assign themselves.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to assign, Trainers can only assign themselves.`
        );
        return;
      }

      const trainer = await User.findById(trainerId);
      if (!trainerId || trainer.role !== "trainer") {
        res.status(400).send("Invalid trainer ID.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to assign, Invalid trainer ID.`
        );
        return;
      }
      if (user.assignedTrainerId.toString() === trainerId) {
        res.status(400).send("User already assigned to this trainer.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to assign, User already assigned to this trainer.`
        );
        return;
      }
      user.assignedTrainerId = trainerId;
      await user.save();
      logger.info(
        `status: ${res.statusCode} | Message: User ${userId} assigned to trainer ${trainerId}`
      );

      res.send({
        message: "Trainer assigned successfully.",
        userId: user._id,
        assignedTrainerId: trainerId,
      });
    } catch (err) {
      logger.error(`status: 500 | Message: ${err.message}`);
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;
