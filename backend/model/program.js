const mongoose = require("mongoose");
const Joi = require("joi");

const ProgramSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    durationWeeks: Number,
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    days: [
      {
        day: { type: String, required: true },
        exercises: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Program = mongoose.model("Program", ProgramSchema, "programs");

const validation = {
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().allow(""),
  durationWeeks: Joi.number().min(1).max(52),
  difficulty: Joi.string().valid("beginner", "intermediate", "advanced"),

  days: Joi.array()
    .items(
      Joi.object({
        day: Joi.string().required(),
        exercises: Joi.array()
          .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
          .required(),
      })
    )
    .optional(),
};

const programValidation = Joi.object(validation);

module.exports = {
  programValidation,
  Program,
};
