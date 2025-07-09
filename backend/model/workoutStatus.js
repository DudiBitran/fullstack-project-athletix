// models/workoutStatus.js
const mongoose = require("mongoose");
const Joi = require("joi");

const WorkoutStatusSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

WorkoutStatusSchema.index({ user: 1, programId: 1, date: 1 }, { unique: true });

const WorkoutStatus = mongoose.model(
  "WorkoutStatus",
  WorkoutStatusSchema,
  "workoutsStatus"
);

const workoutStatusValidation = Joi.object({
  programId: Joi.string().length(24).hex().required().messages({
    "string.length": `"programId" must be 24 characters`,
    "string.hex": `"programId" must be a valid hex string`,
    "any.required": `"programId" is required`,
  }),
  date: Joi.date().required().messages({
    "any.required": `"date" is required`,
    "date.base": `"date" must be a valid date`,
  }),
  completed: Joi.boolean().required().messages({
    "any.required": `"completed" is required`,
    "boolean.base": `"completed" must be a boolean`,
  }),
});

module.exports = {
  WorkoutStatus,
  workoutStatusValidation,
};
