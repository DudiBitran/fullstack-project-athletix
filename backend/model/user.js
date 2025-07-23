const mongoose = require("mongoose");
const _ = require("lodash");
const Joi = require("joi");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    maxlength: 1024,
    default: "/public/defaults/trainer-icon.jpg",
    set: (v) => (v === "" ? undefined : v),
  },
  role: {
    type: String,
    enum: ["admin", "trainer", "user"],
    default: "user",
  },
  age: {
    type: Number,
    min: 18,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  assignedTrainerId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    default: null,
  },
  programs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Program",
    },
  ],
  stats: {
    weight: Number,
    bodyFat: Number,
    height: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    delete ret.password;
    return ret;
  },
});

const User = mongoose.model("User", userSchema, "users");

const passwordRegex =
  /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

const validation = {
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters long",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters long",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be valid",
    "string.empty": "Email is required",
  }),
  password: Joi.string().pattern(passwordRegex).required().messages({
    "string.pattern.base":
      "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 4 digits, and 1 special character",
    "string.empty": "Password is required",
  }),
  role: Joi.string().valid("admin", "trainer", "user").optional(),
  stats: Joi.object({
    weight: Joi.number().min(30).max(300).optional().allow(null, ""),
    bodyFat: Joi.number().min(3).max(60).optional().allow(null, ""),
    height: Joi.number().min(100).max(250).optional().allow(null, ""),
  }).optional(),

  age: Joi.number().min(18).required().messages({
    "number.min": "You must be at least 18 years old to register",
  }),
  gender: Joi.string().valid("male", "female", "other").required(),
  image: Joi.string().allow("").optional(),
};

const userValidation = Joi.object(validation);
const loginValidation = Joi.object(
  _.pick(validation, ["email", "password"])
).required();

const updateValidation = Joi.object(
  _.pick(validation, ["firstName", "lastName", "image", "email", "age", "gender", "stats"])
);

const AssignTrainerValidation = Joi.object({
  trainerId: Joi.string().length(24).hex().required().messages({
    "string.base": "Trainer ID must be a string.",
    "string.length": "Trainer ID must be exactly 24 characters long.",
    "string.hex": "Trainer ID must be a valid hexadecimal.",
    "any.required": `"trainerId" is required.`,
  }),
});

module.exports = {
  userValidation,
  loginValidation,
  updateValidation,
  AssignTrainerValidation,
  User,
};
