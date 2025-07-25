import React, { useState } from "react";
import { useFormik } from "formik";
import Joi from "joi";
import adminService from "../../services/adminService";
import Input from "../../components/common/input";
import { useNavigate } from "react-router";

const schema = Joi.object({
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .pattern(/^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.pattern.base":
        "Password must be at least 8 characters, contain at least 4 digits, one uppercase letter, one lowercase letter, and one special character",
    }),
  age: Joi.number().min(18).required().messages({
    "number.base": "Age must be a number",
    "number.min": "You must be at least 18 years old",
    "any.required": "Age is required",
  }),
  gender: Joi.string().valid("male", "female", "other").required().messages({
    "any.only": "Gender must be male, female or other",
    "any.required": "Gender is required",
  }),
  height: Joi.number().min(100).max(250).required().messages({
    "number.base": "Height must be a number",
    "any.required": "Height is required",
  }),
  weight: Joi.number().min(30).max(300).required().messages({
    "number.base": "Weight must be a number",
    "any.required": "Weight is required",
  }),
  bodyFat: Joi.number().min(3).max(60).optional().allow(null, "").messages({
    "number.base": "Body fat must be a number",
  }),
  bio: Joi.string().max(500).allow("").optional().messages({
    "string.base": "Bio must be a string.",
    "string.max": "Bio can't exceed 500 characters.",
  }),
  image: Joi.any().optional(),
});

function CreateTrainer() {
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleImageSelect = (file) => {
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
    formik.setFieldValue("image", file);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      bodyFat: "",
      bio: "",
      image: null,
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
    onSubmit: async (values, { resetForm }) => {
      setServerError("");
      const formData = new FormData();
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("age", values.age);
      formData.append("gender", values.gender);
      formData.append("image", imageFile);
      formData.append("stats[height]", values.height);
      formData.append("stats[weight]", values.weight);
      formData.append("stats[bodyFat]", values.bodyFat);
      const trainer = {
        bio: values.bio,
      };
      formData.append("trainer", JSON.stringify(trainer));
      try {
        await adminService.createTrainer(formData);
        setSuccess(true);
        resetForm();
        setTimeout(() => navigate(0), 1500);
      } catch (err) {
        if (err.response?.data) {
          setServerError(
            typeof err.response.data === "string"
              ? err.response.data
              : err.response.data.message || "Failed to create trainer"
          );
        } else {
          setServerError("Failed to create trainer");
        }
      }
    },
  });

  return (
    <section className="create-trainer-wrapper">
      <div className="create-trainer-box">
        <h2>Create Trainer</h2>
        <p>Add a new trainer account</p>
        {success && <div className="create-trainer-success">Trainer created successfully!</div>}
        {serverError && <div className="create-trainer-error">{serverError}</div>}
        <form className="create-trainer-form" onSubmit={formik.handleSubmit} noValidate autoComplete="off">
          <div className="create-trainer-inputs">
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("firstName")}
                type="text"
                label="First Name"
                name="firstName"
                className="create-trainer-input"
                required
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <div className="create-trainer-invalid-feedback">{formik.errors.firstName}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("lastName")}
                type="text"
                label="Last Name"
                name="lastName"
                className="create-trainer-input"
                required
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <div className="create-trainer-invalid-feedback">{formik.errors.lastName}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("email")}
                type="email"
                label="Email"
                name="email"
                className="create-trainer-input"
                required
              />
              {formik.touched.email && formik.errors.email && (
                <div className="create-trainer-invalid-feedback">{formik.errors.email}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("password")}
                type="password"
                label="Password"
                name="password"
                className="create-trainer-input"
                required
              />
              {formik.touched.password && formik.errors.password && (
                <div className="create-trainer-invalid-feedback">{formik.errors.password}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("age")}
                type="number"
                label="Age"
                name="age"
                className="create-trainer-input"
                required
              />
              {formik.touched.age && formik.errors.age && (
                <div className="create-trainer-invalid-feedback">{formik.errors.age}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <label className="create-trainer-label">Gender</label>
              <select
                className="create-trainer-input"
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {formik.touched.gender && formik.errors.gender && (
                <div className="create-trainer-invalid-feedback">{formik.errors.gender}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("bio")}
                type="text"
                label="Bio"
                name="bio"
                className="create-trainer-input"
                as="textarea"
                rows={2}
              />
              {formik.touched.bio && formik.errors.bio && (
                <div className="create-trainer-invalid-feedback">{formik.errors.bio}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("height")}
                type="number"
                label="Height (cm)"
                name="height"
                className="create-trainer-input"
                required
              />
              {formik.touched.height && formik.errors.height && (
                <div className="create-trainer-invalid-feedback">{formik.errors.height}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("weight")}
                type="number"
                label="Weight (kg)"
                name="weight"
                className="create-trainer-input"
                required
              />
              {formik.touched.weight && formik.errors.weight && (
                <div className="create-trainer-invalid-feedback">{formik.errors.weight}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <Input
                {...formik.getFieldProps("bodyFat")}
                type="number"
                label="Body Fat (%)"
                name="bodyFat"
                className="create-trainer-input"
              />
              {formik.touched.bodyFat && formik.errors.bodyFat && (
                <div className="create-trainer-invalid-feedback">{formik.errors.bodyFat}</div>
              )}
            </div>
            <div className="create-trainer-input-group">
              <label className="create-trainer-label">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="create-trainer-input"
                onChange={e => handleImageSelect(e.target.files[0])}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected profile preview"
                  className="create-trainer-image-preview"
                  style={{ marginTop: 10, maxWidth: 120, maxHeight: 120, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
                />
              )}
            </div>
          </div>
          <button type="submit" className="create-trainer-btn">
            Create Trainer
          </button>
        </form>
      </div>
    </section>
  );
}

export default CreateTrainer; 