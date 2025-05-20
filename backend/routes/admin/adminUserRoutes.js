const express = require("express");
const router = express.Router();
const { User, trainerValidation } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const {
  DeleteRequest,
  deleteRequestValidation,
} = require("../../model/trainerDeleteRequest");

// admin getting all users
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

// Admin getting all trainers
router.get("/", authMw, permitRoles("admin"), async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" });
    if (trainers.length === 0) {
      res.status(400).send("Trainer not found.");
      logger.error(
        `status: ${res.statusCode} | Message: Failed to get trainers, Trainer not found.`
      );
      return;
    }
    res.send(trainers);
    logger.info(
      `status: ${res.statusCode} | Message: Trainers has been sent successfully.`
    );
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

// Admin create a new trainer user
router.post("/", authMw, permitRoles("admin"), async (req, res) => {
  const { error } = trainerValidation.validate(req.body);
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
    const newTrainer = await new User({
      ...req.body,
      role: "trainer",
      password: await bcrypt.hash(req.body.password, 14),
    }).save();

    res.send(newTrainer);
    logger.info(
      `status: ${res.statusCode} | Message: A new trainer user created successfully.`
    );
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      const value = err.keyValue[field];
      res
        .status(400)
        .send(
          `The input field "${field}", with the value "${value}", already exist.`
        );
      logger.error(
        `status: ${res.statusCode} | Message: Message: Failed to register the trainer, ${field} already in use.`
      );
      return;
    }
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

//PUT

// Delete trainer by admin
router.delete(
  "/trainer/:id",
  authMw,
  permitRoles("admin"),
  async (req, res) => {
    try {
      const { error } = deleteRequestValidation.validate(req.body);
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
      const deleteRequest = await DeleteRequest.findOne({
        trainerId: req.params.id,
      });
      if (!deleteRequest) {
        res.status(400).send("Delete request not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Delete request not found.`
        );
        return;
      }

      if (deleteRequest.status !== "pending") {
        res.status(400).send("Delete request already answared.");
        logger.error(
          `status: ${res.statusCode} | Message: Delete request already answared.`
        );
        return;
      }

      if (req.body.status === "reject") {
        await deleteRequest.updateOne(
          {
            $set: {
              status: "rejected",
              reviewAt: new Date(),
              reviewBy: req.user._id,
            },
          },
          { new: true }
        );
        res.status(200).send(deleteRequest);
        logger.error(
          `status: ${res.statusCode} | Message: Delete request answared by reject.`
        );
        return;
      }
      if (req.body.status === "approve") {
        const deletedTrainer = await User.findByIdAndDelete(req.params.id);
        if (!deletedTrainer) {
          res.status(400).send("User not found.");
          logger.error(
            `status: ${res.statusCode} | Message: Failed to delete trainer, User not found.`
          );
          return;
        }
        await deleteRequest.updateOne(
          {
            $set: {
              status: "approved",
              deletedAt: new Date(),
              reviewAt: new Date(),
              reviewBy: req.user._id,
            },
          },
          { new: true }
        );

        res.send(deletedTrainer);
        return;
      }
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// Admin choose what to do with the delete request

router.get(
  "/delete-request",
  authMw,
  permitRoles("admin"),
  async (req, res) => {
    try {
      const deleteRequests = await DeleteRequest.find();
      if (deleteRequests.length === 0) {
        res.status(400).send("Delete request not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Delete request not found.`
        );
        return;
      }
      res.send(deleteRequests);
      logger.info(
        `status: ${res.statusCode} | Message: Delete requests have bees sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
