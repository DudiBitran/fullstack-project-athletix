const express = require("express");
const router = express.Router();
const { WorkoutStatus } = require("../../model/workoutStatus");
const authMw = require("../../middleware/auth");
const { permitRoles } = require("../../middleware/role");

// personal progress by percents
router.get("/progress", authMw, permitRoles("user"), async (req, res) => {
  try {
    const statuses = await WorkoutStatus.find({ user: req.user._id });
    if (!statuses.length)
      return res.status(404).send("No workout status found.");

    const totalDays = 7;
    const completedDays = statuses.filter((s) => s.completed).length;
    const percentage = ((completedDays / totalDays) * 100).toFixed(2);

    res.send({
      programId: statuses[0].programId,
      completedDays,
      totalDays,
      percentage: Number(percentage),
    });
  } catch (err) {
    res.status(500).send("Internal server error.");
  }
});

// get the progress by days
router.get(
  "/weekly-activity",
  authMw,
  permitRoles("user"),
  async (req, res) => {
    try {
      const statuses = await WorkoutStatus.find({ user: req.user._id });
      const result = {
        Sunday: 0,
        Monday: 0,
        Tuesday: 0,
        Wednesday: 0,
        Thursday: 0,
        Friday: 0,
        Saturday: 0,
      };

      statuses.forEach(({ day, completed }) => {
        if (completed) result[day]++;
      });

      res.send(result);
    } catch (err) {
      res.status(500).send("Internal server error.");
    }
  }
);

// get progress of users by percents for admin and trainers
router.get(
  "/completion/:userId",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    try {
      const statuses = await WorkoutStatus.find({ user: req.params.userId });
      if (!statuses.length) return res.status(404).send("No status found.");

      const completed = statuses.filter((s) => s.completed).length;
      const percentage = ((completed / 7) * 100).toFixed(2);

      res.send({
        userId: req.params.userId,
        completedDays: completed,
        percentage: Number(percentage),
      });
    } catch (err) {
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;
