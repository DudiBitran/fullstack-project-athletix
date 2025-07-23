import { useState, useEffect } from "react";
import { useFormik } from "formik";
import Joi from "joi";
import { useAuth } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { FaWpforms, FaSave, FaArrowLeft } from "react-icons/fa";
import "../../style/trainerDash/createProgram.css";

const schema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().allow("").optional(),
  durationWeeks: Joi.number().min(1).max(52).required().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 1 week",
    "number.max": "Duration cannot exceed 52 weeks",
  }),
  difficulty: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .required()
    .messages({
      "any.only": "Difficulty must be beginner, intermediate, or advanced",
    }),
});

function UpdateProgram() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState(null);
  const { user, updateProgram, getProgramById } = useAuth();
  const navigate = useNavigate();
  const { programId } = useParams();

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await getProgramById(programId);
        setProgram(response.data);
        
        // Set initial values for formik
        formik.setValues({
          title: response.data.title || "",
          description: response.data.description || "",
          durationWeeks: response.data.durationWeeks || "",
          difficulty: response.data.difficulty || "",
        });
      } catch (err) {
        toast.error("Failed to load program details");
        navigate("/trainer/my-programs");
      } finally {
        setLoading(false);
      }
    };

    if (programId) {
      fetchProgram();
    }
  }, [programId]);

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
        await updateProgram(programId, values);
        toast.success("Program updated successfully!");
        setTimeout(() => navigate("/trainer/my-programs"), 1200);
      } catch (err) {
        if (err.response?.status >= 400) {
          const response = err.response.data;
          setServerError(response);
          toast.error(typeof response === "string" ? response : "Failed to update program");
        }
      }
    },
  });

  if (loading) {
    return (
      <main className="createProgram-container">
        <div className="form-container">
          <p>Loading program details...</p>
        </div>
      </main>
    );
  }

  if (!program) {
    return (
      <main className="createProgram-container">
        <div className="form-container">
          <p>Program not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="createProgram-container">
      <form
        onSubmit={formik.handleSubmit}
        className="form-container"
        noValidate
        autoComplete="off"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="form-title">
            <FaWpforms /> Update Program
          </h2>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/trainer/my-programs")}
          >
            <FaArrowLeft className="me-2" />
            Back to Programs
          </button>
        </div>

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
            placeholder="Describe your program..."
            rows="4"
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error">{formik.errors.description}</div>
          )}
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="durationWeeks">
            Duration (weeks) <span className="red-dot">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="52"
            placeholder="e.g., 8"
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

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="submit-btn">
            <FaSave className="me-2" />
            Update Program
          </button>
        </div>
      </form>
    </main>
  );
}

export default UpdateProgram; 