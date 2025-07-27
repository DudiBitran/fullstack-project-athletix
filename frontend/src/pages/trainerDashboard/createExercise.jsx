import "../../style/trainerDash/createExercise.css";
import { FaDumbbell } from "react-icons/fa";
import { useFormik } from "formik";
import Joi from "joi";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Exercise name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name can't exceed 100 characters",
  }),
  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string",
  }),
  category: Joi.string().valid("Strength", "Cardio", "Flexibility", "Balance", "Yoga").required().messages({
    "string.empty": "Category is required",
    "any.only": "Category must be one of: Strength, Cardio, Flexibility, Balance, Yoga",
    "any.required": "Category is required",
  }),
  difficulty: Joi.string().valid("Beginner", "Intermediate", "Advanced").required().messages({
    "string.empty": "Difficulty is required",
    "any.only": "Difficulty must be one of: Beginner, Intermediate, Advanced",
    "any.required": "Difficulty is required",
  }),
  sets: Joi.number().min(1).required().messages({
    "number.base": "Sets must be a number",
    "number.min": "Sets must be at least 1",
    "any.required": "Sets are required",
  }),
  reps: Joi.number().min(1).required().messages({
    "number.base": "Reps must be a number",
    "number.min": "Reps must be at least 1",
    "any.required": "Reps are required",
  }),
  restSeconds: Joi.number().min(0).optional().messages({
    "number.base": "Rest must be a number",
    "number.min": "Rest can't be negative",
  }),
  notes: Joi.string().allow("").optional().messages({
    "string.base": "Notes must be a string",
  }),
  attachment: Joi.any().optional().allow(null, ""),
});

function CreateExercise() {
  const [serverError, setServerError] = useState("");
  const { user, createExercise } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      category: "",
      difficulty: "",
      sets: "",
      reps: "",
      restSeconds: "",
      notes: "",
      attachment: null,
    },
    validate: (values) => {
      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return {};
      const errors = {};
      for (let detail of error.details) {
        errors[detail.path[0]] = detail.message;
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("category", values.category);
        formData.append("difficulty", values.difficulty);
        formData.append("sets", values.sets);
        formData.append("reps", values.reps);
        formData.append("restSeconds", values.restSeconds);
        formData.append("notes", values.notes);
        if (values.attachment) {
          formData.append("attachment", values.attachment);
        }
        await createExercise(formData);
        toast.success("Exercise created successfully!");
        setTimeout(() => navigate("/trainer/my-exercises"), 1200);
      } catch (err) {
        if (err.response?.status >= 400) {
          const response = err.response.data;
          setServerError(response);
          toast.error(typeof response === "string" ? response : "Failed to create exercise");
        }
      }
    },
  });

  return (
    <main className="createExercise-container">
      <form
        onSubmit={formik.handleSubmit}
        className="form-container"
        noValidate
        autoComplete="off"
      >
        <h2 className="form-title">
          <FaDumbbell /> Create New Exercise
        </h2>

        {serverError && <div className="serverError">{serverError}</div>}

        {/* Name */}
        <div className="form-group">
          <label htmlFor="name">
            Name <span className="red-dot">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Bench Press"
            {...formik.getFieldProps("name")}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="error">{formik.errors.name}</div>
          )}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            rows="3"
            placeholder="Describe the exercise..."
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error">{formik.errors.description}</div>
          )}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">
            Category <span className="red-dot">*</span>
          </label>
          <select {...formik.getFieldProps("category")}>
            <option value="">Select a category</option>
            <option value="Strength">Strength</option>
            <option value="Cardio">Cardio</option>
            <option value="Flexibility">Flexibility</option>
            <option value="Balance">Balance</option>
            <option value="Yoga">Yoga</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <div className="error">{formik.errors.category}</div>
          )}
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">
            Difficulty <span className="red-dot">*</span>
          </label>
          <select {...formik.getFieldProps("difficulty")}>
            <option value="">Select difficulty level</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {formik.touched.difficulty && formik.errors.difficulty && (
            <div className="error">{formik.errors.difficulty}</div>
          )}
        </div>

        {/* Sets */}
        <div className="form-group">
          <label htmlFor="sets">
            Sets <span className="red-dot">*</span>
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g., 4"
            {...formik.getFieldProps("sets")}
          />
          {formik.touched.sets && formik.errors.sets && (
            <div className="error">{formik.errors.sets}</div>
          )}
        </div>

        {/* Reps */}
        <div className="form-group">
          <label htmlFor="reps">
            Reps <span className="red-dot">*</span>
          </label>
          <input
            type="number"
            min="1"
            placeholder="e.g., 12"
            {...formik.getFieldProps("reps")}
          />
          {formik.touched.reps && formik.errors.reps && (
            <div className="error">{formik.errors.reps}</div>
          )}
        </div>

        {/* Rest */}
        <div className="form-group">
          <label htmlFor="restSeconds">Rest (in seconds)</label>
          <input
            type="number"
            min="0"
            placeholder="e.g., 60"
            {...formik.getFieldProps("restSeconds")}
          />
          {formik.touched.restSeconds && formik.errors.restSeconds && (
            <div className="error">{formik.errors.restSeconds}</div>
          )}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            rows="3"
            placeholder="Optional notes about the exercise..."
            {...formik.getFieldProps("notes")}
          />
          {formik.touched.notes && formik.errors.notes && (
            <div className="error">{formik.errors.notes}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="attachment">Attachment (optional)</label>
          <input
            type="file"
            accept="video/*,image/*,gif/*"
            onChange={(e) =>
              formik.setFieldValue("attachment", e.currentTarget.files[0])
            }
          />
          {formik.errors.attachment && (
            <div className="error">{formik.errors.attachment}</div>
          )}
        </div>

        <div className="form-group">
          <button type="submit">➕ Create Exercise</button>
        </div>
      </form>
    </main>
  );
}

export default CreateExercise;
