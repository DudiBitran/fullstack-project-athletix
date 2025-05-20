const express = require("express");
const router = express.Router();
const { User, AssignTrainerValidation } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const {
  sendDeleteRequestValidation,
  DeleteRequest,
} = require("../../model/trainerDeleteRequest");

// Admin / Trainer assign the trainer to the user
router.put(
  "/:id/assign-trainer",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    const { error } = AssignTrainerValidation.validate(req.body);
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

    try {
      const { trainerId } = req.body;
      const userId = req.params.id;

      const user = await User.findById(userId);
      if (!user) {
        res.status(404).send("User not found.");
        logger.error(`status: ${res.statusCode} | Message: User not found.`);
        return;
      }
      if (user.role === "trainer") {
        res.status(404).send("Trainer cannot assign a trainer");
        logger.error(
          `status: ${res.statusCode} | Message: Trainer cannot assign a trainer.`
        );
        return;
      }
      if (
        req.user.role === "trainer" &&
        req.user._id.toString() !== trainerId
      ) {
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
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// trainer getting own client

router.get("/my-clients", authMw, permitRoles("trainer"), async (req, res) => {
  try {
    const clients = await User.find({ assignedTrainerId: req.user._id });
    if (!clients) {
      res.status(400).send("User not found.");
      logger.error(
        `status: ${res.statusCode} | Message: Failed to get own clients, User not found.`
      );
      return;
    }
    res.send(clients);
    logger.info(
      `status: ${res.statusCode} | Message: Clients has been sent successfully.`
    );
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

// request from admin to delete own trainer account

router.post(
  "/me/delete-request",
  authMw,
  permitRoles("trainer"),
  async (req, res) => {
    const { error } = sendDeleteRequestValidation.validate(req.body);
    if (error) {
      res.status(400).send({
        message: "Input validation error.",
        details: error.details.map((e) => e.message),
      });
      logger.error(
        `status: ${res.statusCode} | Messsage: ${error.details.map(
          (e) => e.message
        )}`
      );
      return;
    }
    try {
      const trainer = await User.findById(req.user._id);
      if (!trainer) {
        res.status(400).send("User trainer not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Falied to send delete request, User not found.`
        );
        return;
      }
      const isRequestExist = await DeleteRequest.findOne({
        trainerId: trainer._id,
      });

      if (isRequestExist && isRequestExist.status === "pending") {
        res.status(400).send("Delete request already sent.");
        logger.error(
          `status: ${res.statusCode} | Message: Falied to send delete request, Delete request already sent.`
        );
        return;
      }

      const newDeleteRequest = await new DeleteRequest({
        ...req.body,
        trainerId: req.user._id,
        firstName: trainer.firstName,
        lastName: trainer.lastName,
      }).save();

      res.send(newDeleteRequest);
      logger.info(
        `status: ${res.statusCode} | Message: The request to delete the account have been sent successfully. `
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
