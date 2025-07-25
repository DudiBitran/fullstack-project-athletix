import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import "../../style/adminDash/userDetails.css";
import { useFormik } from "formik";
import Joi from "joi";
import ConfirmationModal from "../../components/common/confirmationModal";

const schema = Joi.object({
  firstName: Joi.string().min(2).max(30).required().label("First Name"),
  lastName: Joi.string().min(2).max(30).required().label("Last Name"),
  email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
  role: Joi.string().valid("user", "trainer", "admin").required().label("Role"),
});

function validateFormik(values) {
  const { error } = schema.validate(values, { abortEarly: false });
  if (!error) return {};
  const errors = {};
  for (let item of error.details) errors[item.path[0]] = item.message;
  return errors;
}

function EditUser() {
  const { userId } = useParams();
  const { getUserById, updateUserById, deleteUserById } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getUserById(userId);
        setUser(res.data);
        formik.setValues({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          email: res.data.email || ""
        });
      } catch (err) {
        setError(err.response?.data || "Failed to load user details");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    // eslint-disable-next-line
  }, [userId, getUserById]);

  const formik = useFormik({
    initialValues: { firstName: "", lastName: "", email: "" },
    validate: values => {
      const schema = Joi.object({
        firstName: Joi.string().min(2).max(30).required().label("First Name"),
        lastName: Joi.string().min(2).max(30).required().label("Last Name"),
        email: Joi.string().email({ tlds: { allow: false } }).required().label("Email"),
      });
      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) return {};
      const errors = {};
      for (let item of error.details) errors[item.path[0]] = item.message;
      return errors;
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setSaving(true);
      setError(null);
      setSuccess(null);
      try {
        await updateUserById(userId, values);
        setSuccess("User updated successfully.");
        setTimeout(() => navigate(-1), 1200);
      } catch (err) {
        setError(err.response?.data || "Failed to update user");
      } finally {
        setSaving(false);
      }
    },
  });

  const handleDelete = async () => {
    setShowDeleteModal(false);
    setDeleting(true);
    try {
      await deleteUserById(userId);
      setTimeout(() => navigate("/admin"), 800);
    } catch (err) {
      setError(err.response?.data || "Failed to delete user");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading user details...</div>;
  if (error) return <div className="text-danger">{error}</div>;
  if (!user) return <div>No user found.</div>;

  return (
    <div className="user-details-outer-wrapper">
      <div className="user-details-wrapper">
        <button className="user-details-back-btn" onClick={() => navigate(-1)}>&#8592; Back</button>
        <h2>Edit User</h2>
        <form onSubmit={formik.handleSubmit} style={{ maxWidth: 420, margin: "0 auto" }}>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className={`form-control${formik.touched.firstName && formik.errors.firstName ? " is-invalid" : ""}`}
              name="firstName"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="invalid-feedback">{formik.errors.firstName}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className={`form-control${formik.touched.lastName && formik.errors.lastName ? " is-invalid" : ""}`}
              name="lastName"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="invalid-feedback">{formik.errors.lastName}</div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control${formik.touched.email && formik.errors.email ? " is-invalid" : ""}`}
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>
          {success && <div className="alert alert-success mb-2">{success}</div>}
          {error && (
            <div className="alert alert-danger mb-2">
              {typeof error === "string"
                ? error
                : error.message
                  ? <>
                      {error.message}
                      {Array.isArray(error.details) && (
                        <ul style={{ margin: 0, paddingLeft: 18 }}>
                          {error.details.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      )}
                    </>
                  : JSON.stringify(error)}
            </div>
          )}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button type="submit" className="user-details-back-btn" disabled={saving || !formik.isValid} style={{ minWidth: 120 }}>
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {user.role === "user" && (
              <button type="button" className="btn btn-danger" onClick={() => setShowDeleteModal(true)} disabled={deleting} style={{ minWidth: 120 }}>
                {deleting ? "Deleting..." : "Delete User"}
              </button>
            )}
          </div>
        </form>
        <ConfirmationModal
          show={showDeleteModal}
          title="Delete User"
          message={`Are you sure you want to delete this user? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          icon="fas fa-trash-alt text-danger"
        />
      </div>
    </div>
  );
}

export default EditUser; 