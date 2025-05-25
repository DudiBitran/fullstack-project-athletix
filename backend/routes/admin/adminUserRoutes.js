const express = require("express");
const router = express.Router();
const { User, userValidation } = require("../../model/user");
const { trainerValidation, Trainer } = require("../../model/trainer");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const bcrypt = require("bcrypt");
const uploadImage = require("../../middleware/imageUpload");
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
router.post(
  "/trainer",
  authMw,
  uploadImage.single("image"),
  permitRoles("admin"),
  async (req, res) => {
    try {
      const trainerData = req.body.trainer ? JSON.parse(req.body.trainer) : {};
      const userData = { ...req.body };
      delete userData.trainer;

      const { error: userError } = userValidation.validate(userData);
      if (userError) {
        return res.status(400).send({
          message: "Input validation error.",
          details: userError.details.map((e) => e.message),
        });
      }

      const { error: trainerError } = trainerValidation.validate(trainerData);
      if (trainerError) {
        return res.status(400).send({
          message: "Input validation error.",
          details: trainerError.details.map((e) => e.message),
        });
      }

      const newUser = new User({
        ...userData,
        password: await bcrypt.hash(userData.password, 14),
        role: "trainer",
      });

      console.log(newUser);

      if (req.file) {
        const path = req.file.path.replace("\\", "/");
        newUser.image = path;
      }

      await newUser.save();

      const newTrainer = new Trainer({
        ...trainerData,
        userId: newUser._id,
      });

      await newTrainer.save();

      res.send(newTrainer);
      logger.info(
        `status: ${res.statusCode} | Message: A new trainer user created successfully.`
      );
    } catch (err) {
      console.log(err);

      if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        const value = err.keyValue[field];
        return res
          .status(400)
          .send(
            `The input field "${field}", with the value "${value}", already exists.`
          );
      }

      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// Admin choose what to do with the delete request
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

// Get all delete request (Admin)

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
