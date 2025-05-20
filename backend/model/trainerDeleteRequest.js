const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const deleteRequestSchema = new mongoose.Schema(
  {
    trainerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    lastName: {
      type: String,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["trainer"],
      required: true,
    },
    reason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewAt: {
      type: Date,
    },
    reviewBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    deletedAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

deleteRequestSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const DeleteRequest = mongoose.model(
  "DeleteRequest",
  deleteRequestSchema,
  "deleteRequests"
);

const validation = {
  reason: Joi.string().max(500).allow("").messages({
    "string.base": "Reason must be a string.",
    "string.max": "Reason cannot exceed 500 characters.",
  }),
  role: Joi.string().valid("trainer").required().messages({
    "any.only": "This request is only allowed for trainers.",
    "string.base": "Role must be a string.",
    "any.required": "Role is required.",
  }),
};

const deleteRequestValidation = Joi.object({
  status: Joi.string().valid("approve", "reject").required().messages({
    "any.only": 'Status must be either "approve" or "reject".',
    "string.base": "Status must be a string.",
    "any.required": "Status is required.",
  }),
}).required();

const sendDeleteRequestValidation = Joi.object(
  _.pick(validation, ["role"])
).required();

module.exports = {
  deleteRequestValidation,
  sendDeleteRequestValidation,
  DeleteRequest,
};
