const express = require("express");
const router = express.Router();
const { User } = require("../../model/user");
const logger = require("../../fileLogger/fileLogger");
const _ = require("lodash");
const { permitRoles } = require("../../middleware/role");
const authMw = require("../../middleware/auth");
const {
  sendDeleteRequestValidation,
  DeleteRequest,
} = require("../../model/trainerDeleteRequest");

// trainer getting own clients

router.get("/my-clients", authMw, permitRoles("trainer"), async (req, res) => {
  try {
    const clients = await User.find({ assignedTrainerId: req.user._id });
    if (clients.length === 0) {
      res.send([]);
      logger.error(
        `status: ${res.statusCode} | Message: Failed to get own clients, User not found.`
      );
      return;
    }

    const filteredClients = clients.map((client) =>
      _.pick(client, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "age",
        "stats",
        "image",
        "gender",
        "programs",
      ])
    );
    res.send(filteredClients);
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

// get available clients list

router.get(
  "/available-clients",
  authMw,
  permitRoles("trainer"),
  async (req, res) => {
    try {
      const clients = await User.find({
        assignedTrainerId: null,
        role: "user",
      });
      if (clients.length === 0) {
        res.send(clients);
        logger.info(
          `status: ${res.statusCode} | Message: No available client found. `
        );
        return;
      }
      const filteredClients = clients.map((client) =>
        _.pick(client, ["_id", "firstName", "lastName", "email", "age"])
      );
      res.send(filteredClients);
      logger.info(
        `status: ${res.statusCode} | Message: Available clients have been sent successfully. `
      );
    } catch (err) {
      res.status(500).send("Internal server error.");
      logger.error(`status: ${res.statusCode} | Message: ${err.message}`);
    }
  }
);

module.exports = router;
