import "../../style/trainerDash/createProgram.css";
import { FaWpforms } from "react-icons/fa";
import { useFormik } from "formik";
import Joi from "joi";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import { useNavigate } from "react-router";

const schema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title must be at most 100 characters",
  }),

  description: Joi.string().allow("").optional(),

  durationWeeks: Joi.number().min(1).max(52).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 1 week",
    "number.max": "Duration can't exceed 52 weeks",
    "any.required": "Duration is required",
  }),

  difficulty: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required()
    .messages({
      "any.only": "Difficulty must be one of: beginner, intermediate, advanced",
      "string.empty": "Difficulty is required",
    }),
});

function CreateProgram() {
  const [serverError, setServerError] = useState("");
  const { user, createProgram } = useAuth();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      durationWeeks: "",
      difficulty: "",
    },
    validate: (values) => {
      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return {};
      const errors = {};
      error.details.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const response = await createProgram(values);
        navigate("/trainer/my-programs");
        return response;
      } catch (err) {
        if (err.response?.status >= 400) {
          const response = err.response.data;
          setServerError(response);
        }
      }
    },
  });

  return (
    <main className="createProgram-container">
      <form
        onSubmit={formik.handleSubmit}
        className="form-container"
        noValidate
        autoComplete="off"
      >
        <h2 className="form-title">
          <FaWpforms /> Create a New Program
        </h2>

        {serverError && <div className="serverError">{serverError}</div>}

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="red-dot">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Muscle Gain Program"
            {...formik.getFieldProps("title")}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="error">{formik.errors.title}</div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            rows="3"
            placeholder="Optional short description..."
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error">{formik.errors.description}</div>
          )}
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="durationWeeks">
            Duration (in weeks) <span className="red-dot">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="52"
            placeholder="e.g., 6"
            {...formik.getFieldProps("durationWeeks")}
          />
          {formik.touched.durationWeeks && formik.errors.durationWeeks && (
            <div className="error">{formik.errors.durationWeeks}</div>
          )}
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">
            Difficulty <span className="red-dot">*</span>
          </label>
          <select {...formik.getFieldProps("difficulty")}>
            <option value="">Select difficulty</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {formik.touched.difficulty && formik.errors.difficulty && (
            <div className="error">{formik.errors.difficulty}</div>
          )}
        </div>

        <div className="form-group">
          <button type="submit">➕ Create Program</button>
        </div>
      </form>
    </main>
  );
}

export default CreateProgram;
