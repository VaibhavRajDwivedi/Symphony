"use client";

export default function LiveStatus({ status, message }: { status: string, message: string | null }) {
  if (status === "idle") return null;

  return (
    <div style={{ 
      padding: "16px", 
      borderRadius: "14px", 
      background: "var(--bg-card)", 
      border: "1px solid var(--border-hover)", 
      display: "flex", 
      alignItems: "center", 
      gap: "12px", 
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)" 
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <span style={{ 
          fontSize: "14px", 
          fontWeight: 600, 
          color: status === "error" ? "#ff6464" : "var(--text-primary)" 
        }}>
          {status === "error" ? "Something went wrong" : "Working on it..."}
        </span>
        <span style={{ 
          fontSize: "13px", 
          color: "var(--text-secondary)" 
        }}>
          {message || "Connecting to server..."}
        </span>
      </div>
    </div>
  );
}