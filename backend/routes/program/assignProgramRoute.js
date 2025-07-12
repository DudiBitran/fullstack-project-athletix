const express = require("express");
const router = express.Router();
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const { Program } = require("../../model/program");
const { User } = require("../../model/user");

router.patch(
  "/:programId/:userId/assign-user",
  authMw,
  permitRoles("trainer"),
  async (req, res) => {
    const { programId } = req.params;
    const { userId } = req.params;

    try {
      const program = await Program.findById(programId);
      if (!program) return res.status(404).send("Program not found");

      const user = await User.findById(userId);
      if (!user) return res.status(404).send("User not found");

      if (user.programs.length !== 0)
        return res.status(400).send("User already has an assigned program.");

      if (req.user._id.toString() !== program.trainer.toString()) {
        return res.status(403).send("Not authorized to assign this program.");
      }

      program.assignedTo = userId;
      await program.save();

      user.programs = programId;
      await user.save();
      res.send("User assigned successfully.");
      logger.info(
        `status: ${res.statusCode} | Message: User assigned successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

router.patch(
  "/:programId/:userId/unassign-user",
  authMw,
  permitRoles("trainer", "admin"),
  async (req, res) => {
    const { programId, userId } = req.params;
    try {
      const user = await User.findById(userId);

      if (!user) return res.status(404).send("User not found.");

      const program = await Program.findById(programId);
      if (!program) return res.status(404).send("Program not found");

      if (!user.programs || user.programs.toString() !== programId) {
        return res.status(400).send("User is not assigned to this program.");
      }

      user.programs = null;
      await user.save();

      program.assignedTo = null;
      await program.save();
      res.send("User unassigned successfully.");
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
