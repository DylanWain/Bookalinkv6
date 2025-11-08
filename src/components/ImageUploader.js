
import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const ImageUploader = ({
  onUploadComplete,
  buttonText = "Upload Image",
  currentImage = null,
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase
    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file
      const { data, error } = await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      // Call callback with URL
      onUploadComplete(publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image: " + error.message);
      setPreview(currentImage); // Reset preview on error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {preview && (
        <div
          style={{
            marginBottom: "12px",
            border: "3px solid #000000",
            borderRadius: "12px",
            overflow: "hidden",
            maxWidth: "200px",
          }}
        >
          <img
            src={preview}
            alt="Preview"
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      <label
        style={{
          display: "inline-block",
          padding: "12px 20px",
          background: uploading ? "#CCCCCC" : "#FFFFFF",
          border: "2px solid #000000",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          cursor: uploading ? "not-allowed" : "pointer",
          boxShadow: "2px 2px 0px #000000",
        }}
      >
        {uploading ? "Uploading..." : buttonText}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </label>
    </div>
  );
};

export default ImageUploader;
