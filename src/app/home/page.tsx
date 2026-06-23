"use client";

import Image from "next/image";
import Link from "next/link";

// Placeholder friends — will come from auth/db later
const friends = [
  { name: "Sharmin", initial: "S", answered: true },
  { name: "H", initial: "H", answered: false },
  { name: "Arooj", initial: "A", answered: false },
];

const sections = [
  { label: "Photos", icon: "◈", href: "#", description: "Moments we've saved" },
  { label: "Journal", icon: "✦", href: "#", description: "Questions & answers" },
  { label: "Saved", icon: "❋", href: "#", description: "Things worth keeping" },
  { label: "Moods", icon: "◎", href: "#", description: "How we're all doing" },
];

export default function ArchiveHome() {
  const answeredCount = friends.filter((f) => f.answered).length;
  const allAnswered = answeredCount === friends.length;

  return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#f5f0eb" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg overflow-hidden">
            <Image src="/icon.png" alt="Romman" fill className="object-cover" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>our archive</p>
            <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#1a1210" }}>Romman</h1>
          </div>
        </div>
        {/* Shared pomegranate count */}
        <div className="flex items-center gap-2">
          <div className="relative w-6 h-6">
            <Image
              src="/images/Gemini_Generated_Image_366i9e366i9e366i (1).png"
              alt="pomegranate"
              fill
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <span className="text-[13px] font-semibold" style={{ color: "#8b1a2a" }}>1</span>
        </div>
      </header>

      {/* Today's shared question */}
      <div className="px-6 mb-6">
        <div className="relative rounded-2xl overflow-hidden p-6" style={{ background: "#8b1a2a" }}>
          <Image
            src="/images/bc192dcdcdef754f8d040801ffb12334.jpg"
            alt=""
            fill
            className="object-cover object-top opacity-25"
          />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "#f5d0c0" }}>this week's question</p>
            <p className="text-[20px] leading-snug font-light mb-5" style={{ color: "#f5f0eb", fontStyle: "italic" }}>
              What's something small that brought you joy this week?
            </p>

            {/* Who's answered */}
            <div className="flex items-center gap-3 mb-4">
              {friends.map((f) => (
                <div key={f.name} className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold"
                    style={{
                      background: f.answered ? "#f5f0eb" : "rgba(245,240,235,0.25)",
                      color: f.answered ? "#8b1a2a" : "rgba(245,240,235,0.6)",
                      border: f.answered ? "none" : "1px solid rgba(245,240,235,0.3)",
                    }}
                  >
                    {f.initial}
                  </div>
                </div>
              ))}
              <p className="text-[11px]" style={{ color: "rgba(245,240,235,0.6)" }}>
                {answeredCount}/{friends.length} answered
              </p>
            </div>

            <button
              className="rounded-full px-5 py-2 text-[11px] tracking-[0.15em] uppercase"
              style={{ background: "rgba(245,240,235,0.2)", color: "#f5f0eb", border: "1px solid rgba(245,240,235,0.35)" }}
            >
              {allAnswered ? "Read all answers" : "Add your answer"}
            </button>
          </div>
        </div>
      </div>

      {/* Pomegranate earned callout */}
      {allAnswered && (
        <div className="px-6 mb-6">
          <div className="rounded-2xl px-5 py-4 flex items-center gap-4" style={{ background: "#ede8e2" }}>
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/images/Gemini_Generated_Image_y431yby431yby431 (1).png"
                alt="pomegranate"
                fill
                className="object-contain"
                style={{ mixBlendMode: "multiply" }}
              />
            </div>
            <p className="text-[13px] leading-relaxed" style={{ color: "#6b4a3a" }}>
              All three answered — you've earned a pomegranate. 🎉
            </p>
          </div>
        </div>
      )}

      {/* Archive sections */}
      <div className="px-6 mb-6">
        <p className="text-[10px] uppercase tracking-[0.25em] mb-4" style={{ color: "#9b8070" }}>archive</p>
        <div className="grid grid-cols-2 gap-3">
          {sections.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl p-5 flex flex-col gap-3 transition-opacity active:opacity-70"
              style={{ background: "#ede8e2" }}
            >
              <span className="text-[18px]" style={{ color: "#8b1a2a" }}>{s.icon}</span>
              <div>
                <p className="text-[15px] font-semibold" style={{ color: "#1a1210" }}>{s.label}</p>
                <p className="text-[12px]" style={{ color: "#9b8070" }}>{s.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pomegranate progress */}
      <div className="px-6">
        <p className="text-[10px] uppercase tracking-[0.25em] mb-3" style={{ color: "#9b8070" }}>collected together</p>
        <div className="flex gap-3 items-center">
          <div className="relative w-8 h-8 flex-shrink-0">
            <Image
              src="/images/Gemini_Generated_Image_366i9e366i9e366i (1).png"
              alt="pomegranate"
              fill
              className="object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <div className="flex-1 rounded-full h-1.5 overflow-hidden" style={{ background: "#d4c8b8" }}>
            <div className="h-full rounded-full" style={{ background: "#8b1a2a", width: "1.9%" }} />
          </div>
          <p className="text-[11px] flex-shrink-0" style={{ color: "#9b8070" }}>1 of 52</p>
        </div>
      </div>

    </div>
  );
}
