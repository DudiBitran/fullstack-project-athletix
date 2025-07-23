import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import userService from "../services/userService";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!token) {
      setError("Invalid or missing token.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await userService.resetPassword({ token, password });
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="login-wrapper">
      <div className="login-box">
        <h2>Reset Password</h2>
        {submitted ? (
          <div className="server-error" style={{ color: 'green' }}>
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="form-control"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="form-control"
            />
            <button type="submit">Reset Password</button>
            {error && <div className="server-error">{error}</div>}
          </form>
        )}
      </div>
    </section>
  );
}

export default ResetPassword; 