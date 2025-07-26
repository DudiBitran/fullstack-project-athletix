import "../style/login.css";
import Input from "../components/common/input";
import { useState } from "react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useFormik } from "formik";
import Joi from "joi";
import { useAuth } from "../context/auth.context";

function Login() {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  
  const generatePostObj = (json) => {
    let postObj = {};
    postObj["email"] = json["email"];
    postObj["password"] = json["password"];
    return postObj;
  };

  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate(values) {
      const Schema = Joi.object({
        email: Joi.string()
          .email({ tlds: { allow: false } })
          .required()
          .messages({
            "string.email": "Email must be valid",
            "string.empty": "Email is required",
          }),
        password: Joi.string()
          .pattern(/^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)
          .required()
          .messages({
            "string.pattern.base":
              "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 4 digits, and 1 special character",
            "string.empty": "Password is required",
          }),
      });
      const { error } = Schema.validate(values, { abortEarly: false });

      const errors = {};
      if (error) {
        for (const detail of error.details) {
          errors[detail.path[0]] = detail.message;
        }
      }
      return errors;
    },

    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError("");
      try {
        const userDetails = generatePostObj(values);
        await login(userDetails);
        if (user && user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (err) {
        if (err.response?.status === 400) {
          const response = err.response.data;
          setServerError(response);
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  if (user) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/"} />;
  }

  return (
    <section className="login-wrapper">
      <div className="login-background">
        <div className="background-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <div className="logo-container">
              <div className="logo-icon">
                <FaUser />
              </div>
            </div>
            <h2>Welcome Back</h2>
            <p>Sign in to your account to continue</p>
          </div>

          {serverError && (
            <div className="server-error">
              <span>{serverError}</span>
            </div>
          )}

          <form
            className="login-form"
            noValidate
            autoComplete="off"
            onSubmit={formik.handleSubmit}
          >
            <div className="input-wrapper">
              <div className="input-group">
                <FaUser className="input-icon" />
                <Input
                  {...formik.getFieldProps("email")}
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={`form-control ${
                    formik.touched.email && formik.errors.email ? "is-invalid" : ""
                  }`}
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="invalid-feedback">{formik.errors.email}</div>
              )}
            </div>

            <div className="input-wrapper">
              <div className="input-group">
                <FaLock className="input-icon" />
                <Input
                  {...formik.getFieldProps("password")}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  className={`form-control ${
                    formik.touched.password && formik.errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="invalid-feedback">
                  {formik.errors.password}
                </div>
              )}
            </div>

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="login-links">
            <Link to="/forgot-password" className="forgot-password">
              Forgot your password?
            </Link>
            <div className="signup-link">
              <span>Don't have an account? </span>
              <Link to="/register" className="link-span">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
