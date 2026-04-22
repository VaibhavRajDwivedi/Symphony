"use client";

import { Music2 } from "lucide-react";

export default function Navbar() {
  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        padding: "0 2rem 0 4.5rem",
        height: "64px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        background: "rgba(8, 8, 8, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "default",
        }}
      >
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "var(--green)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Music2 size={18} color="#000" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "20px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
          }}
        >
          Symphony
        </span>
      </div>

      {/* Right side tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          borderRadius: "20px",
          border: "1px solid var(--border)",
          background: "rgba(29, 185, 84, 0.05)",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--green)",
            boxShadow: "0 0 6px var(--green)",
          }}
        />
        <span
          style={{
            fontSize: "12px",
            color: "var(--text-secondary)",
            fontFamily: "var(--font-body)",
            letterSpacing: "0.02em",
          }}
        >
          AI Powered
        </span>
      </div>
    </nav>
  );
}