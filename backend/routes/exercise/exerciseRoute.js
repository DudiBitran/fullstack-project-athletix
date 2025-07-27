const express = require("express");
const router = express.Router();
const authMw = require("../../middleware/auth");
const { permitRoles } = require("../../middleware/role");
const fileUpload = require("../../middleware/fileUpload");
const {
  Exercise,
  exerciseValidation,
  exerciseUpdateValidation,
} = require("../../model/exercise");
const logger = require("../../fileLogger/fileLogger");
const fs = require("fs");
const { User } = require("../../model/user");
const { log } = require("console");

// create a new exercise
router.post(
  "/",
  authMw,
  permitRoles("admin", "trainer"),
  fileUpload.single("attachment"),
  async (req, res) => {
    try {
      const { error } = exerciseValidation.validate(req.body);
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

      const file = req.file;

      if (!file) {
        res.status(400).send("File not uploaded.");
        logger.error(`status: ${res.statusCode} | Message: File not uploaded.`);
        return;
      }

      const newExercise = await new Exercise({
        ...req.body,
        attachment: {
          filename: file.originalname,
          url: file.path.replace(/\\/g, "/"),
          mimetype: file.mimetype,
          size: file.size / 1024 / 1024,
        },
        updatedBy: req.user._id,
        createdBy: req.user._id,
      }).save();

      res.send(newExercise);
    } catch (err) {
      console.log(err);

      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

//get all exercises
router.get("/", authMw, permitRoles("admin"), async (req, res) => {
  try {
    const exercises = await Exercise.find().populate('createdBy', 'firstName lastName email');
    if (exercises.length === 0) {
      res.status(400).send("Exercise not found.");
      logger.error(`status: ${res.statusCode} | Message: Exercise not found.`);
      return;
    }
    res.send(exercises);
    logger.info(
      `status: ${res.statusCode} | Message: Exercise have been sent successfully.`
    );
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

// get my exercises
router.get(
  "/my-exercises",
  authMw,
  permitRoles("trainer"),
  async (req, res) => {
    try {
      const exercises = await Exercise.find({ createdBy: req.user._id });
      if (exercises.length === 0) {
        res.status(400).send("Exercise not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Exercise not found.`
        );
        return;
      }
      res.send(exercises);
      logger.info(
        `status: ${res.statusCode} | Message: Exercise have been sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// get the exercise by id
router.get(
  "/:id",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    try {
      const exercise = await Exercise.findById(req.params.id);
      if (!exercise) {
        res.status(400).send("Exercise not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Exercise not found.`
        );
        return;
      }
      res.send(exercise);
      logger.info(
        `status: ${res.statusCode} | Message: Exercise have been sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// update exercise
router.put(
  "/:id",
  authMw,
  permitRoles("admin", "trainer"),
  fileUpload.single("attachment"),
  async (req, res) => {
    try {
      if ((!req.body || Object.keys(req.body).length === 0) && !req.file) {
        res.status(400).send({
          details: "No fields or file sent to update.",
        });
        return;
      }

      const { error } = exerciseUpdateValidation.validate(req.body);
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
      const exercise = await Exercise.findById(req.params.id);
      if (!exercise) {
        res.status(400).send("Exercise not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Exercise not found.`
        );
        return;
      }
      const user = await User.findById(req.user._id);

      if (
        exercise.createdBy.toString() !== req.user._id &&
        user.role !== "admin"
      ) {
        res.status(400).send("Access denied, trainer is not the owner.");
        logger.error(
          `status: ${res.statusCode} | Message: Access denied, trainer is not the owner.`
        );
        return;
      }

      Object.assign(exercise, req.body);

      if (req.file) {
        // Delete old attachment file if it exists
        if (exercise.attachment && exercise.attachment.url) {
          try {
            const oldPath = exercise.attachment.url;
          
            const cleanPath = oldPath.replace(/^\/+/, "");
            const fullOldPath = path.join(__dirname, "../../", cleanPath);
            
            // Check if file exists before trying to delete
            if (fs.existsSync(fullOldPath)) {
              fs.unlinkSync(fullOldPath);
              console.log("Old attachment deleted successfully");
            }
          } catch (err) {
            console.log("Failed to delete old attachment:", err.message);
            // Continue with update even if deletion fails
          }
        }
        
        // Update attachment with new file
        exercise.attachment = {
          filename: req.file.originalname,
          url: req.file.path.replace(/\\/g, "/"),
          mimetype: req.file.mimetype,
          size: req.file.size / 1024 / 1024,
        };
      }
      exercise.updatedBy = req.user._id;
      await exercise.save();
      res.send(exercise);
      logger.info(
        `status: ${res.statusCode} | Message: Exercise have been updated successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// delete exercise
router.delete(
  "/:id",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    try {
      const exercise = await Exercise.findById(req.params.id);
      if (!exercise) {
        res.status(400).send("Exercise not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Exercise not found.`
        );
        return;
      }
      const user = await User.findById(req.user._id);

      if (
        exercise.createdBy.toString() !== req.user._id &&
        user.role !== "admin"
      ) {
        res.status(400).send("Access denied, trainer is not the owner.");
        logger.error(
          `status: ${res.statusCode} | Message: Access denied, trainer is not the owner.`
        );
        return;
      }

      const deletedExercise = await Exercise.findByIdAndDelete(req.params.id);
      res.send(deletedExercise);
      logger.error(
        `status: ${res.statusCode} | Message: Exercise have been deleted successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
