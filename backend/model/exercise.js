const mongoose = require("mongoose");

const ExerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    category: {
      type: String,
      enum: ["Strength", "Cardio", "Flexibility", "Balance", "Yoga"],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      required: true,
    },
    sets: {
      type: Number,
      required: true,
      min: 1,
    },
    reps: {
      type: Number,
      required: true,
      min: 1,
    },
    restSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    attachment: {
      filename: String,
      url: String,
      mimetype: String,
      size: Number,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Exercise = mongoose.model("Exercise", ExerciseSchema, "exercises");

const Joi = require("joi");

const Validation = {
  name: Joi.string().min(2).max(100).required().messages({
    "string.base": "Exercise name must be a string.",
    "string.min": "Exercise name must be at least 2 characters.",
    "string.max": "Exercise name can't exceed 100 characters.",
    "any.required": "Exercise name is required.",
  }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string.",
  }),

  category: Joi.string().valid("Strength", "Cardio", "Flexibility", "Balance", "Yoga").required().messages({
    "string.base": "Category must be a string.",
    "any.only": "Category must be one of: Strength, Cardio, Flexibility, Balance, Yoga.",
    "any.required": "Category is required.",
  }),

  difficulty: Joi.string().valid("Beginner", "Intermediate", "Advanced").required().messages({
    "string.base": "Difficulty must be a string.",
    "any.only": "Difficulty must be one of: Beginner, Intermediate, Advanced.",
    "any.required": "Difficulty is required.",
  }),

  sets: Joi.number().min(1).required().messages({
    "number.base": "Sets must be a number.",
    "number.min": "Sets must be at least 1.",
    "any.required": "Sets are required.",
  }),

  reps: Joi.number().min(1).required().messages({
    "number.base": "Reps must be a number.",
    "number.min": "Reps must be at least 1.",
    "any.required": "Reps are required.",
  }),

  restSeconds: Joi.number().min(0).optional().messages({
    "number.base": "Rest seconds must be a number.",
    "number.min": "Rest seconds must be 0 or more.",
  }),

  notes: Joi.string().allow("").optional().messages({
    "string.base": "Notes must be a string.",
  }),

  attachment: Joi.object({
    filename: Joi.string().required(),
    url: Joi.string().uri().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().required(),
  }).optional(),
};

const exerciseValidation = Joi.object(Validation).required();

const exerciseUpdateValidation = Joi.object({
  name: Joi.string().min(2).max(100).messages({
    "string.base": "Exercise name must be a string.",
    "string.min": "Exercise name must be at least 2 characters.",
    "string.max": "Exercise name can't exceed 100 characters.",
  }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string.",
  }),

  category: Joi.string().valid("Strength", "Cardio", "Flexibility", "Balance", "Yoga").messages({
    "string.base": "Category must be a string.",
    "any.only": "Category must be one of: Strength, Cardio, Flexibility, Balance, Yoga.",
  }),

  difficulty: Joi.string().valid("Beginner", "Intermediate", "Advanced").messages({
    "string.base": "Difficulty must be a string.",
    "any.only": "Difficulty must be one of: Beginner, Intermediate, Advanced.",
  }),

  sets: Joi.number().min(1).messages({
    "number.base": "Sets must be a number.",
    "number.min": "Sets must be at least 1.",
  }),

  reps: Joi.number().min(1).messages({
    "number.base": "Reps must be a number.",
    "number.min": "Reps must be at least 1.",
  }),

  restSeconds: Joi.number().min(0).optional().messages({
    "number.base": "Rest seconds must be a number.",
    "number.min": "Rest seconds must be 0 or more.",
  }),

  notes: Joi.string().allow("").optional().messages({
    "string.base": "Notes must be a string.",
  }),
});

module.exports = {
  exerciseValidation,
  exerciseUpdateValidation,
  Exercise,
};
