"use client";

import { useRouter } from "next/navigation";
import {
  Music2, Upload, Sparkles, Share2, ArrowRight, ImageIcon,
  MessageSquare, Zap, Clock, Play, Heart, Shuffle, GitBranch,
  Database, Cpu, Layers, RefreshCw, Network,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#080808", overflowX: "hidden", color: "#fff", fontFamily: "system-ui, sans-serif" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "64px", padding: "0 2rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,8,0.90)", backdropFilter: "blur(16px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1db954", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: "#fff" }}>Symphony</span>
        </div>
        <button
          onClick={() => router.push("/app")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 20px", borderRadius: 8,
            background: "#1db954", color: "#000",
            border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 700,
          }}
        >
          Open App <ArrowRight size={14} />
        </button>
      </nav>

      <main>
        {/* ── Hero ── */}
        <section style={{
          minHeight: "100vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "120px 24px 80px",
          textAlign: "center", position: "relative",
        }}>
          {/* Radial glow */}
          <div style={{
            position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
            width: 600, height: 400,
            background: "radial-gradient(ellipse, rgba(29,185,84,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "4px 14px", borderRadius: 20,
            border: "1px solid rgba(29,185,84,0.30)",
            background: "rgba(29,185,84,0.06)",
            marginBottom: 32,
          }}>
            <Sparkles size={12} color="#1db954" />
            <span style={{ fontSize: 12, color: "#1db954", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
              LangGraph · Gemini · Groq · Spotify API
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: "clamp(48px, 8vw, 88px)",
            fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0,
            color: "#fff", marginBottom: 24, maxWidth: 820,
          }}>
            Any input. Perfect playlists.<br />
            <span style={{ color: "#1db954" }}>Generated in seconds.</span>
          </h1>

          {/* Subtext */}
          <p style={{ fontSize: "clamp(16px,2vw,20px)", color: "rgba(255,255,255,0.50)", maxWidth: 540, lineHeight: 1.6, marginBottom: 12 }}>
            Upload a screenshot, describe your vibe, or remix an existing Spotify playlist. A 6-stage multi-agent pipeline does the rest.
          </p>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.28)", marginBottom: 40 }}>
            No account needed to generate · Login only to save permanently
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 64 }}>
            <button
              onClick={() => router.push("/app")}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 10,
                background: "#1db954", color: "#000",
                border: "none", cursor: "pointer",
                fontSize: 16, fontWeight: 700,
              }}
            >
              Try it free <ArrowRight size={16} />
            </button>
            <a
              href="#how-it-works"
              style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.55)",
                textDecoration: "none", fontSize: 16, fontWeight: 600,
              }}
            >
              See how it works
            </a>
          </div>

          {/* Mock player */}
          <div style={{
            width: "100%", maxWidth: 640,
            borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
            background: "#111", overflow: "hidden",
            boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
          }}>
            {/* Browser bar */}
            <div style={{
              padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex", alignItems: "center", gap: 8,
              background: "#0d0d0d",
            }}>
              {["#ff5f57", "#ffbd2e", "#28c840"].map((c) => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
              ))}
              <div style={{
                flex: 1, marginLeft: 8, padding: "4px 12px",
                background: "#080808", borderRadius: 6,
                fontSize: 12, color: "rgba(255,255,255,0.25)",
              }}>
                symphony.app
              </div>
            </div>

            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Track row */}
              <div style={{
                padding: 16, borderRadius: 12,
                background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", gap: 16,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: 8, background: "rgba(29,185,84,0.28)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ height: 14, borderRadius: 4, background: "rgba(255,255,255,0.12)", width: "60%", marginBottom: 8 }} />
                  <div style={{ height: 10, borderRadius: 4, background: "rgba(255,255,255,0.07)", width: "40%" }} />
                </div>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#1db954", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Play size={16} color="#000" fill="#000" />
                </div>
              </div>

              {/* 24h warning */}
              {/* <div style={{
                padding: "10px 14px", borderRadius: 8,
                background: "rgba(255,185,0,0.06)", border: "1px solid rgba(255,185,0,0.20)",
                fontSize: 12, color: "#c9a227", textAlign: "center",
              }}>
                 This playlist will be automatically deleted in 24 hours
              </div> */}

              {/* Save CTA */}
              <div style={{
                padding: 12, borderRadius: 10, background: "#1db954",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <Heart size={16} color="#000" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>Save to My Spotify Account</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1db954", textTransform: "uppercase", marginBottom: 16 }}>
              How it works
            </p>
            <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 64 }}>
              Zero friction. Full control.
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
              {[
                { icon: <Upload size={24} />, step: "01", title: "Upload, describe, or remix", desc: "Drop a tracklist screenshot, type a mood in plain English, or paste a Spotify playlist link to remix it with AI.", tag: null },
                { icon: <Sparkles size={24} />, step: "02", title: "Pipeline orchestrates", desc: "LangGraph routes your input through a 6-stage multi-agent pipeline — intent parsing, Last.fm expansion, Groq inference, and Gemini curation.", tag: null },
                { icon: <Play size={24} />, step: "03", title: "Listen instantly", desc: "Your playlist is live on Symphony's Spotify account. Stream it right away via the embedded player. No account required.", tag: "Free preview" },
                { icon: <Heart size={24} />, step: "04", title: "Save to your account", desc: "Love the mix? One click clones it directly into your own Spotify library — yours forever, even after the 24-hour preview expires.", tag: "Optional" },
              ].map(({ icon, step, title, desc, tag }) => (
                <article key={step} style={{
                  padding: 28, borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#0f0f0f",
                  display: "flex", flexDirection: "column", gap: 16,
                  position: "relative",
                }}>
                  {tag && (
                    <div style={{
                      position: "absolute", top: 16, right: 16,
                      padding: "2px 10px", borderRadius: 20,
                      background: "rgba(29,185,84,0.10)", border: "1px solid rgba(29,185,84,0.20)",
                      fontSize: 11, color: "#1db954",
                    }}>
                      {tag}
                    </div>
                  )}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.20)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#1db954",
                    }}>
                      {icon}
                    </div>
                    <span style={{ fontSize: 32, fontWeight: 800, color: "rgba(255,255,255,0.10)" }}>{step}</span>
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Three Input Vectors ── */}
        <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1db954", textTransform: "uppercase", marginBottom: 16 }}>
              Three ways to orchestrate
            </p>
            <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 64 }}>
              Your input. Any format.
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>

              {/* Screenshot */}
              <article style={{
                padding: 36, borderRadius: 20,
                border: "1px solid rgba(29,185,84,0.20)",
                background: "linear-gradient(135deg, rgba(29,185,84,0.06) 0%, transparent 100%)",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(29,185,84,0.10)", border: "1px solid rgba(29,185,84,0.20)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#1db954",
                }}>
                  <ImageIcon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Screenshot</h3>
                  <p style={{ fontSize: 11, color: "rgba(29,185,84,0.70)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                    Gemini 2.5 Flash Vision
                  </p>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
                  Drop a screenshot of any tracklist — Spotify, Apple Music, YouTube. Gemini Vision extracts every track and maps them to Spotify URIs with high accuracy.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Works with any music app", "OCR + semantic track resolution", "No manual entry needed"].map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1db954", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.40)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* Prompt */}
              <article style={{
                padding: 36, borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.07)",
                background: "#0f0f0f",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)",
                }}>
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Prompt</h3>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                    LangGraph · Groq · Last.fm
                  </p>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
                  Describe your vibe in plain English. Groq routes intent at ultra-low latency, Last.fm expands the music graph, and Gemini handles final curation.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["6-stage multi-agent pipeline", "Last.fm graph expansion", "Sub-20s generation time"].map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.20)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.40)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>

              {/* Remix */}
              <article style={{
                padding: 36, borderRadius: 20,
                border: "1px solid rgba(168,85,247,0.20)",
                background: "linear-gradient(135deg, rgba(168,85,247,0.06) 0%, transparent 100%)",
                display: "flex", flexDirection: "column", gap: 16,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.20)",
                  display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7",
                }}>
                  <Shuffle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Remix</h3>
                  <p style={{ fontSize: 11, color: "rgba(168,85,247,0.70)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>
                    Multi-agent filtering pipeline
                  </p>
                </div>
                <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: 0 }}>
                  Paste a Spotify playlist link + a prompt like "remove acoustic tracks" or "higher BPM only." A multi-agent pipeline fetches, filters, and rebuilds the mix.
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                  {["Spotify track attribute filtering", "Audio-feature-aware reordering", "One-click save to your account"].map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(168,85,247,0.50)", flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.40)" }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </article>

            </div>
          </div>
        </section>

        {/* ── Architecture ── */}
        <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1db954", textTransform: "uppercase", marginBottom: 16 }}>
              Under the hood
            </p>
            <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 12 }}>
              Serious engineering, seamless UX.
            </h2>
            <p style={{ textAlign: "center", color: "rgba(255,255,255,0.40)", fontSize: 16, maxWidth: 540, margin: "0 auto 64px", lineHeight: 1.6 }}>
              Symphony's backend is a production-grade distributed system — not a weekend prototype.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 40 }}>
              {[
                { icon: <GitBranch size={20} />, name: "LangGraph Pipeline", detail: "6-stage stateful multi-agent graph. Each stage is an isolated node with typed state transitions and conditional edge routing.", color: "#1db954", borderColor: "rgba(29,185,84,0.15)", bgColor: "rgba(29,185,84,0.05)" },
                { icon: <Cpu size={20} />, name: "Gemini 2.5 Flash + Groq", detail: "Vision model for image parsing. Groq for sub-100ms intent classification and low-latency inference at the routing layer.", color: "#60a5fa", borderColor: "rgba(96,165,250,0.15)", bgColor: "rgba(96,165,250,0.05)" },
                { icon: <Network size={20} />, name: "Spotify & Last.fm APIs", detail: "Full OAuth 2.0 + PKCE flow with server-side token refresh. Last.fm graph used for semantic artist/track expansion.", color: "#1db954", borderColor: "rgba(29,185,84,0.15)", bgColor: "rgba(29,185,84,0.05)" },
                { icon: <Database size={20} />, name: "Supabase + Prisma ORM", detail: "PostgreSQL on Supabase. Prisma ORM for type-safe queries, schema migrations, and session/token persistence.", color: "#34d399", borderColor: "rgba(52,211,153,0.15)", bgColor: "rgba(52,211,153,0.05)" },
                { icon: <Layers size={20} />, name: "Node.js ESM on Render", detail: "Strict ES module deployment with zero-CJS fallback. Render for autoscaling, with env-based secret injection.", color: "#fb923c", borderColor: "rgba(251,146,60,0.15)", bgColor: "rgba(251,146,60,0.05)" },
                { icon: <RefreshCw size={20} />, name: "Auto-cleanup & TTL", detail: "Scheduled jobs purge ephemeral playlists from Spotify and Supabase after 24 hours. Privacy-first by design.", color: "#c084fc", borderColor: "rgba(192,132,252,0.15)", bgColor: "rgba(192,132,252,0.05)" },
              ].map(({ icon, name, detail, color, borderColor, bgColor }) => (
                <article key={name} style={{
                  padding: 24, borderRadius: 16,
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color }}>
                    {icon}
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>{name}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>{detail}</p>
                </article>
              ))}
            </div>

            {/* Stack pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {["LangGraph", "Gemini 2.5 Flash", "Groq", "Spotify OAuth/PKCE", "Last.fm API", "Supabase", "Prisma ORM", "Node.js ESM", "PostgreSQL", "Render"].map((t) => (
                <span key={t} style={{
                  padding: "4px 12px", borderRadius: 20,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: 12, color: "rgba(255,255,255,0.40)", fontWeight: 500,
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ── */}
        <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p style={{ textAlign: "center", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", color: "#1db954", textTransform: "uppercase", marginBottom: 16 }}>
              Features
            </p>
            <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 64 }}>
              Built different
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { icon: <Zap size={20} />, title: "Sub-20s generation", desc: "From raw input to a playable Spotify playlist in under 20 seconds." },
                { icon: <Play size={20} />, title: "Instant preview", desc: "Embedded Spotify player — listen right away, zero login required." },
                { icon: <Heart size={20} />, title: "One-click save", desc: "Clone the playlist into your own Spotify library with a single click." },
                { icon: <Clock size={20} />, title: "Auto-cleanup (24h)", desc: "Ephemeral previews delete automatically. Clean and privacy-first." },
                { icon: <Sparkles size={20} />, title: "AI curation", desc: "Not a simple search — a 6-stage stateful pipeline ensures quality." },
                { icon: <Share2 size={20} />, title: "Shareable links", desc: "Share any playlist link — recipients can save it to their account too." },
              ].map(({ icon, title, desc }) => (
                <article key={title} style={{
                  padding: 24, borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#0f0f0f",
                  display: "flex", flexDirection: "column", gap: 12,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#1db954",
                  }}>
                    {icon}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section style={{ padding: "96px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            maxWidth: 700, margin: "0 auto", textAlign: "center",
            padding: "64px 40px", borderRadius: 24,
            border: "1px solid rgba(29,185,84,0.20)",
            background: "linear-gradient(135deg, rgba(29,185,84,0.06) 0%, transparent 100%)",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
              width: 400, height: 400,
              background: "radial-gradient(circle, rgba(29,185,84,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <h2 style={{ fontSize: "clamp(28px,4vw,48px)", fontWeight: 800, letterSpacing: "-0.03em", color: "#fff", marginBottom: 16, position: "relative" }}>
              Your next playlist is<br />
              <span style={{ color: "#1db954" }}>one input away.</span>
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.45)", marginBottom: 32, lineHeight: 1.6, position: "relative" }}>
              No account needed. No setup. Screenshot, prompt, or remix — pick your weapon.
            </p>
            <button
              onClick={() => router.push("/app")}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "16px 40px", borderRadius: 10,
                background: "#1db954", color: "#000",
                border: "none", cursor: "pointer",
                fontSize: 16, fontWeight: 700, position: "relative",
              }}
            >
              Try Symphony free <ArrowRight size={16} />
            </button>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        padding: "32px 24px", borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: "#1db954", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={14} color="#000" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Symphony</span>
        </div>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>
          Built with LangGraph · Gemini · Groq · Spotify API · Supabase
        </p>
      </footer>
    </div>
  );
}