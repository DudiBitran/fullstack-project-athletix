const express = require("express");
const router = express.Router();
const {
  WorkoutStatus,
  workoutStatusValidation,
} = require("../../model/workoutStatus");
const authMw = require("../../middleware/auth");
const { permitRoles } = require("../../middleware/role");
const logger = require("../../fileLogger/fileLogger");

router.post("/", authMw, permitRoles("user"), async (req, res) => {
  // 1. Validate input
  const { error } = workoutStatusValidation.validate(req.body);
  if (error) {
    res.status(400).send({
      message: "Input validation error.",
      details: error.details.map((e) => e.message),
    });
    logger.error(
      `status: ${res.statusCode} | Message: ${error.details.map(
        (e) => e.message
      )}`
    );
    return;
  }

  const { programId, day, completed } = req.body;

  try {
    const existing = await WorkoutStatus.findOne({
      user: req.user._id,
      programId,
      day,
    });

    if (existing) {
      existing.completed = completed;
      await existing.save();
      res.send("Workout status updated.");
      logger.info(
        `Status: ${res.statusCode} | Workout status updated for user ${req.user._id} on ${day}`
      );
      return;
    }

    const newStatus = await new WorkoutStatus({
      user: req.user._id,
      programId,
      day,
      completed,
    }).save();

    logger.info(
      `Status: ${res.statusCode} | Workout status created for user ${req.user._id} on ${day}`
    );
    res.send("Workout status recorded.");
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(
      `Status: ${res.statusCode} | Workout status error: ${err.message}`
    );
  }
});

module.exports = router;
