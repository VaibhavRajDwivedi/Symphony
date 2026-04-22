"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ImageIcon } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useGeneratePlaylist } from "../hooks/useGeneratePlaylist";

export default function DropZone() {
  const { status, previewImage } = useAppStore();
  const { generate } = useGeneratePlaylist();

  const isProcessing = ["uploading", "extracting", "searching"].includes(status);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      generate(file);
    },
    [generate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      style={{
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto",
        borderRadius: "16px",
        border: `2px dashed ${
          isDragActive
            ? "var(--green)"
            : isProcessing
            ? "var(--border)"
            : "var(--border-hover)"
        }`,
        background: isDragActive
          ? "var(--green-glow)"
          : "rgba(255,255,255,0.01)",
        padding: previewImage ? "0" : "60px 40px",
        cursor: isProcessing ? "not-allowed" : "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
        boxShadow: isDragActive ? "0 0 30px var(--green-glow-strong)" : "none",
      }}
    >
      <input {...getInputProps()} />

      {previewImage ? (
        /* Image Preview */
        <div style={{ position: "relative" }}>
          <img
            src={previewImage}
            alt="Uploaded screenshot"
            style={{
              width: "100%",
              height: "320px",
              objectFit: "cover",
              borderRadius: "14px",
              opacity: isProcessing ? 0.4 : 1,
              transition: "opacity 0.3s ease",
            }}
          />
          {/* Overlay when processing */}
          {isProcessing && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "14px",
                background: "rgba(8,8,8,0.6)",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  border: "2px solid var(--border)",
                  borderTopColor: "var(--green)",
                }}
                className="animate-spin-slow"
              />
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
            textAlign: "center",
          }}
        >
          {/* Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: isDragActive
                ? "var(--green-glow-strong)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${
                isDragActive ? "var(--green)" : "var(--border)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
            }}
          >
            {isDragActive ? (
              <ImageIcon size={28} color="var(--green)" />
            ) : (
              <Upload size={28} color="var(--text-muted)" />
            )}
          </div>

          {/* Text */}
          <div>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "18px",
                fontWeight: 600,
                color: isDragActive
                  ? "var(--green)"
                  : "var(--text-primary)",
                marginBottom: "6px",
                transition: "color 0.3s ease",
              }}
            >
              {isDragActive
                ? "Drop it here"
                : "Drop your screenshot here"}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
              }}
            >
              Upload a Spotify queue, Apple Music, or any tracklist screenshot
            </p>
          </div>

          {/* Supported formats */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            {["JPG", "PNG", "WEBP"].map((fmt) => (
              <span
                key={fmt}
                style={{
                  padding: "3px 10px",
                  borderRadius: "20px",
                  border: "1px solid var(--border)",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  letterSpacing: "0.05em",
                  fontFamily: "var(--font-body)",
                }}
              >
                {fmt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}