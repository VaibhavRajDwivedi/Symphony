"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Music2, Upload, Sparkles, Share2, ArrowRight, ImageIcon,
  MessageSquare, Zap, Clock, Play, Heart, Shuffle, GitBranch,
  Database, Cpu, Layers, RefreshCw, Network, ChevronRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const PLAYLIST_NAMES = [
  "Midnight Tokyo Drift", "Monsoon Drive", "Late Night Seoul",
  "Bella Vita", "Desert Highway Dusk", "2AM in Lisbon",
  "Shoegaze Sundays", "Neon Jungle Beats", "Rainy Café Paris",
  "Summer Blur 1999", "Coastal Introspection", "Electric Lagos Nights",
];

const DEMO_STEPS = [
  {
    label: "PROMPT",
    input: "late night drive through tokyo, lofi + electronic",
    tracks: [
      { title: "Neon River", artist: "Nujabes", dur: "3:47" },
      { title: "Feather", artist: "Nujabes ft. Cise Starr", dur: "4:02" },
      { title: "Space Cadet", artist: "Keshi", dur: "3:14" },
      { title: "Overdrive", artist: "Sango", dur: "3:31" },
      { title: "Midnight in Tokyo", artist: "Mac Ayres", dur: "2:58" },
    ],
  },
];

/* ─────────────────────────────────────────────
   FADE UP WRAPPER
───────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   MARQUEE
───────────────────────────────────────────── */
function Marquee() {
  const items = [...PLAYLIST_NAMES, ...PLAYLIST_NAMES];
  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 120,
        background: "linear-gradient(90deg, #080808, transparent)", zIndex: 2,
      }} />
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 120,
        background: "linear-gradient(-90deg, #080808, transparent)", zIndex: 2,
      }} />
      <motion.div
        style={{ display: "flex", gap: 32, width: "max-content" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, ease: "linear", repeat: Infinity }}
      >
        {items.map((name, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
            padding: "10px 20px", borderRadius: 100,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1db954" }} />
            <span style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", fontFamily: "inherit", whiteSpace: "nowrap" }}>{name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED DEMO CARD
───────────────────────────────────────────── */
function DemoCard() {
  const [phase, setPhase] = useState<"typing" | "loading" | "done">("typing");
  const [typedText, setTypedText] = useState("");
  const [visibleTracks, setVisibleTracks] = useState(0);
  const fullText = DEMO_STEPS[0].input;
  const tracks = DEMO_STEPS[0].tracks;

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    // Typing phase
    let i = 0;
    setTypedText("");
    setVisibleTracks(0);
    setPhase("typing");

    const typeInterval = setInterval(() => {
      i++;
      setTypedText(fullText.slice(0, i));
      if (i >= fullText.length) {
        clearInterval(typeInterval);
        setPhase("loading");
        timeout = setTimeout(() => {
          setPhase("done");
          // Reveal tracks one by one
          let t = 0;
          const trackInterval = setInterval(() => {
            t++;
            setVisibleTracks(t);
            if (t >= tracks.length) {
              clearInterval(trackInterval);
              // Loop after pause
              setTimeout(() => {
                setTypedText("");
                setVisibleTracks(0);
                setPhase("typing");
                i = 0;
                // restart
              }, 4000);
            }
          }, 220);
        }, 1400);
      }
    }, 38);

    return () => { clearInterval(typeInterval); clearTimeout(timeout); };
  }, []);

  return (
    <div style={{
      width: "100%", maxWidth: 520,
      borderRadius: 20, border: "1px solid rgba(255,255,255,0.10)",
      background: "rgba(10,10,10,0.95)",
      boxShadow: "0 0 0 1px rgba(29,185,84,0.08), 0 40px 80px rgba(0,0,0,0.7), 0 0 120px rgba(29,185,84,0.06)",
      overflow: "hidden",
      backdropFilter: "blur(20px)",
    }}>
      {/* Title bar */}
      <div style={{
        padding: "14px 18px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.02)",
      }}>
        {["#ff5f57","#ffbd2e","#28c840"].map(c => (
          <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
        ))}
        <span style={{ flex: 1, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
          symphony.app
        </span>
      </div>

      <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Input box */}
        <div style={{
          padding: "14px 16px", borderRadius: 12,
          border: "1px solid rgba(29,185,84,0.25)",
          background: "rgba(29,185,84,0.04)",
          minHeight: 50,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <MessageSquare size={15} color="#1db954" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: "rgba(255,255,255,0.75)", letterSpacing: "-0.01em" }}>
            {typedText}
            {phase === "typing" && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                style={{ display: "inline-block", width: 2, height: 14, background: "#1db954", marginLeft: 2, verticalAlign: "middle" }}
              />
            )}
          </span>
        </div>

        {/* Loading / tracks */}
        <AnimatePresence mode="wait">
          {phase === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0" }}
            >
              <div style={{ display: "flex", gap: 4 }}>
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#1db954" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>Generating playlist…</span>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div key="tracks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Generated · {tracks.length} tracks
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#1db954" }} />
                  <span style={{ fontSize: 11, color: "#1db954", fontWeight: 600 }}>Live</span>
                </div>
              </div>
              {tracks.slice(0, visibleTracks).map((track, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10,
                    background: i === 0 ? "rgba(29,185,84,0.08)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 0 ? "rgba(29,185,84,0.15)" : "rgba(255,255,255,0.05)"}`,
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 6, flexShrink: 0,
                    background: `hsl(${(i * 47 + 140) % 360}, 40%, 20%)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i === 0 ? <Play size={12} color="#1db954" fill="#1db954" /> : <Music2 size={12} color="rgba(255,255,255,0.3)" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: i === 0 ? "#fff" : "rgba(255,255,255,0.65)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.30)" }}>{track.artist}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{track.dur}</span>
                </motion.div>
              ))}

              {/* Save CTA */}
              {visibleTracks >= tracks.length && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    marginTop: 4, padding: "12px 16px", borderRadius: 10,
                    background: "#1db954",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    cursor: "pointer",
                  }}
                >
                  <Heart size={14} color="#000" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#000" }}>Save to My Spotify</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function LandingPage() {
  const router = useRouter();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -40]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080808",
      overflowX: "hidden",
      color: "#fff",
      fontFamily: "'DM Sans', 'Sora', system-ui, sans-serif",
    }}>

      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
          height: 64, padding: "0 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <motion.div
            whileHover={{ scale: 1.08, rotate: -4 }}
            style={{ width: 34, height: 34, borderRadius: 9, background: "#1db954", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <Music2 size={18} color="#000" strokeWidth={2.5} />
          </motion.div>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.04em", color: "#fff" }}>Symphony</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="#how-it-works" style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", textDecoration: "none", fontWeight: 500 }}>
            How it works
          </a>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
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
          </motion.button>
        </div>
      </motion.nav>

      <main>
        {/* ── Hero ── */}
        <motion.section
          style={{ opacity: heroOpacity, y: heroY }}
          initial={false}
        >
          <div style={{
            minHeight: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            padding: "120px 24px 80px",
            textAlign: "center", position: "relative",
          }}>
            {/* Grain overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat",
            }} />

            {/* Glow blobs */}
            <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: 700, height: 500, background: "radial-gradient(ellipse, rgba(29,185,84,0.07) 0%, transparent 65%)", pointerEvents: "none", zIndex: 0 }} />
            <div style={{ position: "absolute", bottom: "10%", left: "20%", width: 300, height: 300, background: "radial-gradient(circle, rgba(29,185,84,0.04) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "5px 14px", borderRadius: 100,
                  border: "1px solid rgba(29,185,84,0.25)",
                  background: "rgba(29,185,84,0.06)",
                  marginBottom: 36,
                }}
              >
                <Sparkles size={11} color="#1db954" />
                <span style={{ fontSize: 11, color: "#1db954", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 700 }}>
                  Powered by LangGraph · Gemini · Groq
                </span>
              </motion.div>

              {/* Headline */}
              <div style={{ overflow: "hidden", marginBottom: 20 }}>
                {["Any input.", "Perfect playlists."].map((line, lineIdx) => (
                  <div key={lineIdx} style={{ overflow: "hidden" }}>
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      transition={{ duration: 0.75, delay: 0.2 + lineIdx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <h1 style={{
                        fontSize: "clamp(52px, 9vw, 96px)",
                        fontWeight: 900, letterSpacing: "-0.05em",
                        lineHeight: 1.0, margin: 0,
                        color: lineIdx === 0 ? "#fff" : "#1db954",
                      }}>
                        {line}
                      </h1>
                    </motion.div>
                  </div>
                ))}
              </div>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                style={{ fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.65, marginBottom: 10 }}
              >
                Upload a screenshot, describe your vibe, or remix a playlist. A 6-stage multi-agent pipeline does the rest.
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                style={{ fontSize: 12, color: "rgba(255,255,255,0.22)", marginBottom: 44 }}
              >
                No account needed to generate · Login only to save
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 72 }}
              >
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: "0 0 32px rgba(29,185,84,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/app")}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "15px 34px", borderRadius: 10,
                    background: "#1db954", color: "#000",
                    border: "none", cursor: "pointer",
                    fontSize: 15, fontWeight: 800, letterSpacing: "-0.01em",
                  }}
                >
                  Try it free <ArrowRight size={15} />
                </motion.button>
                <motion.a
                  whileHover={{ borderColor: "rgba(255,255,255,0.25)" }}
                  href="#how-it-works"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "15px 34px", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.10)",
                    color: "rgba(255,255,255,0.50)",
                    textDecoration: "none", fontSize: 15, fontWeight: 600,
                    transition: "border-color 0.2s",
                  }}
                >
                  See how it works
                </motion.a>
              </motion.div>

              {/* Demo card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: "100%", display: "flex", justifyContent: "center" }}
              >
                <DemoCard />
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* ── Marquee ── */}
        <section style={{ padding: "40px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <Marquee />
        </section>

        {/* ── How it works ── */}
        <section id="how-it-works" style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <FadeUp>
              <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1db954", textTransform: "uppercase", marginBottom: 14 }}>
                How it works
              </p>
              <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 72 }}>
                Zero friction. Full control.
              </h2>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
              {[
                { icon: <Upload size={22} />, step: "01", title: "Input your way", desc: "Screenshot, text prompt, or Spotify link. Whatever format you're working with." },
                { icon: <Sparkles size={22} />, step: "02", title: "Pipeline runs", desc: "LangGraph orchestrates 6 stages: intent parsing, graph expansion, Groq inference, Gemini curation." },
                { icon: <Play size={22} />, step: "03", title: "Listen instantly", desc: "Your playlist streams immediately inside the app. No account required.", tag: "Free" },
                { icon: <Heart size={22} />, step: "04", title: "Save it forever", desc: "One click clones it to your Spotify. Yours for keeps.", tag: "Optional" },
              ].map(({ icon, step, title, desc, tag }, i) => (
                <FadeUp key={step} delay={i * 0.08}>
                  <motion.article
                    whileHover={{ borderColor: "rgba(29,185,84,0.25)", y: -3 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: 28, borderRadius: 16, height: "100%",
                      border: "1px solid rgba(255,255,255,0.07)",
                      background: "#0c0c0c",
                      display: "flex", flexDirection: "column", gap: 14,
                      position: "relative", cursor: "default",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {tag && (
                      <div style={{
                        position: "absolute", top: 14, right: 14,
                        padding: "2px 10px", borderRadius: 100,
                        background: "rgba(29,185,84,0.10)", border: "1px solid rgba(29,185,84,0.20)",
                        fontSize: 10, color: "#1db954", fontWeight: 700, letterSpacing: "0.06em",
                      }}>{tag}</div>
                    )}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{
                        width: 46, height: 46, borderRadius: 12,
                        background: "rgba(29,185,84,0.07)", border: "1px solid rgba(29,185,84,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center", color: "#1db954",
                      }}>
                        {icon}
                      </div>
                      <span style={{ fontSize: 36, fontWeight: 900, color: "rgba(255,255,255,0.06)", letterSpacing: "-0.04em" }}>{step}</span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", lineHeight: 1.65, margin: 0 }}>{desc}</p>
                  </motion.article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Three Input Modes ── */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <FadeUp>
              <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1db954", textTransform: "uppercase", marginBottom: 14 }}>
                Three ways in
              </p>
              <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 72 }}>
                Your input. Any format.
              </h2>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>

              {/* Screenshot */}
              <FadeUp delay={0}>
                <motion.article
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    padding: 36, borderRadius: 20, height: "100%",
                    border: "1px solid rgba(29,185,84,0.18)",
                    background: "linear-gradient(145deg, rgba(29,185,84,0.05) 0%, rgba(29,185,84,0.01) 100%)",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(29,185,84,0.10)", border: "1px solid rgba(29,185,84,0.20)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1db954" }}>
                    <ImageIcon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.03em" }}>Screenshot</h3>
                    <p style={{ fontSize: 10, color: "rgba(29,185,84,0.65)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Gemini 2.5 Flash Vision</p>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, margin: 0 }}>
                    Drop a screenshot from Spotify, Apple Music, or YouTube. Gemini Vision extracts tracks and resolves them to Spotify URIs automatically.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Works with any music app", "OCR + semantic resolution", "No manual entry"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ChevronRight size={12} color="#1db954" />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </FadeUp>

              {/* Prompt */}
              <FadeUp delay={0.08}>
                <motion.article
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    padding: 36, borderRadius: 20, height: "100%",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "#0d0d0d",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.4)" }}>
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.03em" }}>Prompt</h3>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>LangGraph · Groq · Last.fm</p>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, margin: 0 }}>
                    Describe your vibe in plain English. Groq routes intent in milliseconds, Last.fm expands the music graph, Gemini finalizes the curation.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {["6-stage multi-agent pipeline", "Last.fm graph expansion", "Sub-20s generation"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ChevronRight size={12} color="rgba(255,255,255,0.25)" />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </FadeUp>

              {/* Remix */}
              <FadeUp delay={0.16}>
                <motion.article
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    padding: 36, borderRadius: 20, height: "100%",
                    border: "1px solid rgba(168,85,247,0.18)",
                    background: "linear-gradient(145deg, rgba(168,85,247,0.05) 0%, rgba(168,85,247,0.01) 100%)",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(168,85,247,0.10)", border: "1px solid rgba(168,85,247,0.20)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7" }}>
                    <Shuffle size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.03em" }}>Remix</h3>
                    <p style={{ fontSize: 10, color: "rgba(168,85,247,0.65)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>Multi-agent filtering pipeline</p>
                  </div>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.42)", lineHeight: 1.7, margin: 0 }}>
                    Paste a Spotify link + a prompt like "remove acoustic" or "higher BPM only." The pipeline fetches, filters, and rebuilds the mix.
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {["Audio feature filtering", "BPM-aware reordering", "One-click save"].map(f => (
                      <li key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <ChevronRight size={12} color="rgba(168,85,247,0.6)" />
                        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.38)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              </FadeUp>

            </div>
          </div>
        </section>

        {/* ── Architecture ── */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <FadeUp>
              <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1db954", textTransform: "uppercase", marginBottom: 14 }}>
                Under the hood
              </p>
              <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 12 }}>
                Serious engineering.
              </h2>
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.35)", fontSize: 16, maxWidth: 480, margin: "0 auto 72px", lineHeight: 1.6 }}>
                Not a weekend prototype — a production-grade distributed system.
              </p>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 40 }}>
              {[
                { icon: <GitBranch size={18} />, name: "LangGraph Pipeline", detail: "6-stage stateful multi-agent graph with typed state transitions and conditional edge routing.", color: "#1db954", border: "rgba(29,185,84,0.12)", bg: "rgba(29,185,84,0.04)" },
                { icon: <Cpu size={18} />, name: "Gemini 2.5 Flash + Groq", detail: "Vision model for image parsing. Groq for sub-100ms intent classification at the routing layer.", color: "#60a5fa", border: "rgba(96,165,250,0.12)", bg: "rgba(96,165,250,0.04)" },
                { icon: <Network size={18} />, name: "Spotify & Last.fm APIs", detail: "Full OAuth 2.0 + PKCE with server-side refresh. Last.fm graph for semantic artist/track expansion.", color: "#1db954", border: "rgba(29,185,84,0.12)", bg: "rgba(29,185,84,0.04)" },
                { icon: <Database size={18} />, name: "Supabase + Prisma ORM", detail: "PostgreSQL on Supabase. Prisma for type-safe queries, schema migrations, and session persistence.", color: "#34d399", border: "rgba(52,211,153,0.12)", bg: "rgba(52,211,153,0.04)" },
                { icon: <Layers size={18} />, name: "Node.js ESM on Render", detail: "Strict ES module deployment. Render for autoscaling with env-based secret injection.", color: "#fb923c", border: "rgba(251,146,60,0.12)", bg: "rgba(251,146,60,0.04)" },
                { icon: <RefreshCw size={18} />, name: "Auto-cleanup & TTL", detail: "Scheduled jobs purge ephemeral playlists from Spotify and Supabase after 24 hours.", color: "#c084fc", border: "rgba(192,132,252,0.12)", bg: "rgba(192,132,252,0.04)" },
              ].map(({ icon, name, detail, color, border, bg }, i) => (
                <FadeUp key={name} delay={i * 0.06}>
                  <div style={{ padding: 22, borderRadius: 14, border: `1px solid ${border}`, background: bg, display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, color }}>
                      {icon}
                      <span style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{name}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.30)", lineHeight: 1.65, margin: 0 }}>{detail}</p>
                  </div>
                </FadeUp>
              ))}
            </div>

            {/* Stack pills */}
            <FadeUp>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                {["LangGraph", "Gemini 2.5 Flash", "Groq", "Spotify OAuth/PKCE", "Last.fm API", "Supabase", "Prisma ORM", "Node.js ESM", "PostgreSQL", "Render"].map(t => (
                  <span key={t} style={{
                    padding: "4px 12px", borderRadius: 100,
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                    fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 600,
                  }}>{t}</span>
                ))}
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ── Features ── */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <FadeUp>
              <p style={{ textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", color: "#1db954", textTransform: "uppercase", marginBottom: 14 }}>
                Features
              </p>
              <h2 style={{ textAlign: "center", fontSize: "clamp(28px,4vw,52px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 72 }}>
                Built different.
              </h2>
            </FadeUp>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {[
                { icon: <Zap size={18} />, title: "Sub-20s generation", desc: "Raw input to playable Spotify playlist in under 20 seconds." },
                { icon: <Play size={18} />, title: "Instant preview", desc: "Embedded Spotify player. Listen right away, zero login." },
                { icon: <Heart size={18} />, title: "One-click save", desc: "Clone to your own Spotify library in a single click." },
                { icon: <Clock size={18} />, title: "Auto-cleanup (24h)", desc: "Ephemeral previews auto-delete. Privacy-first by design." },
                { icon: <Sparkles size={18} />, title: "AI curation", desc: "6-stage stateful pipeline — not a simple keyword search." },
                { icon: <Share2 size={18} />, title: "Shareable links", desc: "Share any playlist. Recipients can save it to their account too." },
              ].map(({ icon, title, desc }, i) => (
                <FadeUp key={title} delay={i * 0.05}>
                  <motion.article
                    whileHover={{ borderColor: "rgba(29,185,84,0.20)", background: "#0e0e0e" }}
                    transition={{ duration: 0.2 }}
                    style={{
                      padding: 22, borderRadius: 14,
                      border: "1px solid rgba(255,255,255,0.06)",
                      background: "#0b0b0b",
                      display: "flex", flexDirection: "column", gap: 10,
                    }}
                  >
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(29,185,84,0.07)", border: "1px solid rgba(29,185,84,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#1db954" }}>
                      {icon}
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 }}>{title}</h3>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
                  </motion.article>
                </FadeUp>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section style={{ padding: "100px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <FadeUp>
            <div style={{
              maxWidth: 680, margin: "0 auto", textAlign: "center",
              padding: "72px 40px", borderRadius: 24,
              border: "1px solid rgba(29,185,84,0.18)",
              background: "linear-gradient(145deg, rgba(29,185,84,0.05) 0%, transparent 100%)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "-60%", left: "50%", transform: "translateX(-50%)", width: 480, height: 480, background: "radial-gradient(circle, rgba(29,185,84,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
              <h2 style={{ fontSize: "clamp(32px,5vw,56px)", fontWeight: 900, letterSpacing: "-0.04em", color: "#fff", marginBottom: 16, position: "relative" }}>
                Your next playlist is<br /><span style={{ color: "#1db954" }}>one input away.</span>
              </h2>
              <p style={{ fontSize: 16, color: "rgba(255,255,255,0.40)", marginBottom: 36, lineHeight: 1.6, position: "relative" }}>
                No setup. No account. Screenshot, prompt, or remix — pick your weapon.
              </p>
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(29,185,84,0.40)" }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push("/app")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "16px 40px", borderRadius: 10,
                  background: "#1db954", color: "#000",
                  border: "none", cursor: "pointer",
                  fontSize: 16, fontWeight: 800, position: "relative",
                  letterSpacing: "-0.01em",
                }}
              >
                Try Symphony free <ArrowRight size={16} />
              </motion.button>
            </div>
          </FadeUp>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer style={{
        padding: "28px 24px",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#1db954", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Music2 size={14} color="#000" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Symphony</span>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.20)", margin: 0 }}>
          LangGraph · Gemini · Groq · Spotify API · Supabase
        </p>
      </footer>

    </div>
  );
}