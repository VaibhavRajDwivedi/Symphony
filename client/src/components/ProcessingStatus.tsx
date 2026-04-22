"use client";

import { Sparkles, Search, ListMusic, CheckCircle2 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import type { AppStatus } from "../types";

interface Step {
  id: AppStatus;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

const steps: Step[] = [
  {
    id: "extracting",
    label: "Reading image",
    sublabel: "Gemini AI is extracting tracks",
    icon: <Sparkles size={16} />,
  },
  {
    id: "searching",
    label: "Searching Spotify",
    sublabel: "Finding official studio recordings",
    icon: <Search size={16} />,
  },
  {
    id: "success",
    label: "Playlist ready",
    sublabel: "Your playlist has been created",
    icon: <ListMusic size={16} />,
  },
];

const statusOrder: AppStatus[] = ["extracting", "searching", "success"];

export default function ProcessingStatus() {
  const { status } = useAppStore();

  const isVisible = ["extracting", "searching", "success"].includes(status);

  if (!isVisible) return null;

  const currentIndex = status === "success" 
    ? steps.length
    : statusOrder.indexOf(status);

  return (
    <div
      className="animate-fade-up"
      style={{
        width: "100%",
        maxWidth: "560px",
        margin: "0 auto",
        padding: "24px",
        borderRadius: "16px",
        border: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
        }}
      >
        {steps.map((step, index) => {
          const isDone = index < currentIndex;
          const isActive = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "16px",
                padding: "14px 0",
                borderBottom:
                  index < steps.length - 1
                    ? "1px solid var(--border)"
                    : "none",
                opacity: isPending ? 0.3 : 1,
                transition: "opacity 0.4s ease",
              }}
            >
              {/* Icon / Status indicator */}
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: isDone
                    ? "rgba(29, 185, 84, 0.15)"
                    : isActive
                    ? "rgba(29, 185, 84, 0.08)"
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${
                    isDone
                      ? "var(--green)"
                      : isActive
                      ? "rgba(29,185,84,0.4)"
                      : "var(--border)"
                  }`,
                  color: isDone
                    ? "var(--green)"
                    : isActive
                    ? "var(--green)"
                    : "var(--text-muted)",
                  transition: "all 0.4s ease",
                }}
              >
                {isDone ? (
                  <CheckCircle2 size={16} color="var(--green)" />
                ) : isActive ? (
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "1.5px solid var(--border)",
                      borderTopColor: "var(--green)",
                    }}
                    className="animate-spin-slow"
                  />
                ) : (
                  step.icon
                )}
              </div>

              {/* Text */}
              <div style={{ flex: 1, paddingTop: "2px" }}>
                <p
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isActive
                      ? "var(--text-primary)"
                      : isDone
                      ? "var(--green)"
                      : "var(--text-secondary)",
                    marginBottom: "2px",
                    transition: "color 0.4s ease",
                  }}
                >
                  {step.label}
                </p>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    opacity: isActive || isDone ? 1 : 0.5,
                  }}
                >
                  {step.sublabel}
                </p>
              </div>

              {/* Active pulse dot */}
              {isActive && (
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "var(--green)",
                    alignSelf: "center",
                    flexShrink: 0,
                    boxShadow: "0 0 8px var(--green)",
                    animation: "pulse-green 1.5s ease infinite",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}