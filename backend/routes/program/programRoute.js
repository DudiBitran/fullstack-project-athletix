const express = require("express");
const router = express.Router();
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const { Program, programValidation } = require("../../model/program");
const { User } = require("../../model/user");

router.post("/", authMw, permitRoles("admin", "trainer"), async (req, res) => {
  try {
    const { error } = programValidation.validate(req.body);
    if (error) {
      res.status(400).send({
        message: "Input validation error",
        details: error.details.map((e) => e.message),
      });
      logger.error(
        `status: ${res.statusCode} | Message: ${error.details.map(
          (e) => e.message
        )}`
      );
      return;
    }

    const newProgram = await new Program({
      ...req.body,
      trainer: req.user._id,
    }).save();

    res.send(newProgram);
    logger.info(
      `status: ${res.statusCode} | Message: Program created successfully.`
    );
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

// get all own programs

router.get(
  "/:trainerId",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    const userRole = await User.findById(req.params.id);
    const { trainerId } = req.params;
    if (
      req.user._id.toString() !== trainerId.toString() &&
      userRole !== "admin"
    ) {
      res.status(400).send("Trainer is not the owner");
      logger.error(
        `status: ${res.statusCode} | Message: Trainer is not the owner`
      );
      return;
    }

    try {
      const program = await Program.find({ trainer: trainerId });
      if (!program.length) {
        res.status(400).send("Program not found.");
        logger.error(`status: ${res.statusCode} | Message: Program not found.`);
        return;
      }

      res.send(program);
      logger.info(
        `status: ${res.statusCode} | Message: Program sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// get a specific program by id

router.get(
  "/details/:programId",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    const { programId } = req.params;
    const program = await Program.findById(programId);

    try {
      if (!program) {
        res.status(400).send("Program not found.");
        logger.error(`status: ${res.statusCode} | Message: Program not found.`);
        return;
      }

      if (
        req.user._id.toString() !== program.trainer.toString() &&
        userRole !== "admin"
      ) {
        res.status(400).send("Trainer is not the owner");
        logger.error(
          `status: ${res.statusCode} | Message: Trainer is not the owner`
        );
        return;
      }
      res.send(program);
      logger.info(
        `status: ${res.statusCode} | Message: Program sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

//delete a program by id
router.delete(
  "/:programId",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    const { programId } = req.params;

    try {
      const program = await Program.findById(programId);

      if (!program) {
        res.status(400).send("Program not found.");
        logger.error(`status: ${res.statusCode} | Message: Program not found.`);
        return;
      }

      if (
        req.user._id.toString() !== program.trainer.toString() &&
        userRole !== "admin"
      ) {
        res.status(400).send("Trainer is not the owner");
        logger.error(
          `status: ${res.statusCode} | Message: Trainer is not the owner`
        );
        return;
      }

      const deletedProgram = program.toObject();
      await program.deleteOne();
      res.send({
        message: "Program deleted successfully.",
        deletedProgram,
      });

      logger.info(
        `status: ${res.statusCode} | Message: Program deleted successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

router.put(
  "/:programId",
  authMw,
  permitRoles("admin", "trainer"),
  async (req, res) => {
    const { programId } = req.params;

    try {
      const program = await Program.findById(programId);

      const { error } = programValidation.validate(req.body);
      if (error) {
        res.status(400).send({
          message: "Input validation error",
          details: error.details.map((e) => e.message),
        });
        logger.error(
          `status: ${res.statusCode} | Message: ${error.details.map(
            (e) => e.message
          )}`
        );
        return;
      }

      if (!program) {
        res.status(400).send("Program not found.");
        logger.error(`status: ${res.statusCode} | Message: Program not found.`);
        return;
      }

      if (
        req.user._id.toString() !== program.trainer.toString() &&
        userRole !== "admin"
      ) {
        res.status(400).send("Trainer is not the owner");
        logger.error(
          `status: ${res.statusCode} | Message: Trainer is not the owner`
        );
        return;
      }

      const updateData = _.omit(req.body, [
        "_id",
        "trainer",
        "createdAt",
        "__v",
      ]);
      Object.assign(program, updateData);
      await program.save();

      res.send({
        message: "Program updated successfully.",
        updatedProgram: program,
      });
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
