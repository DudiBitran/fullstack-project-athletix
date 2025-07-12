import "../../style/trainerDash/createExercise.css";
import { FaDumbbell } from "react-icons/fa";
import { useFormik } from "formik";
import Joi from "joi";
import { useState } from "react";
import { useAuth } from "../../context/auth.context";
import { useNavigate } from "react-router";

const schema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Exercise name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name can't exceed 100 characters",
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
        formData.append("sets", values.sets);
        formData.append("reps", values.reps);
        formData.append("restSeconds", values.restSeconds);
        formData.append("notes", values.notes);
        if (values.attachment) {
          formData.append("attachment", values.attachment);
        }

        await createExercise(formData);
        navigate("/trainer/my-exercises");
      } catch (err) {
        if (err.response?.status >= 400) {
          const response = err.response.data;
          setServerError(response);
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
