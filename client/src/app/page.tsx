"use client";

import { useRouter } from "next/navigation";
import { Music2, Upload, Sparkles, Share2, ArrowRight, ImageIcon, MessageSquare, Zap, Clock, Play, Heart } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "0 2rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
        background: "rgba(8,8,8,0.85)", backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.03em" }}>
            Symphony
          </span>
        </div>
        <button
          onClick={() => router.push("/app")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 20px", borderRadius: "8px",
            background: "var(--green)", color: "#000",
            border: "none", cursor: "pointer",
            fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 700,
          }}
        >
          Open App <ArrowRight size={14} />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", textAlign: "center", position: "relative",
      }}>
        <div style={{
          position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "400px",
          background: "radial-gradient(ellipse, rgba(29,185,84,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div className="animate-fade-up" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "4px 14px", borderRadius: "20px",
          border: "1px solid rgba(29,185,84,0.3)",
          background: "rgba(29,185,84,0.05)", marginBottom: "32px",
        }}>
          <Sparkles size={12} color="var(--green)" />
          <span style={{ fontSize: "12px", color: "var(--green)", fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>
            Powered by Gemini 2.5 Flash + Spotify API
          </span>
        </div>

        <h1 className="animate-fade-up" style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(48px, 8vw, 88px)",
          fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0,
          color: "var(--text-primary)", marginBottom: "24px", maxWidth: "800px",
        }}>
          Screenshot to Spotify.<br />
          <span style={{ color: "var(--green)" }}>In seconds.</span>
        </h1>

        <p className="animate-fade-up" style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: "var(--text-secondary)",
          maxWidth: "520px", lineHeight: 1.6, marginBottom: "16px",
          fontFamily: "var(--font-body)",
        }}>
          Upload any tracklist screenshot or describe your vibe.
          Get an instant Spotify playlist — listen immediately, save permanently.
        </p>

        {/* Zero friction callout */}
        <p className="animate-fade-up" style={{
          fontSize: "14px", color: "var(--text-muted)",
          marginBottom: "40px", fontFamily: "var(--font-body)",
        }}>
          No account needed to generate. Login only if you want to save permanently.
        </p>

        <div className="animate-fade-up" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => router.push("/app")}
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 32px", borderRadius: "10px",
              background: "var(--green)", color: "#000",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Try it free <ArrowRight size={16} />
          </button>
          <a
            href="#how-it-works"
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "14px 32px", borderRadius: "10px",
              border: "1px solid var(--border)", color: "var(--text-secondary)",
              textDecoration: "none", cursor: "pointer",
              fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 600,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            See how it works
          </a>
        </div>

        {/* Mock player preview */}
        <div className="animate-fade-up" style={{
          marginTop: "64px", width: "100%", maxWidth: "640px",
          borderRadius: "16px", border: "1px solid var(--border)",
          background: "var(--bg-card)", overflow: "hidden",
          boxShadow: "0 40px 80px rgba(0,0,0,0.5)",
        }}>
          {/* Mock browser bar */}
          <div style={{
            padding: "12px 16px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: "8px",
            background: "var(--bg-secondary)",
          }}>
            {["#ff5f57","#ffbd2e","#28c840"].map((c) => (
              <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
            ))}
            <div style={{
              flex: 1, marginLeft: "8px", padding: "4px 12px",
              background: "var(--bg-primary)", borderRadius: "6px",
              fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-body)",
            }}>
              symphony.app
            </div>
          </div>

          {/* Mock Spotify embed */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{
              padding: "16px", borderRadius: "12px",
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              display: "flex", alignItems: "center", gap: "16px",
            }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: "var(--green)", opacity: 0.3, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: "14px", borderRadius: "4px", background: "var(--border-hover)", width: "60%", marginBottom: "8px" }} />
                <div style={{ height: "10px", borderRadius: "4px", background: "var(--border)", width: "40%" }} />
              </div>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Play size={16} color="#000" fill="#000" />
              </div>
            </div>

            {/* 24hr warning mock */}
            <div style={{
              padding: "10px 14px", borderRadius: "8px",
              background: "rgba(255,185,0,0.06)",
              border: "1px solid rgba(255,185,0,0.2)",
              fontSize: "12px", color: "#c9a227", fontFamily: "var(--font-body)",
              textAlign: "center",
            }}>
              ⚠️ This playlist will be automatically deleted in 24 hours
            </div>

            {/* Save CTA mock */}
            <div style={{
              padding: "12px", borderRadius: "10px",
              background: "var(--green)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}>
              <Heart size={16} color="#000" />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#000", fontFamily: "var(--font-heading)" }}>
                Create Playlist in My Account Instead
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: "100px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{
            textAlign: "center", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.1em", color: "var(--green)",
            textTransform: "uppercase", marginBottom: "16px", fontFamily: "var(--font-body)",
          }}>
            How it works
          </p>
          <h2 style={{
            textAlign: "center", fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "64px",
          }}>
            Zero friction. Full control.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "24px" }}>
            {[
              {
                icon: <Upload size={24} />,
                step: "01",
                title: "Upload or describe",
                desc: "Drop a screenshot of any tracklist — Spotify, Apple Music, YouTube — or just describe your mood in plain English.",
                tag: null,
              },
              {
                icon: <Sparkles size={24} />,
                step: "02",
                title: "AI builds your playlist",
                desc: "Gemini reads your input, Last.fm expands the selection, and our 6-stage curation engine picks the perfect tracks.",
                tag: null,
              },
              {
                icon: <Play size={24} />,
                step: "03",
                title: "Listen instantly",
                desc: "Your playlist is live on Symphony's Spotify account. Listen right away via the embedded player. No account needed.",
                tag: "Free preview",
              },
              {
                icon: <Heart size={24} />,
                step: "04",
                title: "Save to your account",
                desc: "Love the mix? One click clones it directly into your own Spotify library. Yours forever, even after the preview expires.",
                tag: "Optional",
              },
            ].map(({ icon, step, title, desc, tag }) => (
              <div key={step} style={{
                padding: "28px", borderRadius: "16px",
                border: "1px solid var(--border)", background: "var(--bg-card)",
                display: "flex", flexDirection: "column", gap: "16px",
                position: "relative",
              }}>
                {tag && (
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    padding: "2px 10px", borderRadius: "20px",
                    background: "rgba(29,185,84,0.1)",
                    border: "1px solid rgba(29,185,84,0.2)",
                    fontSize: "11px", color: "var(--green)", fontFamily: "var(--font-body)",
                  }}>
                    {tag}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "12px",
                    background: "rgba(29,185,84,0.08)",
                    border: "1px solid rgba(29,185,84,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "var(--green)",
                  }}>
                    {icon}
                  </div>
                  <span style={{ fontSize: "32px", fontWeight: 800, color: "var(--border-hover)", fontFamily: "var(--font-heading)" }}>
                    {step}
                  </span>
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The two modes explained ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{
            textAlign: "center", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.1em", color: "var(--green)",
            textTransform: "uppercase", marginBottom: "16px", fontFamily: "var(--font-body)",
          }}>
            Two ways to create
          </p>
          <h2 style={{
            textAlign: "center", fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "64px",
          }}>
            Screenshot or prompt — your choice
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "24px" }}>
            {/* Screenshot mode */}
            <div style={{
              padding: "36px", borderRadius: "20px",
              border: "1px solid rgba(29,185,84,0.2)",
              background: "linear-gradient(135deg, rgba(29,185,84,0.04) 0%, transparent 100%)",
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "rgba(29,185,84,0.1)", border: "1px solid rgba(29,185,84,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--green)", marginBottom: "20px",
              }}>
                <ImageIcon size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                Screenshot to Playlist
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px", fontFamily: "var(--font-body)" }}>
                Saw a great queue on someone's Spotify? A YouTube playlist? Apple Music? Just screenshot it and drop it in. Gemini reads the image and builds the playlist instantly.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["Works with any music app", "Reads screenshots accurately", "No manual typing needed"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--green)", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt mode */}
            <div style={{
              padding: "36px", borderRadius: "20px",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
            }}>
              <div style={{
                width: "52px", height: "52px", borderRadius: "14px",
                background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)", marginBottom: "20px",
              }}>
                <MessageSquare size={24} />
              </div>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                Prompt to Playlist
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: "20px", fontFamily: "var(--font-body)" }}>
                Describe your vibe in plain English. "Late night indie for studying", "Hindi 90s classics", "gym music that hits hard" — our 6-stage AI pipeline curates the perfect mix.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {["6-stage AI curation pipeline", "Last.fm music graph expansion", "Gemini-powered final curation"].map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-muted)", flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "var(--font-body)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{
            textAlign: "center", fontSize: "12px", fontWeight: 600,
            letterSpacing: "0.1em", color: "var(--green)",
            textTransform: "uppercase", marginBottom: "16px", fontFamily: "var(--font-body)",
          }}>
            Features
          </p>
          <h2 style={{
            textAlign: "center", fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "64px",
          }}>
            Built different
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { icon: <Zap size={20} />, title: "20 second generation", desc: "From screenshot to playable Spotify playlist in under 20 seconds." },
              { icon: <Play size={20} />, title: "Instant preview", desc: "Embedded Spotify player — listen right away, no login needed." },
              { icon: <Heart size={20} />, title: "One-click save", desc: "Clone the playlist to your own Spotify account with one click." },
              { icon: <Clock size={20} />, title: "Auto-cleanup", desc: "Previews auto-delete after 24 hours. Clean, privacy-first." },
              { icon: <Sparkles size={20} />, title: "AI curation", desc: "Not just search — a 6-stage pipeline ensures quality results." },
              { icon: <Share2 size={20} />, title: "Shareable links", desc: "Share the playlist link with anyone. They can save it too." },
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{
                padding: "24px", borderRadius: "14px",
                border: "1px solid var(--border)", background: "var(--bg-card)",
                display: "flex", flexDirection: "column", gap: "12px",
                transition: "border-color 0.2s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "rgba(29,185,84,0.08)", border: "1px solid rgba(29,185,84,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--green)",
                }}>
                  {icon}
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "100px 24px", borderTop: "1px solid var(--border)" }}>
        <div style={{
          maxWidth: "700px", margin: "0 auto", textAlign: "center",
          padding: "64px 40px", borderRadius: "24px",
          border: "1px solid rgba(29,185,84,0.2)",
          background: "linear-gradient(135deg, rgba(29,185,84,0.06) 0%, transparent 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-50%", left: "50%", transform: "translateX(-50%)",
            width: "400px", height: "400px",
            background: "radial-gradient(circle, rgba(29,185,84,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <h2 style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 800,
            color: "var(--text-primary)", letterSpacing: "-0.03em", marginBottom: "16px",
          }}>
            Your next playlist is<br />
            <span style={{ color: "var(--green)" }}>one screenshot away.</span>
          </h2>
          <p style={{
            fontSize: "16px", color: "var(--text-secondary)",
            marginBottom: "32px", lineHeight: 1.6, fontFamily: "var(--font-body)",
          }}>
            No account needed. No setup. Just drop an image or type a prompt.
          </p>
          <button
            onClick={() => router.push("/app")}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "16px 40px", borderRadius: "10px",
              background: "var(--green)", color: "#000",
              border: "none", cursor: "pointer",
              fontFamily: "var(--font-heading)", fontSize: "16px", fontWeight: 700,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Try Symphony free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        padding: "32px 24px", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={14} color="#000" />
          </div>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
            Symphony
          </span>
        </div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "var(--font-body)" }}>
          Built with Gemini AI · Spotify API · Last.fm
        </p>
      </footer>
    </div>
  );
}