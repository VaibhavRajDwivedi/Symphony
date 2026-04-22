"use client";

export default function VibeCheck({ text }: { text: string }) {
  if (!text) return null;
  
  return (
    <div style={{ 
      padding: "20px", 
      borderRadius: "14px", 
      background: "rgba(168, 85, 247, 0.05)", 
      border: "1px solid rgba(168, 85, 247, 0.2)" 
    }}>
      <div style={{ 
        fontSize: "11px", 
        fontWeight: 700, 
        textTransform: "uppercase", 
        letterSpacing: "0.05em", 
        color: "#c084fc", 
        marginBottom: "8px" 
      }}>
        ✨ Vibe Check Analysis
      </div>
      <p style={{ 
        fontSize: "14px", 
        fontStyle: "italic", 
        color: "var(--text-primary)", 
        lineHeight: 1.6, 
        margin: 0 
      }}>
        "{text}"
      </p>
    </div>
  );
}