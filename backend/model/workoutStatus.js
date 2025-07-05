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
    day: {
      type: String,
      required: true,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      index: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

WorkoutStatusSchema.index({ user: 1, programId: 1, day: 1 }, { unique: true });

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

  day: Joi.string()
    .valid(
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    )
    .required()
    .messages({
      "any.only": `"day" must be one of [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]`,
      "any.required": `"day" is required`,
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
