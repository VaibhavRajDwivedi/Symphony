"use client";

import { useRouter } from "next/navigation";
import { Music2, Upload, Sparkles, Share2, ArrowRight, ImageIcon, MessageSquare, Zap, Clock, Play, Heart, Terminal, GitBranch, Database, Cpu } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-zinc-300 selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      
      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 h-16 flex items-center justify-between border-b border-zinc-800/80 bg-black/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-emerald-500 flex items-center justify-center">
            <Music2 size={18} className="text-black" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Symphony</span>
        </div>
        <button
          onClick={() => router.push("/app")}
          className="flex items-center gap-2 px-5 py-2 rounded-md bg-emerald-500 text-black text-sm font-bold hover:bg-emerald-400 transition-colors"
        >
          Open App <ArrowRight size={14} />
        </button>
      </nav>

      {/* ── Hero ── */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center relative">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-500/5 blur-[120px] pointer-events-none rounded-full" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8">
          <Cpu size={14} className="text-emerald-400" />
          <span className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
            Gemini 2.5 Flash + LangGraph + Spotify
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8 max-w-4xl">
          Screenshot to Spotify.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
            In seconds.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-4">
          Drop any tracklist screenshot or describe your vibe. 
          The 6-stage AI orchestration engine builds an instant Spotify playlist.
        </p>
        <p className="text-sm font-mono text-zinc-500 mb-10">
          &gt; NO_ACCOUNT_REQUIRED --flag save_optional
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => router.push("/app")}
            className="flex items-center gap-2 px-8 py-4 rounded-lg bg-emerald-500 text-black text-base font-bold hover:bg-emerald-400 transition-colors"
          >
            Execute Pipeline <ArrowRight size={16} />
          </button>
          <a
            href="#architecture"
            className="flex items-center gap-2 px-8 py-4 rounded-lg border border-zinc-700 text-white font-semibold hover:border-zinc-500 hover:bg-zinc-900 transition-all"
          >
            View Architecture
          </a>
        </div>

        {/* Terminal Execution Mock */}
        <div className="mt-20 w-full max-w-3xl rounded-xl border border-zinc-800 bg-[#0a0a0a] overflow-hidden shadow-2xl text-left">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <span className="ml-4 text-xs font-mono text-zinc-500">~/symphony/execution-log</span>
          </div>
          <div className="p-6 font-mono text-sm flex flex-col gap-3">
            <div className="text-zinc-400"><span className="text-emerald-400">➜</span> ./symphony generate --input user_screenshot.png</div>
            <div className="text-zinc-500">[SYS] Initializing LangGraph multi-agent pipeline...</div>
            <div className="text-zinc-300">[AI]  Gemini 2.5 Vision: Extracted 24 tracks from image.</div>
            <div className="text-zinc-500">[SYS] Routing intent via Groq API (34ms)...</div>
            <div className="text-zinc-300">[API] Last.fm: Expanding graph to 50 relational nodes.</div>
            <div className="text-zinc-300">[AI]  Curating final output. Filtering duplicates.</div>
            <div className="text-emerald-400">[SUCCESS] Playlist generated. Spotify ID: 7xG2...</div>
            <div className="text-zinc-500 animate-pulse">_</div>
          </div>
        </div>
      </section>

      {/* ── Architecture (New Section) ── */}
      <section id="architecture" className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono text-emerald-500 mb-4 uppercase tracking-widest">// System Design</div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-16">
            The Orchestration Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-emerald-500/50 transition-colors group">
              <Terminal className="text-zinc-500 mb-6 group-hover:text-emerald-400 transition-colors" size={32} />
              <h3 className="text-lg font-bold text-white mb-3">1. Ingestion & Parsing</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-mono">
                Multimodal input handling. Screenshots are fed to Gemini Vision for OCR and context extraction. Text prompts are tokenized and routed.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-emerald-500/50 transition-colors group">
              <GitBranch className="text-zinc-500 mb-6 group-hover:text-emerald-400 transition-colors" size={32} />
              <h3 className="text-lg font-bold text-white mb-3">2. LangGraph Curation</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-mono">
                A 6-stage autonomous agent pipeline. Queries Last.fm for musical topology, utilizes Groq for ultra-low latency decision making, and filters outliers.
              </p>
            </div>
            <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/50 hover:border-emerald-500/50 transition-colors group">
              <Database className="text-zinc-500 mb-6 group-hover:text-emerald-400 transition-colors" size={32} />
              <h3 className="text-lg font-bold text-white mb-3">3. Execution & Sync</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-mono">
                Batch mutations to the Spotify API. Creates a temporary session container, allowing instant playback before permanent DB persistence via Prisma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Two Modes ── */}
      <section className="py-24 px-6 border-t border-zinc-900 bg-zinc-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-xs font-mono text-emerald-500 mb-4 uppercase tracking-widest">// Input Vectors</div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-16">
            Image or String.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-10 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden">
              <ImageIcon className="text-emerald-400 mb-8" size={40} />
              <h3 className="text-2xl font-bold text-white mb-4">Screenshot.</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Saw a fire queue on YouTube, a TikTok tracklist, or an Apple Music mix? Drop the image. The vision model reconstructs the sequence into standard Spotify URIs.
              </p>
              <ul className="space-y-3 font-mono text-sm text-zinc-500">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Bypasses platform walled gardens</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> High-accuracy OCR mapping</li>
              </ul>
            </div>

            <div className="p-10 rounded-2xl border border-zinc-800 bg-[#0a0a0a]">
              <MessageSquare className="text-zinc-500 mb-8" size={40} />
              <h3 className="text-2xl font-bold text-white mb-4">Prompt.</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">
                Define parameters in plain text. "Late night indie coding", "90s boom bap", or "high BPM dark synth". The curation engine builds the topology.
              </p>
              <ul className="space-y-3 font-mono text-sm text-zinc-500">
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Semantic intent recognition</li>
                <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-zinc-600" /> Vibe and tempo clustering</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Zap size={20} />, title: "< 20s Latency", desc: "From image upload to playable Spotify payload in under 20 seconds." },
              { icon: <Play size={20} />, title: "Headless Preview", desc: "Listen instantly via embedded iframe. No Spotify auth required for viewing." },
              { icon: <Heart size={20} />, title: "One-Click Clone", desc: "OAuth integration allows 1-click cloning to your personal Spotify account." },
              { icon: <Clock size={20} />, title: "Cron Cleanup", desc: "Temporary playlists are purged automatically from our servers after 24 hours." },
              { icon: <Sparkles size={20} />, title: "Graph Curation", desc: "Not generic search. Last.fm relational data ensures deep, accurate cuts." },
              { icon: <Share2 size={20} />, title: "Stateless Sharing", desc: "Share URLs instantly. State is maintained server-side for easy distribution." },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-600 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed font-mono">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-24 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Initialize your next session.
          </h2>
          <p className="text-zinc-400 font-mono text-sm mb-8">
            Deploy a custom queue in seconds. Zero config required.
          </p>
          <button
            onClick={() => router.push("/app")}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-colors"
          >
            Launch Symphony <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-6 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center bg-zinc-800">
            <Music2 size={12} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">Symphony</span>
        </div>
        <p className="text-xs font-mono text-zinc-600">
          STACK: NEXT.JS / LANGGRAPH / PRISMA / SUPABASE / GROQ
        </p>
      </footer>
    </div>
  );
}