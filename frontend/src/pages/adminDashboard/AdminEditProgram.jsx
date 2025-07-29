import "../../style/trainerDash/createExercise.css";
import { FaDumbbell, FaArrowLeft } from "react-icons/fa";
import { useFormik } from "formik";
import Joi from "joi";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = Joi.object({
  title: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Program title is required",
    "string.min": "Title must be at least 2 characters",
    "string.max": "Title can't exceed 100 characters",
  }),
  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string",
  }),
  difficulty: Joi.string().valid("beginner", "intermediate", "advanced").optional().messages({
    "any.only": "Difficulty must be one of: beginner, intermediate, advanced",
  }),
  durationWeeks: Joi.number().min(1).max(52).optional().messages({
    "number.base": "Duration must be a number",
    "number.min": "Duration must be at least 1 week",
    "number.max": "Duration can't exceed 52 weeks",
  }),
});

function AdminEditProgram() {
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const { getAllPrograms, adminUpdateProgram } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    difficulty: "",
    durationWeeks: "",
  });

  useEffect(() => {
    async function fetchProgram() {
      try {
        setLoading(true);
        const all = await getAllPrograms();
        const program = all.data.find((prog) => prog._id === id);
        if (!program) {
          setServerError("Program not found");
          setLoading(false);
          return;
        }
        setInitialValues({
          title: program.title || "",
          description: program.description || "",
          difficulty: program.difficulty || "",
          durationWeeks: program.durationWeeks || "",
        });
        setLoading(false);
      } catch (err) {
        setServerError("Failed to load program");
        setLoading(false);
      }
    }
    fetchProgram();
  }, [id, getAllPrograms]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
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
        const programData = {
          title: values.title,
          description: values.description,
          difficulty: values.difficulty,
          durationWeeks: values.durationWeeks,
        };
        
        await adminUpdateProgram(id, programData);
        toast.success("Program updated successfully!");
        setTimeout(() => navigate("/admin/programs"), 1200);
      } catch (err) {
        if (err.response?.status >= 400) {
          const response = err.response.data;
          setServerError(response);
          toast.error(typeof response === "string" ? response : "Failed to update program");
        }
      }
    },
  });

  if (loading) return <div>Loading...</div>;

  return (
    <main className="createExercise-container">
      <form
        onSubmit={formik.handleSubmit}
        className="form-container"
        noValidate
        autoComplete="off"
      >
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="form-title">
          <FaDumbbell /> Edit Program
        </h2>

        {serverError && <div className="serverError">{serverError}</div>}

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">
            Title <span className="red-dot">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Beginner Strength Program"
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
            placeholder="Describe the program..."
            {...formik.getFieldProps("description")}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="error">{formik.errors.description}</div>
          )}
        </div>

        {/* Difficulty */}
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty</label>
          <select {...formik.getFieldProps("difficulty")}>
            <option value="">Select difficulty level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {formik.touched.difficulty && formik.errors.difficulty && (
            <div className="error">{formik.errors.difficulty}</div>
          )}
        </div>

        {/* Duration */}
        <div className="form-group">
          <label htmlFor="durationWeeks">Duration (weeks)</label>
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

        <div className="form-group">
          <button type="submit">💾 Update Program</button>
        </div>
      </form>
    </main>
  );
}

export default AdminEditProgram; 