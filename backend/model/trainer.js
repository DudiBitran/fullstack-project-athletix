const mongoose = require("mongoose");
const Joi = require("joi");
const TrainerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  clients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  bio: { type: String, maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

const Trainer = mongoose.model("Trainer", TrainerSchema, "trainers");

const trainerValidation = Joi.object({
  bio: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Bio must be a string.",
    "string.max": "Bio can't exceed 500 characters.",
  }),

  clients: Joi.array()
    .items(Joi.string().length(24).hex())
    .optional()
    .messages({
      "array.base": "Clients must be an array.",
      "string.length": "Each client ID must be a 24-character hex string.",
    }),
});

module.exports = {
  trainerValidation,
  Trainer,
};
