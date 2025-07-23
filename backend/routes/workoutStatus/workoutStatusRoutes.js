// routes/workoutStatusRoutes.js
const express = require("express");
const router = express.Router();
const {
  WorkoutStatus,
  workoutStatusValidation,
} = require("../../model/workoutStatus");
const authMw = require("../../middleware/auth");
const { permitRoles } = require("../../middleware/role");
const logger = require("../../fileLogger/fileLogger");

// Create or update a workout status by date
router.patch("/", authMw, permitRoles("user"), async (req, res) => {
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

  const { programId, date, completed } = req.body;
  const parsedDate = new Date(date);

  try {
    const existing = await WorkoutStatus.findOne({
      user: req.user._id,
      programId,
      date: parsedDate,
    });

    if (existing) {
      existing.completed = completed;
      await existing.save();
      res.send("Workout status updated.");
      logger.info(
        `Status: ${res.statusCode} | Workout status updated for user ${
          req.user._id
        } on ${parsedDate.toDateString()}`
      );
      return;
    }

    const newStatus = await new WorkoutStatus({
      user: req.user._id,
      programId,
      date: parsedDate,
      completed,
    }).save();

    res.send({ message: "Workout status recorded.", newStatus });
    logger.info(
      `Status: ${res.statusCode} | Workout status created for user ${
        req.user._id
      } on ${parsedDate.toDateString()}`
    );
  } catch (err) {
    console.log(err);
    
    res.status(500).send("Internal server error.");
    logger.error(
      `Status: ${res.statusCode} | Workout status error: ${err.message}`
    );
  }
});

// Get all workout statuses for a user
router.get("/", authMw, permitRoles("user"), async (req, res) => {
  try {
    const workoutStatus = await WorkoutStatus.find({ user: req.user._id });

    const statusByDate = workoutStatus.map(({ date, completed }) => ({
      date: date.toISOString().split("T")[0],
      completed,
    }));

    res.send({
      userId: req.user._id,
      statuses: statusByDate,
    });

    logger.info(
      `Status: ${res.statusCode} | Workout status retrieved for user ${req.user._id}.`
    );
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(
      `Status: ${res.statusCode} | Workout status error: ${err.message}`
    );
  }
});

module.exports = router;
