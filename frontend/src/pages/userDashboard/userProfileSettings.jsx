import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { useFormik } from "formik";
import Joi from "joi";
import { toast } from "react-toastify";
import { Navigate } from "react-router";
import Input from "../../components/common/input";
import ImageUploader from "../../components/common/imageUploader";
import { FaUser, FaEnvelope, FaBirthdayCake, FaVenusMars, FaRulerVertical, FaWeight, FaPercentage, FaCamera, FaSave, FaUndo, FaTrash } from "react-icons/fa";
import "../../style/userDashboard/userProfileSettings.css";
import ConfirmationModal from "../../components/common/confirmationModal";
import axios from "axios";

function UserProfileSettings() {
  const { user, refreshUser, updateUserData, sendTrainerDeleteRequest, changePassword, updateUser, updateUserImage, removeUserImage } = useAuth();  
  const [serverError, setServerError] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [deleteRequestLoading, setDeleteRequestLoading] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [changePwLoading, setChangePwLoading] = useState(false);
  const [changePwError, setChangePwError] = useState("");
  const [changePwSuccess, setChangePwSuccess] = useState("");

  // Change Password Formik
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePw = async (e) => {
    e.preventDefault();
    setChangePwError("");
    setChangePwSuccess("");
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setChangePwError("All fields are required.");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setChangePwError("New password must be at least 6 characters.");
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setChangePwError("New passwords do not match.");
      return;
    }
    setChangePwLoading(true);
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setChangePwSuccess("Password changed successfully.");
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully.");
    } catch (err) {
      setChangePwError(
        err.response?.data || err.message || "Failed to change password. Please try again."
      );
      toast.error(
        err.response?.data || err.message || "Failed to change password. Please try again."
      );
    } finally {
      setChangePwLoading(false);
    }
  };

  // Function to check if email already exists
  const checkEmailExists = async (email) => {
    if (email === currentUser?.email) {
      return false; // Same email, no conflict
    }
    
    try {
      // This would need a backend endpoint to check email existence
      // For now, we'll handle this in the backend validation
      return false;
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      const userImageUrl = user.image ? `http://localhost:3000/${user.image.replace(/^\/+/, "")}` : "/default-avatar-profile.jpg";
      setPreviewUrl(userImageUrl);
      setOriginalImageUrl(userImageUrl);
    }
  }, [user]);

  const handleImageSelect = (file) => {
    console.log("Image selected:", file);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    profileFormik.setFieldValue("image", file.name);
    setRemoveImage(false);
  };

  const profileFormik = useFormik({
    initialValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      age: currentUser?.age || "",
      gender: currentUser?.gender || "",
      height: currentUser?.stats?.height || "",
      weight: currentUser?.stats?.weight || "",
      bodyFat: currentUser?.stats?.bodyFat || "",
      image: "",
    },

    validate(values) {
      const profileSchema = Joi.object({
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
        age: Joi.number()
          .min(18)
          .max(100)
          .required()
          .messages({
            "number.base": "Age must be a number",
            "number.min": "You must be at least 18 years old",
            "number.max": "Age cannot exceed 100",
          }),
        gender: Joi.string()
          .valid("male", "female", "other")
          .required()
          .messages({
            "any.only": "Please select a valid gender",
          }),
        height: Joi.number()
          .min(100)
          .max(250)
          .optional()
          .allow("")
          .messages({
            "number.base": "Height must be a valid number",
            "number.min": "Height must be at least 100 cm",
            "number.max": "Height cannot exceed 250 cm",
          }),
        weight: Joi.number()
          .min(30)
          .max(300)
          .optional()
          .allow("")
          .messages({
            "number.base": "Weight must be a valid number",
            "number.min": "Weight must be at least 30 kg",
            "number.max": "Weight cannot exceed 300 kg",
          }),
        bodyFat: Joi.number()
          .min(3)
          .max(60)
          .optional()
          .allow("")
          .messages({
            "number.base": "Body fat must be a valid number",
            "number.min": "Body fat must be at least 3%",
            "number.max": "Body fat cannot exceed 60%",
          }),
        image: Joi.string().allow("").optional(),
      });

      const { error } = profileSchema.validate(values, { abortEarly: false });
      const errors = {};

      if (error) {
        for (const detail of error.details) {
          errors[detail.path[0]] = detail.message;
        }
        return errors;
      }
    },

    onSubmit: async (values) => {
      setIsLoading(true);
      setServerError("");

      try {
        // Update profile information
        const updateData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          age: Number(values.age),
          gender: values.gender,
          stats: {
            height: values.height ? Number(values.height) : null,
            weight: values.weight ? Number(values.weight) : null,
            bodyFat: values.bodyFat ? Number(values.bodyFat) : null,
          },
        };

        // Update profile information first
        try {
          await updateUser(updateData);
        } catch (updateErr) {
          // Check if it's an email uniqueness error
          if (updateErr.response?.status === 400) {
            const errorData = updateErr.response.data;
            if (errorData.message && errorData.message.includes("email")) {
              setServerError(errorData.message);
              toast.error(errorData.message);
              return;
            } else if (errorData.message) {
              // Handle other validation errors
              setServerError(errorData.message);
              toast.error(errorData.message);
              return;
            }
          }
          throw updateErr; // Re-throw if it's not a handled error
        }

        // Update profile image if a new image was selected or if image should be removed
        if (imageFile) {
          try {
            console.log("Uploading image:", imageFile);
            const imageResponse = await updateUserImage(imageFile);
            console.log("Image upload response:", imageResponse);
            
            // Update the user state with the new image data
            if (imageResponse.data && imageResponse.data.user) {
              setCurrentUser(imageResponse.data.user);
              const newImageUrl = imageResponse.data.user.image ? 
                `http://localhost:3000/${imageResponse.data.user.image.replace(/^\/+/, "")}` : null;
              setPreviewUrl(newImageUrl);
              setOriginalImageUrl(newImageUrl);
            }
            
            toast.success("Profile and image updated successfully!");
            
            // Immediately update the auth context
            try {
              console.log("Updating auth context after image upload...");
              await updateUserData();
              console.log("Auth context updated successfully");
            } catch (updateErr) {
              console.error("Failed to update auth context:", updateErr);
            }
          } catch (imageErr) {
            console.error("Image upload error:", imageErr);
            toast.warning("Profile updated but image upload failed. Please try uploading the image again.");
          }
        } else if (removeImage) {
          try {
            console.log("Removing profile image...");
            const removeResponse = await removeUserImage();
            console.log("Remove image response:", removeResponse);
            
            // Update the user state with the default image data
            if (removeResponse.data && removeResponse.data.user) {
              setCurrentUser(removeResponse.data.user);
              setPreviewUrl("/default-avatar-profile.jpg");
              setOriginalImageUrl("/default-avatar-profile.jpg");
            }
            
            toast.success("Profile updated and image removed successfully!");
            
            // Immediately update the auth context
            try {
              console.log("Updating auth context after image removal...");
              await updateUserData();
              console.log("Auth context updated successfully");
            } catch (updateErr) {
              console.error("Failed to update auth context:", updateErr);
            }
          } catch (removeErr) {
            console.error("Image removal error:", removeErr);
            toast.warning("Profile updated but image removal failed. Please try again.");
          }
        } else {
          toast.success("Profile updated successfully!");
        }

        // Refresh user data with a small delay to ensure backend processing
        setTimeout(async () => {
          try {
            await updateUserData();
          } catch (err) {
            throw err;
          }
        }, 500);
        
        // Reset image file state and remove flag
        setImageFile(null);
        setRemoveImage(false);
        
      } catch (err) {
        console.error("Profile update error:", err);
        
        // Handle different types of errors
        if (err.response?.data?.message) {
          // Backend validation error - show exact server message
          const errorMessage = err.response.data.message;
          setServerError(errorMessage);
          toast.error(errorMessage);
        } else if (err.response?.data) {
          // Server response without message field
          const errorMessage = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
          setServerError(errorMessage);
          toast.error(errorMessage);
        } else if (err.message) {
          // General error
          setServerError(err.message);
          toast.error(err.message);
        } else {
          // Fallback error
          setServerError("Unable to update profile. Please check your information and try again.");
          toast.error("Unable to update profile. Please check your information and try again.");
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Update form values when currentUser changes
  useEffect(() => {
    if (currentUser) {
      profileFormik.setValues({
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",
        age: currentUser.age || "",
        gender: currentUser.gender || "",
        height: currentUser.stats?.height || "",
        weight: currentUser.stats?.weight || "",
        bodyFat: currentUser.stats?.bodyFat || "",
        image: "",
      });
    }
  }, [currentUser]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="profile-settings-wrapper">
      <div className="profile-settings-box">
        <div className="profile-header">
          <h2>Profile Settings</h2>
          <p>Update your personal information and fitness stats</p>
          {currentUser && (
            <div className="user-info-summary">
              <div className="user-role">
                <span className="role-badge">{currentUser.role}</span>
              </div>
              <div className="account-info">
                <small>Member since: {new Date(currentUser.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          )}
        </div>

        {serverError && (
          <div className="server-error">
            <span>{serverError}</span>
          </div>
        )}

        <form
          className="profile-form"
          noValidate
          autoComplete="off"
          onSubmit={profileFormik.handleSubmit}
        >
          {/* Profile Image Section */}
          <div className="profile-image-section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'none', boxShadow: 'none', border: 'none', padding: 0, paddingBottom: '2rem' }}>
            <h3 style={{ alignSelf: 'flex-start' }}><FaCamera className="me-2" />Profile Picture</h3>
            <img
              src={previewUrl || "/default-avatar-profile.jpg"}
              alt="Profile preview"
              style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', border: '1px solid #ccc', marginBottom: 0 }}
              onError={(e) => {
                e.target.src = "/default-avatar-profile.jpg";
              }}
            />
            {/* Only show remove button if not already default avatar */}
            {previewUrl !== "/default-avatar-profile.jpg" && (
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setPreviewUrl("/default-avatar-profile.jpg");
                  setOriginalImageUrl("/default-avatar-profile.jpg");
                  setRemoveImage(true);
                  profileFormik.setFieldValue("image", "");
                }}
                style={{ marginTop: 8, marginBottom: 24 }}
                className="image-remove-original-btn"
                aria-label="Remove original image"
                title="Remove profile picture"
              >
                Remove Profile Picture
              </button>
            )}
            {/* Always show upload option if default avatar is displayed */}
            {previewUrl === "/default-avatar-profile.jpg" && (
              <div style={{ width: '100%', marginTop: 8 }}>
                <ImageUploader
                  onFileSelected={handleImageSelect}
                  previewUrl={null}
                />
              </div>
            )}
          </div>

          {/* Personal Information Section */}
          <div className="form-section">
            <h3><FaUser className="me-2" />Personal Information</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("firstName")}
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    className={`underline-input ${
                      profileFormik.touched.firstName && profileFormik.errors.firstName ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.firstName && profileFormik.errors.firstName && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.firstName}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("lastName")}
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    className={`underline-input ${
                      profileFormik.touched.lastName && profileFormik.errors.lastName ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.lastName && profileFormik.errors.lastName && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.lastName}
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("email")}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`underline-input ${
                      profileFormik.touched.email && profileFormik.errors.email ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.email && profileFormik.errors.email && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.email}
                  </div>
                )}
              </div>

              <div className="col-md-6">
                <div className="input-icon-wrapper">
                  <FaBirthdayCake className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("age")}
                    type="number"
                    name="age"
                    placeholder="Age"
                    className={`underline-input ${
                      profileFormik.touched.age && profileFormik.errors.age ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.age && profileFormik.errors.age && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.age}
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="input-icon-wrapper">
                  <FaVenusMars className="input-icon" />
                  <select
                    {...profileFormik.getFieldProps("gender")}
                    name="gender"
                    className={`form-select ${
                      profileFormik.touched.gender && profileFormik.errors.gender ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {profileFormik.touched.gender && profileFormik.errors.gender && (
                    <div className="invalid-feedback mt-1 d-block">
                      {profileFormik.errors.gender}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Fitness Stats Section */}
          <div className="form-section">
            <h3><FaWeight className="me-2" />Fitness Statistics</h3>
            <div className="row">
              <div className="col-md-4">
                <div className="input-icon-wrapper">
                  <FaRulerVertical className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("height")}
                    type="number"
                    name="height"
                    placeholder="Height (cm)"
                    className={`underline-input ${
                      profileFormik.touched.height && profileFormik.errors.height ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.height && profileFormik.errors.height && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.height}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <div className="input-icon-wrapper">
                  <FaWeight className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("weight")}
                    type="number"
                    name="weight"
                    placeholder="Weight (kg)"
                    className={`underline-input ${
                      profileFormik.touched.weight && profileFormik.errors.weight ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.weight && profileFormik.errors.weight && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.weight}
                  </div>
                )}
              </div>

              <div className="col-md-4">
                <div className="input-icon-wrapper">
                  <FaPercentage className="input-icon" />
                  <Input
                    {...profileFormik.getFieldProps("bodyFat")}
                    type="number"
                    name="bodyFat"
                    placeholder="Body Fat (%)"
                    className={`underline-input ${
                      profileFormik.touched.bodyFat && profileFormik.errors.bodyFat ? "is-invalid" : ""
                    }`}
                  />
                </div>
                {profileFormik.touched.bodyFat && profileFormik.errors.bodyFat && (
                  <div className="invalid-feedback mt-1 d-block">
                    {profileFormik.errors.bodyFat}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="submit-section">
            <div className="d-flex gap-3 justify-content-center">
              <button 
                type="button" 
                className="reset-btn"
                onClick={() => {
                  if (currentUser) {
                    profileFormik.setValues({
                      firstName: currentUser.firstName || "",
                      lastName: currentUser.lastName || "",
                      email: currentUser.email || "",
                      age: currentUser.age || "",
                      gender: currentUser.gender || "",
                      height: currentUser.stats?.height || "",
                      weight: currentUser.stats?.weight || "",
                      bodyFat: currentUser.stats?.bodyFat || "",
                      image: "",
                    });
                    setImageFile(null);
                    setPreviewUrl(originalImageUrl);
                    setRemoveImage(false);
                    toast.info("Form reset to original values");
                  }
                }}
                disabled={isLoading}
              >
                <FaUndo className="me-2" />
                Reset
              </button>
              <button 
                type="submit" 
                className="submit-btn"
                disabled={isLoading}
              >
                <FaSave className="me-2" />
                {isLoading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>

        </form>

        {/* Change Password Section */}
        <div className="form-section" style={{ marginTop: '2.5rem', borderTop: '1px solid #dee2e6', paddingTop: '2.5rem' }}>
          <h3 style={{ color: '#ffe600' }}>Change Password</h3>
          <form onSubmit={handleChangePw} autoComplete="off" style={{ maxWidth: 400, margin: '0 auto' }}>
            <div className="mb-3">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                id="currentPassword"
                value={pwForm.currentPassword}
                onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                autoComplete="current-password"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                value={pwForm.newPassword}
                onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                autoComplete="new-password"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                value={pwForm.confirmPassword}
                onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                autoComplete="new-password"
                required
              />
            </div>
            {changePwError && <div className="text-danger mb-2">{changePwError}</div>}
            {changePwSuccess && <div className="text-success mb-2">{changePwSuccess}</div>}
            <button type="submit" className="btn btn-warning w-100" disabled={changePwLoading}>
              {changePwLoading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>

        {/* Delete Account Request Section - Only for Trainers */}
        {user?.role === "trainer" && (
          <div className="form-section" style={{ marginTop: '2rem', borderTop: '1px solid #dee2e6', paddingTop: '2rem' }}>
            <h3 style={{ color: '#dc3545' }}><FaTrash className="me-2" />Delete Account Request</h3>
            <p style={{ color: '#6c757d', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Request to delete your trainer account. This action will be reviewed by an administrator.
            </p>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => setShowDeleteConfirmModal(true)}
              disabled={deleteRequestLoading}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              <FaTrash className="me-2" />
              {deleteRequestLoading ? "Sending Request..." : "Request Account Deletion"}
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          show={showDeleteConfirmModal}
          title="Request Account Deletion"
          message="Are you sure you want to request account deletion? This action will be reviewed by an administrator and cannot be undone."
          onConfirm={async () => {
            setShowDeleteConfirmModal(false);
            setDeleteRequestLoading(true);
            try {
              await sendTrainerDeleteRequest();
              toast.success("Delete request sent successfully. An administrator will review your request.");
            } catch (err) {
              if (err.response?.status === 400 && err.response?.data === "Delete request already sent.") {
                toast.warning("A delete request has already been sent and is pending review.");
              } else {
                toast.error(err.response?.data || "Failed to send delete request. Please try again.");
              }
            } finally {
              setDeleteRequestLoading(false);
            }
          }}
          onCancel={() => setShowDeleteConfirmModal(false)}
          icon="fas fa-exclamation-triangle"
        />
      </div>
    </div>
  );
}

export default UserProfileSettings; 