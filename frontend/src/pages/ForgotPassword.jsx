import { useState } from "react";
import userService from "../services/userService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await userService.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
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
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="form-control"
            />
            <button type="submit">Send Reset Link</button>
            {error && <div className="server-error">{error}</div>}
          </form>
        )}
      </div>
    </section>
  );
}

export default ForgotPassword; 