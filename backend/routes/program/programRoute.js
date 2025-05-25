const express = require("express");
const router = express.Router();
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const { Program, programValidation } = require("../../model/program");

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
    console.log(err);

    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

module.exports = router;
