const express = require("express");
const router = express.Router();
const { userValidation, User, loginValidation } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // input validation
  const { error } = userValidation.validate(req.body);
  if (error) {
    res.status(400).send({
      message: "Invalid input fields",
      details: error.details.map((e) => e.message),
    });
    logger.error(
      `status: ${
        res.statusCode
      } | Message: User failed to register, ${error.details.map(
        (e) => e.message
      )}`
    );
    return;
  }
  // system validation
  try {
    // proccess
    const user = await new User({
      ...req.body,
      password: await bcrypt.hash(req.body.password, 14),
    }).save();

    // response
    res.send(
      _.pick(user, ["firstName", "lastName", "email", "_id", "createdAt"])
    );
    logger.info(
      `status: ${res.statusCode} | Message: User registered successfully`
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
        `status: ${res.statusCode} | Message: User failed to register, ${field} already in use.`
      );
      return;
    }
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation.validate(req.body);
  if (error) {
    res.status(400).send({
      message: "Invalid input fields",
      details: error.details.map((e) => e.message),
    });
    logger.error(
      `status: ${
        res.statusCode
      } | Message: User failed to register, ${error.details.map(
        (e) => e.message
      )}`
    );
    return;
  }

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(400).send("Invalid email.");
    logger.error(
      `status: ${res.statusCode} | Message: failed to login, User not found.`
    );
    return;
  }

  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );

  if (!isValidPassword) {
    res.status(400).send("Invalid password.");
    logger.error(
      `status: ${res.statusCode} | Message: failed to login, password not matching.`
    );
    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);

  res.send({ token });
  logger.info(`status: ${res.statusCode} | Message: Token provided.`);
});

module.exports = router;
