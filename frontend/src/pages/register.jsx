import "../style/register.css";
import { Link, useNavigate, Navigate } from "react-router";
import Input from "../components/common/input";
import { useFormik } from "formik";
import Joi from "joi";
import { useState } from "react";
import ImageUploader from "../components/common/imageUploader";
import { useAuth } from "../context/auth.context";

function Register() {
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { createUser, user } = useAuth();
  const navigate = useNavigate();

  const handleImageSelect = (file) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    registerFormik.setFieldValue("image", file.name);
  };

  const registerFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
      age: "",
      gender: "",
      height: "",
      weight: "",
      bodyFat: "",
    },

    validate(values) {
      const passwordRegex =
        /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

      const registerSchema = Joi.object({
        firstName: Joi.string().min(2).max(30).required().messages({
          "string.empty": "First name is required",
          "string.min": "First name must be at least 2 characters",
        }),

        lastName: Joi.string().min(2).max(30).required().messages({
          "string.empty": "Last name is required",
          "string.min": "Last name must be at least 2 characters",
        }),

        email: Joi.string()
          .email({ tlds: { allow: false } })
          .required()
          .messages({
            "string.email": "Invalid email format",
            "string.empty": "Email is required",
          }),

        password: Joi.string().pattern(passwordRegex).required().messages({
          "string.empty": "Password is required",
          "string.pattern.base":
            "Password must be at least 8 characters, contain at least 4 digits, one uppercase letter, one lowercase letter, and one special character",
        }),

        confirmPassword: Joi.any()
          .valid(Joi.ref("password"))
          .required()
          .messages({
            "any.only": "Passwords do not match",
            "any.required": "Confirm password is required",
          }),

        age: Joi.number().min(18).required().messages({
          "number.base": "Age must be a number",
          "number.min": "You must be at least 18 years old",
          "any.required": "Age is required",
        }),

        gender: Joi.string()
          .valid("male", "female", "other")
          .required()
          .messages({
            "any.only": "Gender must be male, female or other",
            "any.required": "Gender is required",
          }),

        height: Joi.number().min(100).max(300).required().messages({
          "number.base": "Height must be a number",
          "any.required": "Height is required",
        }),

        weight: Joi.number().min(30).max(500).required().messages({
          "number.base": "Weight must be a number",
          "any.required": "Weight is required",
        }),

        bodyFat: Joi.string()
          .optional()
          .allow("")
          .pattern(/^\d+(\.\d+)?$/)
          .custom((value, helpers) => {
            if (value === "") return value;

            const num = parseFloat(value);
            if (num < 0 || num > 50) {
              return helpers.error("number.range", { limit: "0-50" });
            }
            return value;
          })
          .messages({
            "string.pattern.base": "Body fat must be a valid number",
            "number.range": "Body fat must be between 0 and 50",
          }),
        image: Joi.string().allow("").optional(),
      });

      const { error } = registerSchema.validate(values, { abortEarly: false });

      const errors = {};

      if (error) {
        for (const detail of error.details) {
          errors[detail.path[0]] = detail.message;
        }
        return errors;
      }
    },

    onSubmit: async (values) => {
      const formData = new FormData();

      if (imageFile) {
        formData.append("image", imageFile);
      }

      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("age", values.age);
      formData.append("gender", values.gender);

      const stats = {};
      if (values.height) stats.height = Number(values.height);
      if (values.weight) stats.weight = Number(values.weight);
      if (values.bodyFat) stats.bodyFat = Number(values.bodyFat);

      formData.append("stats", JSON.stringify(stats));

      try {
        const response = await createUser(formData);
        navigate("/");
        return response;
      } catch (err) {
        if (err.response?.status === 400) {
          const response = err.response.data;
          setServerError(response);
        }
      }
    },
  });

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="container-fluid register-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="register-box p-4">
        <h2 className="text-center mb-1">Create Account</h2>
        <p className="text-center mb-4">Join us and get started</p>
        {serverError ? <div className="serverError">{serverError}</div> : ""}
        <form
          onSubmit={registerFormik.handleSubmit}
          noValidate
          autoComplete="off"
        >
          <div className="row g-4">
            {/* First Name */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("firstName")}
                type="text"
                label="First Name"
                name="firstName"
                className="form-control underline-input"
                placeholder="Joe"
                required
              />
              {registerFormik.touched.firstName &&
                registerFormik.errors.firstName && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.firstName}
                  </div>
                )}
            </div>

            {/* Last Name */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("lastName")}
                type="text"
                label="Last Name"
                name="lastName"
                className="form-control underline-input"
                placeholder="Doh"
                required
              />
              {registerFormik.touched.lastName &&
                registerFormik.errors.lastName && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.lastName}
                  </div>
                )}
            </div>

            {/* Email */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("email")}
                type="email"
                name="email"
                label="Email"
                className="form-control underline-input"
                placeholder="Email"
                required
              />
              {registerFormik.touched.email && registerFormik.errors.email && (
                <div className="invalid-feedback mt-1">
                  {registerFormik.errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("password")}
                type="password"
                label="Password"
                name="password"
                className="form-control underline-input"
                required
              />
              {registerFormik.touched.password &&
                registerFormik.errors.password && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.password}
                  </div>
                )}
            </div>

            {/* Confirm Password */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("confirmPassword")}
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                className="form-control underline-input"
                required
              />
              {registerFormik.touched.confirmPassword &&
                registerFormik.errors.confirmPassword && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.confirmPassword}
                  </div>
                )}
            </div>

            {/* Age */}
            <div className="col-md-6 col-lg-4">
              <Input
                {...registerFormik.getFieldProps("age")}
                type="number"
                label="Age"
                name="age"
                className="form-control underline-input"
                required
              />
              {registerFormik.touched.age && registerFormik.errors.age && (
                <div className="invalid-feedback mt-1">
                  {registerFormik.errors.age}
                </div>
              )}
            </div>

            {/* Gender */}
            <div className="col-md-6 col-lg-4 position-relative">
              <label>
                Gender <span className="text-danger ms-1">*</span>
              </label>
              <select
                name="gender"
                className="form-select underline-input"
                required
                value={registerFormik.values.gender}
                onChange={registerFormik.handleChange}
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {registerFormik.touched.gender &&
                registerFormik.errors.gender && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.gender}
                  </div>
                )}
            </div>

            {/* Weight */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("weight")}
                type="number"
                label="weight"
                name="weight"
                className="form-control underline-input"
                placeholder="Weight (kg)"
                required
              />
              {registerFormik.touched.weight &&
                registerFormik.errors.weight && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.weight}
                  </div>
                )}
            </div>

            {/* Height */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("height")}
                type="number"
                label="height"
                name="height"
                className="form-control underline-input"
                placeholder="Height (cm)"
                required
              />
              {registerFormik.touched.height &&
                registerFormik.errors.height && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.height}
                  </div>
                )}
            </div>

            {/* Body Fat */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                {...registerFormik.getFieldProps("bodyFat")}
                label="Body Fat (%) - Optional"
                type="string"
                name="bodyFat"
                className="form-control underline-input"
              />
              {registerFormik.touched.bodyFat &&
                registerFormik.errors.bodyFat && (
                  <div className="invalid-feedback mt-1">
                    {registerFormik.errors.bodyFat}
                  </div>
                )}
            </div>

            {/* Upload Image - placed last */}
            <div className="col-12">
              <label htmlFor="imageUpload" className="form-label">
                Profile image
              </label>
              {previewUrl ? (
                <div className="image-preview-wrapper">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setPreviewUrl(null);
                      registerFormik.setFieldValue("image", "");
                    }}
                    className="image-remove-btn"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="image-upload-placeholder">
                  <ImageUploader
                    onFileSelected={handleImageSelect}
                    previewUrl={previewUrl}
                  />
                </div>
              )}

              {registerFormik.errors.image && (
                <div className="invalid-feedback mt-1 d-block">
                  {registerFormik.errors.image}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button type="submit" className="submit-btn">
              Register
            </button>
          </div>
        </form>

        <div className="text-center mt-3">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="lgn-btn">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
