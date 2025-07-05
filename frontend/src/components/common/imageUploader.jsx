import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import "../../style/imageUploader.css";
const ImageUploader = ({ onFileSelected, previewUrl, id }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelected(acceptedFiles[0]);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/png": [], "image/jpeg": [], "image/gif": [] },
    multiple: false,
  });

  return (
    <div {...getRootProps()} className="upload-box">
      <input {...getInputProps({ id })} />
      {previewUrl ? (
        <img src={previewUrl} alt="preview" />
      ) : (
        <p>Drag & drop or click to upload an image</p>
      )}
    </div>
  );
};

export default ImageUploader;
