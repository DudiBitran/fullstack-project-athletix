import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAuth } from "../context/auth.context";
import Joi from "joi";
import "../style/forgotPassword.css";

function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const initialValues = { email: "" };
  const emailSchema = Joi.object({
    email: Joi.string().email({ tlds: { allow: false } }).required().messages({
      "string.empty": "Email is required",
      "string.email": "Invalid email address"
    })
  });

  const validate = (values) => {
    const { error } = emailSchema.validate(values, { abortEarly: false });
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
    try {
      await forgotPassword(values.email);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
    setSubmitting(false);
  };

  return (
    <section className="login-wrapper">
      <div className="login-box">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a password reset link.</p>
        {submitted ? (
          <div className="server-message success" role="status" aria-live="polite">
            <span style={{fontSize: '1.3em', lineHeight: 1, verticalAlign: 'middle'}} aria-hidden="true">✔️</span>
            <span>If your email exists, you will receive a reset link.</span>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="forgot-password-form">
                <label htmlFor="email" className="form-label">Email</label>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  autoComplete="email"
                />
                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                <button type="submit" disabled={isSubmitting}>Send Reset Link</button>
                {error && <div className="server-error">{error}</div>}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </section>
  );
}

export default ForgotPassword; 