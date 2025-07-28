import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Joi from "joi";
import { useAuth } from "../context/auth.context";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import "../style/resetPassword.css";

const passwordRegex = /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

function ResetPassword() {
  const { resetPassword } = useAuth();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const initialValues = { password: "", confirmPassword: "" };
  const schema = Joi.object({
    password: Joi.string().pattern(passwordRegex).required().messages({
      "string.pattern.base":
        "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 4 digits, and 1 special character",
      "string.empty": "Password is required",
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      "any.only": "Passwords do not match",
      "any.required": "Please confirm your password"
    })
  });

  const validate = (values) => {
    const { error } = schema.validate(values, { abortEarly: false });
    const errors = {};
    if (error) {
      for (const detail of error.details) {
        errors[detail.path[0]] = detail.message;
      }
    }
    return errors;
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    if (!token) {
      setError("Invalid or missing token.");
      setSubmitting(false);
      return;
    }
    setLoading(true);
    try {
      await resetPassword({ token, password: values.password });
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.log(err);
      
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
    setSubmitting(false);
  };

  return (
    <section className="reset-password-wrapper">
      <div className="reset-password-box">
        <h2>Reset Password</h2>
        {submitted ? (
          <div className="reset-password-server-message success">
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values }) => (
              <Form className="reset-password-form" autoComplete="off">
                <div className="mb-3">
                  <label htmlFor="new-password" className="form-label">
                    New Password
                  </label>
                  <div className="reset-password-input-group" style={{ position: 'relative' }}>
                    <FaLock style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: 16, pointerEvents: 'none' }} />
                    <Field
                      id="new-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      autoComplete="new-password"
                      style={{ paddingLeft: 28 }}
                    />
                    <button
                      type="button"
                      className="reset-password-btn"
                      tabIndex={-1}
                      onClick={() => setShowPassword(v => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#ffe600', fontSize: 18, cursor: 'pointer', padding: 0 }}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="reset-password-invalid-feedback" />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm New Password
                  </label>
                  <div className="reset-password-input-group" style={{ position: 'relative' }}>
                    <FaLock style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.6)', fontSize: 16, pointerEvents: 'none' }} />
                    <Field
                      id="confirm-password"
                      name="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      className="form-control"
                      autoComplete="new-password"
                      style={{ paddingLeft: 28 }}
                    />
                    <button
                      type="button"
                      className="reset-password-btn"
                      tabIndex={-1}
                      onClick={() => setShowConfirm(v => !v)}
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#ffe600', fontSize: 18, cursor: 'pointer', padding: 0 }}
                    >
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <ErrorMessage name="confirmPassword" component="div" className="reset-password-invalid-feedback" />
                </div>
                {error && <div className="reset-password-server-message">{error}</div>}
                <button type="submit" className="reset-password-btn" disabled={isSubmitting || loading} style={{ marginTop: 8 }}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
}

export default ResetPassword; 