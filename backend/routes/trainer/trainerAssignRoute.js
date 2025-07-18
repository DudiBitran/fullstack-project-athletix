const express = require("express");
const router = express.Router();
const { User, AssignTrainerValidation } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const { Trainer } = require("../../model/trainer");

// Admin / Trainer assign the trainer to the user
router.put(
  "/:id/assign-trainer",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    try {
      const userId = req.params.id;
      let trainerUser;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send("User not found.");
        logger.error(`status: ${res.statusCode} | Message: User not found.`);
        return;
      }

      if (user.role === "trainer") {
        res.status(400).send("Cannot assign trainer to another trainer.");
        logger.error(
          `status: ${res.statusCode} | Message: Cannot assign trainer to another trainer.`
        );
        return;
      }

      if (user.assignedTrainerId !== null) {
        res.status(400).send("User already assigned to trainer.");
        logger.error(
          `status: ${res.statusCode} | Message: User already assigned to trainer.`
        );
        return;
      }

      trainerUser = await User.findById(req.user._id);
      if (trainerUser.role === "trainer") {
        trainerUser = trainerUser._id.toString();
      } else if (req.user.role === "admin") {
        trainerUser = req.body?.trainerUser;

        const { error } = AssignTrainerValidation.validate({ trainerUser });
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
      }

      const trainer = await User.findById(trainerUser);
      if (!trainer || trainer.role !== "trainer") {
        res.status(400).send("Invalid trainer ID.");
        logger.error(
          `status: ${res.statusCode} | Message: Invalid trainer ID.`
        );
        return;
      }

      user.assignedTrainerId = trainerUser;
      await user.save();

      const trainerDoc = await Trainer.findOneAndUpdate(
        { userId: trainerUser },
        { $addToSet: { clients: userId } },
        { new: true }
      );

      if (!trainerDoc) {
        res.status(404).send("Trainer profile not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Trainer profile not found.`
        );
        return;
      }

      logger.info(
        `status: ${res.statusCode} | Message: User ${userId} assigned to trainer ${trainerUser}`
      );

      res.send({
        message: "Trainer assigned successfully.",
        userId: user._id,
        assignedTrainerId: trainerUser,
      });
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// Admin / Trainer unassign a trainer from a user
router.delete(
  "/:id/unassign-trainer",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send("User not found.");
        logger.error(`status: ${res.statusCode} | Message: User not found.`);
        return;
      }

      if (!user.assignedTrainerId) {
        res.status(400).send("User is not assigned to any trainer.");
        logger.error(
          `status: ${res.statusCode} | Message: User is not assigned to any trainer.`
        );
        return;
      }

      if (user.programs.length !== 0) {
        res.status(403).send("User has programs assigned to them.");
        logger.error(
          `status: ${res.statusCode} | Message: User has programs assigned to them.`
        );
        return;
      }
      const trainerId = user.assignedTrainerId;
      const trainerUser = await User.findById(trainerId);

      if (
        trainerUser.role === "trainer" &&
        req.user._id.toString() !== trainerId.toString()
      ) {
        res.status(403).send("Trainers can only unassign themselves.");
        logger.error(
          `status: ${res.statusCode} | Message: Unauthorized unassign attempt by trainer.`
        );
        return;
      }

      user.assignedTrainerId = null;
      await user.save();

      const trainerDoc = await Trainer.findOneAndUpdate(
        { userId: trainerId },
        { $pull: { clients: userId } },
        { new: true }
      );

      if (!trainerDoc) {
        res.status(404).send("Trainer profile not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Trainer profile not found.`
        );
        return;
      }

      logger.info(
        `status: ${res.statusCode} | Message: User ${userId} unassigned from trainer ${trainerId}`
      );

      res.send({
        message: "Trainer unassigned successfully.",
        userId: user._id,
      });
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
