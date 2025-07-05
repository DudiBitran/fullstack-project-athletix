const express = require("express");
const router = express.Router();
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const { Program, programValidation } = require("../../model/program");

// get all programs
router.get("/", authMw, permitRoles("admin"), async (req, res) => {
  try {
    const program = await Program.find();

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
});

module.exports = router;
