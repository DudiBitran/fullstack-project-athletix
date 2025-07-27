import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../../style/imageUploader.css";

const ImageUploader = ({ 
  onFileSelected, 
  onImageSelect, 
  previewUrl, 
  id, 
  onRemoveImage 
}) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        // Handle both prop names for compatibility
        if (onImageSelect) {
          onImageSelect(acceptedFiles[0]);
        } else if (onFileSelected) {
          onFileSelected(acceptedFiles[0]);
        }
      }
    },
    [onImageSelect, onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/gif": [] },
    multiple: false,
  });

  // Check if the current image is the default avatar
  const isDefaultImage = previewUrl && (
    previewUrl.includes('/default-avatar-profile.jpg') || 
    previewUrl.includes('default-avatar-profile.jpg')
  );

  return (
    <div {...getRootProps()} className="upload-box">
      <input {...getInputProps({ id })} />
      {previewUrl ? (
        <div className="image-container">
          <img src={previewUrl} alt="preview" />
          {onRemoveImage && !isDefaultImage && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemoveImage();
              }}
              className="remove-image-btn"
              aria-label="Remove image"
            >
              Remove Image
            </button>
          )}
        </div>
      ) : (
        <p>Drag & drop or click to upload an image</p>
      )}
    </div>
  );
};

export default ImageUploader;
