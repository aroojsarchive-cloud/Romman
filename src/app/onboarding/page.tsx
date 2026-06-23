"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Onboarding() {
  const [collected, setCollected] = useState(false);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-8 overflow-hidden">
      {/* Floral plate on marble — image 1 */}
      <Image
        src="/images/20e7a19dba34a355648db65945c73bbb.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-[#f8f4f0]/82" />

      <div className="relative z-10 text-center max-w-sm">
        {!collected ? (
          <>
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-8 font-[family-name:var(--font-open-sans)]"
              style={{ color: "#8b1a2a" }}
            >
              your first pomegranate
            </p>

            {/* Whole pomegranate — tap to open */}
            <button
              onClick={() => setCollected(true)}
              className="mx-auto mb-8 block transition-transform hover:scale-105 active:scale-95"
              aria-label="Collect your pomegranate"
            >
              <div className="relative w-[320px] h-[320px]">
                <Image
                  src="/images/Gemini_Generated_Image_366i9e366i9e366i (1).png"
                  alt="pomegranate"
                  fill
                  className="object-contain scale-150"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            </button>

            <h2
              className="text-[32px] font-[family-name:var(--font-open-sans)] font-semibold mb-3"
              style={{ color: "#1a1210" }}
            >
              Tap to collect
            </h2>
            <p
              className="text-[16px] leading-relaxed font-[family-name:var(--font-open-sans)] mb-2"
              style={{ color: "#6b4a3a" }}
            >
              Every time you show up for yourself — reading, reflecting,
              reaching out — you earn a pomegranate.
            </p>
            <p
              className="text-[15px] font-[family-name:var(--font-open-sans)]"
              style={{ color: "#9b8070", fontStyle: "italic" }}
            >
              This one is just for arriving.
            </p>
          </>
        ) : (
          <>
            <p
              className="text-[10px] uppercase tracking-[0.3em] mb-8 font-[family-name:var(--font-open-sans)]"
              style={{ color: "#8b1a2a" }}
            >
              collected
            </p>

            {/* Collected state — open pomegranate with glow */}
            <div className="mx-auto mb-8 flex items-center justify-center relative">
              <div
                className="absolute w-56 h-56 rounded-full blur-3xl opacity-40"
                style={{ background: "#c43040" }}
              />
              <div className="relative w-[320px] h-[260px]">
                <Image
                  src="/images/Gemini_Generated_Image_y431yby431yby431 (1).png"
                  alt="pomegranate open"
                  fill
                  className="object-contain"
                  style={{ mixBlendMode: "multiply" }}
                />
              </div>
            </div>

            <h2
              className="text-[36px] font-[family-name:var(--font-open-sans)] font-semibold mb-3"
              style={{ color: "#1a1210" }}
            >
              1 pomegranate
            </h2>
            <p
              className="text-[17px] leading-relaxed font-[family-name:var(--font-open-sans)] mb-10"
              style={{ color: "#6b4a3a", fontStyle: "italic" }}
            >
              The archive is open.
            </p>

            <Link
              href="/home"
              className="block w-full rounded-full py-4 text-center text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-open-sans)] transition-all hover:opacity-90"
              style={{ background: "#c43040", color: "#f5f0ec" }}
            >
              Enter Archive
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
