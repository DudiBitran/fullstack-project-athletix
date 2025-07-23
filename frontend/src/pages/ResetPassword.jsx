import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userService from "../services/userService";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Joi from "joi";
import "../style/resetPassword.css";

const passwordRegex = /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
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

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateFields = (fields) => {
    const { error } = schema.validate(fields, { abortEarly: false });
    if (!error) return {};
    const errors = {};
    for (const detail of error.details) {
      errors[detail.path[0]] = detail.message;
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errors = validateFields({ password, confirmPassword });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    setLoading(true);
    try {
      await userService.resetPassword({ token, password });
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className="login-wrapper">
      <div className="login-box">
        <h2>Reset Password</h2>
        {submitted ? (
          <div className="server-message">
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form className="reset-password-form login-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-3">
              <label htmlFor="new-password" className="form-label">
                New Password
              </label>
              <div className="input-group">
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setFieldErrors(validateFields({ password: e.target.value, confirmPassword }));
                  }}
                  required
                  className={`form-control${fieldErrors.password ? " is-invalid" : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.password && <div className="invalid-feedback d-block">{fieldErrors.password}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="confirm-password" className="form-label">
                Confirm New Password
              </label>
              <div className="input-group">
                <input
                  id="confirm-password"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors(validateFields({ password, confirmPassword: e.target.value }));
                  }}
                  required
                  className={`form-control${fieldErrors.confirmPassword ? " is-invalid" : ""}`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  tabIndex={-1}
                  onClick={() => setShowConfirm(v => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <div className="invalid-feedback d-block">{fieldErrors.confirmPassword}</div>}
            </div>
            {error && <div className="server-message">{error}</div>}
            <button type="submit" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ResetPassword; 