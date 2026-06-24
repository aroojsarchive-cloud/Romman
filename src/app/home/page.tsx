"use client";

import Image from "next/image";
import Link from "next/link";

const friends = [
  { name: "Sharmin", initial: "S", answered: true },
  { name: "H", initial: "H", answered: false },
  { name: "Arooj", initial: "A", answered: false },
];

const sections = [
  { label: "Memories", sub: "photos & moments", href: "/memories" },
  { label: "Words", sub: "questions & answers", href: "/words" },
  { label: "Board", sub: "our moodboard", href: "/board" },
  { label: "Notes", sub: "for each other", href: "/notes" },
];

export default function ArchiveHome() {
  const answeredCount = friends.filter((f) => f.answered).length;

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "#1a1210" }}>

      {/* Full bleed kitchen background */}
      <Image
        src="/images/16bc9db4080a24ac00779c23557671de.jpg"
        alt="kitchen"
        fill
        className="object-cover object-top"
        priority
      />
      {/* Soft dark overlay — keep image showing */}
      <div className="absolute inset-0" style={{ background: "rgba(26,18,16,0.35)" }} />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden">
            <Image src="/icon.png" alt="Romman" fill className="object-cover" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(245,240,235,0.7)" }}>our archive</p>
            <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#f5f0eb" }}>Romman</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5" style={{ background: "rgba(26,18,16,0.5)" }}>
          <div className="relative w-5 h-5">
            <Image
              src="/images/Gemini_Generated_Image_366i9e366i9e366i (1).png"
              alt="pomegranate"
              fill
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "#f5d0c0" }}>1 of 52</span>
        </div>
      </header>

      {/* Centred 2x2 grid */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-8 py-6">
        <div className="grid grid-cols-2 gap-4 w-full max-w-[320px]">
          {sections.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="flex flex-col items-center justify-center rounded-2xl active:opacity-80 transition-opacity"
              style={{
                aspectRatio: "1",
                background: "rgba(245,235,215,0.15)",
                border: "1.5px solid rgba(245,235,215,0.3)",
                backdropFilter: "blur(6px)",
              }}
            >
              <div className="w-2 h-2 rounded-full mb-3" style={{ background: "rgba(196,160,106,0.9)" }} />
              <p className="text-[16px] font-semibold" style={{ color: "#f5f0eb", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                {s.label}
              </p>
              <p className="text-[9px] uppercase tracking-wide mt-1" style={{ color: "rgba(245,240,235,0.55)" }}>
                {s.sub}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom — this week + progress */}
      <div className="relative z-10 px-6 pb-10">
        {/* Weekly question */}
        <div
          className="rounded-2xl p-4 mb-4 flex items-center justify-between"
          style={{ background: "rgba(139,26,42,0.7)", border: "1px solid rgba(196,64,48,0.3)", backdropFilter: "blur(4px)" }}
        >
          <div className="flex-1 mr-4">
            <p className="text-[9px] uppercase tracking-[0.2em] mb-1" style={{ color: "#f5d0c0" }}>this week</p>
            <p className="text-[13px]" style={{ color: "#f5f0eb", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
              What brought you joy?
            </p>
          </div>
          <div className="flex gap-1.5">
            {friends.map((f) => (
              <div
                key={f.name}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold"
                style={{
                  background: f.answered ? "#f5f0eb" : "rgba(245,240,235,0.2)",
                  color: f.answered ? "#8b1a2a" : "rgba(245,240,235,0.5)",
                }}
              >
                {f.initial}
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 rounded-full h-1 overflow-hidden" style={{ background: "rgba(245,240,235,0.2)" }}>
            <div className="h-full rounded-full" style={{ background: "#c43040", width: "1.9%" }} />
          </div>
          <p className="text-[11px]" style={{ color: "rgba(245,240,235,0.45)" }}>collected together · 1 of 52</p>
        </div>
      </div>

    </div>
  );
}
