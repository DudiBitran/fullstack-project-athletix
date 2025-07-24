const express = require("express");
const router = express.Router();
const { User, updateValidation } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const imageUpload = require("../../middleware/imageUpload");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

router.get(
  "/me",
  authMw,
  permitRoles("user", "trainer", "admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(`status: ${res.statusCode} | Message: User not found.`);
        return;
      }
      res.send(user);
      logger.info(
        `status: ${res.statusCode} | Message: User sent successfully.`
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

router.put(
  "/me",
  authMw,
  permitRoles("user", "trainer", "admin"),
  async (req, res) => {
    const { error } = updateValidation.validate(req.body);
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
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to update, User not found.`
        );
        return;
      }
      res.send(user);
      logger.info(
        `status: ${res.statusCode} | Message: User updated successfully.`
      );
    } catch (err) {
      // Check for duplicate key error (MongoDB error code 11000)
      if (err.code === 11000) {
        res.status(400).send({
          message: "This email is already registered. Please use a different email address.",
          details: ["Email must be unique"]
        });
        logger.error(
          `status: ${res.statusCode} | Message: Email duplicate error - ${err.message}`
        );
        return;
      }
      
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// delete own account (Only user)

router.delete("/me", authMw, permitRoles("user"), async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      res.status(400).send("User not found.");
      logger.error(
        `status: ${res.statusCode} | Message: Failed to delete, User not found.`
      );
      return;
    }
    res.send(deletedUser);
    logger.info(
      `status: ${res.statusCode} | Message: User deleted successfully.`
    );
  } catch (err) {
    res.status(500).send("Internal server error.");
    logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
  }
});

// change image

router.put(
  "/me/image",
  authMw,
  permitRoles("admin", "trainer", "user"),
  imageUpload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).send("No image file uploaded.");
        logger.error(
          `status: ${res.statusCode} | Message: No image file uploaded.`
        );
        return;
      }
      const { path: newImagePath } = req.file;
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(
          `status: ${res.statusCode} | Message: Failed to delete, User not found.`
        );
        return;
      }
      if (user.image && user.image !== "/public/defaults/trainer-icon.jpg") {
        const oldImagePath = path.join(__dirname, "..", "..", user.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err.message);
            throw new Error("Error:", err.message);
          }
        });
      }
      user.image = newImagePath;
      await user.save();
      res.send({ message: "User image has been changed successfully.", user });
      logger.info(
        `status: ${res.statusCode} | Message: User image have been changes successfully.`
      );
    } catch (err) {
      console.log(err);

      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// remove image (set to default)

router.delete(
  "/me/image",
  authMw,
  permitRoles("admin", "trainer", "user"),
  async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        res.status(400).send("User not found.");
        logger.error(
          `status: ${res.statusCode} | Message: User not found.`
        );
        return;
      }
      
      // Delete the current image if it's not the default
      if (user.image && user.image !== "/public/defaults/trainer-icon.jpg") {
        const oldImagePath = path.join(__dirname, "..", "..", user.image);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            console.error("Failed to delete old image:", err.message);
          }
        });
      }
      
      // Set image to null so frontend can handle default avatar
      user.image = null;
      await user.save();
      
      res.send({ message: "Profile image has been removed and set to default.", user });
      logger.info(
        `status: ${res.statusCode} | Message: Profile image removed successfully.`
      );
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

// Change password
router.patch(
  "/me/change-password",
  authMw,
  permitRoles("user", "trainer", "admin"),
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).send("Current and new password are required.");
    }
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).send("User not found.");
      }
      // Check current password
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) {
        return res.status(400).send("Current password is incorrect.");
      }
      // Hash and set new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      res.send({ message: "Password changed successfully." });
      logger.info(`status: ${res.statusCode} | Message: Password changed successfully for user ${user._id}`);
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

router.get(
  "/:id",
  authMw,
  permitRoles("user", "trainer", "admin"),
  async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).send("User not found.");
      }
      res.send(user);
    } catch (err) {
      res.status(500).send("Internal server error.");
    }
  }
);

module.exports = router;
