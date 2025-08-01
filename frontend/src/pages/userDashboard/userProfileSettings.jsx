import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth.context";
import { useFormik } from "formik";
import Joi from "joi";
import { toast } from "react-toastify";
import { Navigate } from "react-router";
import Input from "../../components/common/input";
import ImageUploader from "../../components/common/imageUploader";
import { FaUser, FaEnvelope, FaBirthdayCake, FaVenusMars, FaRulerVertical, FaWeight, FaPercentage, FaCamera, FaSave, FaUndo, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import "../../style/userDashboard/userProfileSettings.css";
import ConfirmationModal from "../../components/common/confirmationModal";
import axios from "axios";
import { getUserImageUrl } from "../../utils/imageUtils";

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
    const passwordRegex = /^(?=(?:.*\d){4,})(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
      setChangePwError("All fields are required.");
      return;
    }
    if (!passwordRegex.test(pwForm.newPassword)) {
      setChangePwError("Password must be at least 8 characters, contain at least 4 digits, one uppercase letter, one lowercase letter, and one special character.");
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
      return false;
    } catch (err) {
      console.error("Error checking email:", err);
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      const userImageUrl = getUserImageUrl(user.image);
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

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl("/default-avatar-profile.jpg");
    setRemoveImage(true);
    profileFormik.setFieldValue("image", "");
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
          throw updateErr; 
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
              const newImageUrl = getUserImageUrl(imageResponse.data.user.image);
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
              // Force set to default image since backend returns null
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

  // Add loading state to ensure data is present before rendering form
  if (!user || !currentUser) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div className="profile-settings-wrapper">
        <div className="profile-settings-box">
          {/* Profile Header */}
          <div className="profile-header">
            <h2>Profile Settings</h2>
            <p>Manage your account information and preferences</p>
          </div>

          {/* User Info Summary */}
          <div className="user-info-summary">
            <div className="user-role">
              <span className="role-badge">{user?.role}</span>
            </div>
            <div className="account-info">
              Account created: {new Date(user?.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Profile Image Section */}
          <div className="profile-image-section">
            <h3>Profile Picture</h3>
            <div className="image-upload-container">
              <ImageUploader
                onImageSelect={handleImageSelect}
                previewUrl={previewUrl}
                originalImageUrl={originalImageUrl}
                onRemoveImage={handleRemoveImage}
                onRemoveOriginalImage={() => setOriginalImageUrl(null)}
                removeImage={removeImage}
                setRemoveImage={setRemoveImage}
              />
            </div>
          </div>

          {/* Personal Information Form */}
          <form onSubmit={profileFormik.handleSubmit} autoComplete="off">
            <div className="form-section">
              <h3>Personal Information</h3>
              
              <div className="input-icon-wrapper">
                <FaUser className="input-icon" />
                <Input
                  type="text"
                  placeholder={profileFormik.values.firstName || "First Name"}
                  className="underline-input"
                  {...profileFormik.getFieldProps('firstName')}
                />
              </div>

              <div className="input-icon-wrapper">
                <FaUser className="input-icon" />
                <Input
                  type="text"
                  placeholder={profileFormik.values.lastName || "Last Name"}
                  className="underline-input"
                  {...profileFormik.getFieldProps('lastName')}
                />
              </div>

              <div className="input-icon-wrapper">
                <FaEnvelope className="input-icon" />
                <Input
                  type="email"
                  placeholder={profileFormik.values.email || "Email Address"}
                  className="underline-input"
                  {...profileFormik.getFieldProps('email')}
                />
              </div>

              <div className="input-icon-wrapper">
                <FaBirthdayCake className="input-icon" />
                <Input
                  type="number"
                  placeholder={profileFormik.values.age || "Age"}
                  className="underline-input"
                  {...profileFormik.getFieldProps('age')}
                />
              </div>

              <div className="input-icon-wrapper">
                <FaVenusMars className="input-icon" />
                <select
                  name="gender"
                  className={`form-select ${profileFormik.touched.gender && profileFormik.errors.gender ? 'is-invalid' : ''}`}
                  value={profileFormik.values.gender}
                  onChange={profileFormik.handleChange}
                  onBlur={profileFormik.handleBlur}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {profileFormik.touched.gender && profileFormik.errors.gender && (
                  <div className="invalid-feedback">{profileFormik.errors.gender}</div>
                )}
              </div>
            </div>

            {/* Physical Information Section */}
            <div className="form-section">
              <h3>Physical Information</h3>
              
              <div className="input-icon-wrapper">
                <FaRulerVertical className="input-icon" />
                <Input
                  type="number"
                  placeholder="Height (cm)"
                  className="underline-input"
                  {...profileFormik.getFieldProps('height')}
                />
              </div>

              <div className="input-icon-wrapper">
                <FaWeight className="input-icon" />
                <Input
                  type="number"
                  placeholder="Weight (kg)"
                  className="underline-input"
                  {...profileFormik.getFieldProps('weight')}
                />
              </div>

              <div className="input-icon-wrapper">
                <FaPercentage className="input-icon" />
                <Input
                  type="number"
                  placeholder="Body Fat (%)"
                  className="underline-input"
                  {...profileFormik.getFieldProps('bodyFat')}
                />
              </div>
            </div>

            {/* Server Error Display */}
            {serverError && (
              <div className="server-error">
                <FaExclamationTriangle className="me-2" />
                {serverError}
              </div>
            )}

            {/* Submit Section */}
            <div className="submit-section">
              <div className="d-flex justify-content-center gap-3">
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isLoading || !profileFormik.isValid || !profileFormik.dirty}
                >
                  <FaSave className="me-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className="reset-btn"
                  onClick={() => {
                    profileFormik.resetForm();
                    setImageFile(null);
                    setPreviewUrl(originalImageUrl);
                    setRemoveImage(false);
                    setServerError("");
                  }}
                  disabled={isLoading}
                >
                  <FaUndo className="me-2" />
                  Reset
                </button>
              </div>
            </div>
          </form>

          {/* Change Password Section */}
          <div className="change-password-card">
            <h3 className="change-password-title">Change Password</h3>
            <form onSubmit={handleChangePw} autoComplete="off">
              <div className="change-password-fields">
                <div className="change-password-input-group">
                  <label htmlFor="currentPassword" className="change-password-label">Current Password</label>
                  <input
                    type="password"
                    className="change-password-input"
                    id="currentPassword"
                    value={pwForm.currentPassword}
                    onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="change-password-input-group">
                  <label htmlFor="newPassword" className="change-password-label">New Password</label>
                  <input
                    type="password"
                    className="change-password-input"
                    id="newPassword"
                    value={pwForm.newPassword}
                    onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                    autoComplete="new-password"
                    required
                  />
                  <div className="change-password-hint">
                    Password must be at least 8 characters, contain at least 4 digits, one uppercase letter, one lowercase letter, and one special character.
                  </div>
                </div>
                <div className="change-password-input-group">
                  <label htmlFor="confirmPassword" className="change-password-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="change-password-input"
                    id="confirmPassword"
                    value={pwForm.confirmPassword}
                    onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>
              {changePwError && <div className="change-password-error">{changePwError}</div>}
              {changePwSuccess && <div className="change-password-success">{changePwSuccess}</div>}
              <button type="submit" className="change-password-btn" disabled={changePwLoading}>
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
        </div>
      </div>

      {/* Delete Confirmation Modal - Moved outside the wrapper */}
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
    </>
  );
}

export default UserProfileSettings; 