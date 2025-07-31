/**
 * Utility function to get the correct image URL for a user
 * @param {string|null|undefined} userImage - The user's image path from the database
 * @param {string} baseUrl - The base URL for the backend (default: http://localhost:3000)
 * @returns {string} The correct image URL to display
 */
export const getUserImageUrl = (userImage, baseUrl = "http://localhost:3000") => {
  // If no image is provided, return default avatar
  if (!userImage) {
    return "/default-avatar-profile.jpg";
  }

  // If it's the old default trainer icon, return the new default avatar
  if (userImage === "/public/defaults/trainer-icon.jpg" || userImage === "public/defaults/trainer-icon.jpg") {
    return "/default-avatar-profile.jpg";
  }

  // If it's already a full URL (starts with http), return as is
  if (userImage.startsWith("http")) {
    return userImage;
  }

  // Otherwise, construct the full URL with the backend base URL
  return `${baseUrl}/${userImage.replace(/^\/+/, "")}`;
};

/**
 * Utility function to get the correct image URL for profile display
 * This is specifically for profile settings where we want to show the default
 * even when the backend returns null
 * @param {string|null|undefined} userImage - The user's image path from the database
 * @param {string} baseUrl - The base URL for the backend (default: http://localhost:3000)
 * @returns {string} The correct image URL to display
 */
export const getProfileImageUrl = (userImage, baseUrl = "http://localhost:3000") => {
  return getUserImageUrl(userImage, baseUrl);
}; 