const express = require("express");
const router = express.Router();
const { userValidation, User, loginValidation } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const imageUpload = require("../../middleware/imageUpload");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { log } = require("console");

router.post("/register", imageUpload.single("image"), async (req, res) => {
  if (typeof req.body.stats === "string") {
    try {
      req.body.stats = JSON.parse(req.body.stats);
    } catch (err) {
      return res.status(400).send({
        message: "Invalid stats format – must be a valid JSON object",
      });
    }
  }

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

    if (req.file) {
      const path = req.file.path.replace("\\", "/");
      user.image = path;
    }
    await user.save();
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
      res.status(400).send(`The ${field}: "${value}", already in use.`);
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
  try {
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
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

// Forgot Password Endpoint
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ message: 'Email is required.' });
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Always respond with success to prevent email enumeration
      return res.send({ message: 'If your email exists, you will receive a reset link.' });
    }
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send email (configure your transporter)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}\nIf you did not request this, please ignore this email.`
    };
    await transporter.sendMail(mailOptions);
    res.send({ message: 'If your email exists, you will receive a reset link.' });
  } catch (err) {
    console.log(err);
    
    res.status(500).send('Internal server error.');
  }
});

// Reset Password Endpoint
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).send({ message: 'Token and new password are required.' });
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).send({ message: 'Invalid or expired token.' });
    user.password = await bcrypt.hash(password, 14);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    res.send({ message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).send('Internal server error.');
  }
});

router.get(
  "/role",
  authMw,
  permitRoles("admin", "trainer", "user"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(
          `status: ${res.statusCode} | Message: failed get role, user not found.`
        );
        return;
      }
      const role = user.role;
      res.send(role);
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
