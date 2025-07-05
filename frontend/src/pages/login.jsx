import "../style/login.css";
import Input from "../components/common/input";
import { useState } from "react";
import { FaUser, FaLock } from "react-icons/fa";
import { Link, useNavigate, Navigate } from "react-router";
import { useFormik } from "formik";
import Joi from "joi";
import { useAuth } from "../context/auth.context";

function Login() {
  const [serverError, setServerError] = useState("");
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
      try {
        const userDetails = generatePostObj(values);
        await login(userDetails);
        navigate("/");
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
    <section className="login-wrapper">
      <div className="login-box">
        <h2>Welcome Back</h2>
        <p>Sign in to continue</p>
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
          <div className="input-group">
            <FaUser className="input-icon" />
            <Input
              {...formik.getFieldProps("email")}
              type="text"
              name="email"
              placeholder="Email"
              className={`form-control ${
                formik.touched.email && formik.errors.email ? "is-invalid" : ""
              }`}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="invalid-feedback mt-1">{formik.errors.email}</div>
          )}

          <div className="input-group">
            <FaLock className="input-icon" />
            <Input
              {...formik.getFieldProps("password")}
              type="password"
              name="password"
              placeholder="Password"
              className={`form-control ${
                formik.touched.password && formik.errors.password
                  ? "is-invalid"
                  : ""
              }`}
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="invalid-feedback mt-1">
              {formik.errors.password}
            </div>
          )}
          <button type="submit">Login</button>
        </form>
        <div className="login-links">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="link-span">
              Sign up
            </Link>
          </p>
          <p>
            <Link className="link-span">Forgot the password?</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
