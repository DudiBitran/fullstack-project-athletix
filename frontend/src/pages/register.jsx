import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaWeight,
  FaRulerVertical,
  FaPercent,
  FaVenusMars,
} from "react-icons/fa";
import "../style/register.css";
import { Link } from "react-router";
import Input from "../components/common/input";

function Register() {
  return (
    <div className="container-fluid register-wrapper d-flex align-items-center justify-content-center min-vh-100">
      <div className="register-box p-4">
        <h2 className="text-center mb-1">Create Account</h2>
        <p className="text-center mb-4">Join us and get started</p>
        <form>
          <div className="row g-4">
            {/* First Name */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="text"
                label="First Name"
                name="firstName"
                className="form-control underline-input"
                placeholder="Joe"
                required
              />
            </div>

            {/* Last Name */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="text"
                label="Last Name"
                name="lastName"
                className="form-control underline-input"
                placeholder="Doh"
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="email"
                name="email"
                label="Email"
                className="form-control underline-input"
                placeholder="Email"
                required
              />
            </div>

            {/* Password */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="password"
                label="Password"
                name="password"
                className="form-control underline-input"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="password"
                label="Confirm Password"
                name="confirmPassword"
                className="form-control underline-input"
                required
              />
            </div>

            {/* Age */}
            <div className="col-md-6 col-lg-4">
              <Input
                type="number"
                label="Age"
                name="age"
                className="form-control underline-input"
                required
              />
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
                defaultValue=""
              >
                <option value="" className="disabled-select" disabled>
                  Gender
                </option>

                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Weight */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="number"
                label="weight"
                name="weight"
                className="form-control underline-input"
                placeholder="Weight (kg)"
                required
              />
            </div>

            {/* Height */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                type="number"
                label="height"
                name="height"
                className="form-control underline-input"
                placeholder="Height (cm)"
                required
              />
            </div>

            {/* Body Fat */}
            <div className="col-md-6 col-lg-4 position-relative">
              <Input
                label="Body Fat (%) - Optional"
                type="number"
                name="bodyFat"
                className="form-control underline-input"
              />
            </div>

            {/* Upload Image - placed last */}
            <div className="col-12">
              <div className="image-upload-placeholder">
                Drag & drop or click to upload
              </div>
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
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
