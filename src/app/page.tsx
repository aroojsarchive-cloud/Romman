"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [opened, setOpened] = useState(false);

  if (!opened) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center px-8 overflow-hidden">
        {/* Sunlit linen — image 2 */}
        <Image
          src="/images/50986ae64c1d68d87e73c1a11e58150f.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        {/* Light wash so text is legible without killing the photo */}
        <div className="absolute inset-0 bg-[#f5f0ec]/60" />

        <div className="relative text-center max-w-sm z-10 bg-[#f5f0ec]/90 rounded-2xl px-8 py-10 backdrop-blur-sm">
          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-10 font-[family-name:var(--font-open-sans)]"
            style={{ color: "#8b1a2a" }}
          >
            a gift for you
          </p>

          <h1
            className="text-[80px] leading-none font-[family-name:var(--font-open-sans)] font-light mb-1"
            style={{ color: "#1a1210", fontStyle: "italic" }}
          >
            Happy
          </h1>
          <h2
            className="text-[80px] leading-none font-[family-name:var(--font-open-sans)] font-semibold mb-12"
            style={{ color: "#c43040" }}
          >
            25th.
          </h2>

          <p
            className="text-[18px] font-[family-name:var(--font-open-sans)] mb-1"
            style={{ color: "#1a1210" }}
          >
            Dear Sharmin,
          </p>
          <p
            className="text-[18px] leading-[1.85] font-[family-name:var(--font-open-sans)] mb-14"
            style={{ color: "#2a1810" }}
          >
            here&apos;s something inspired by your pursuit of knowledge and
            self development — a digital archive for everything that has been
            and is yet to come, inshaaAllah.
          </p>

          <button
            onClick={() => setOpened(true)}
            className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-open-sans)] transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ background: "#c43040", color: "#f5f0ec" }}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-8 overflow-hidden">
      <Image
        src="/images/50986ae64c1d68d87e73c1a11e58150f.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-[#f5f0ec]/45" />

      <div className="relative text-center max-w-sm z-10">
        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-10 font-[family-name:var(--font-open-sans)]"
          style={{ color: "#8b1a2a" }}
        >
          your app
        </p>

        <h1
          className="text-[88px] leading-none font-[family-name:var(--font-open-sans)] font-light mb-2"
          style={{ color: "#c43040" }}
        >
          رمّان
        </h1>
        <h2
          className="text-[30px] font-[family-name:var(--font-open-sans)] font-semibold tracking-wide mb-4"
          style={{ color: "#1a1210" }}
        >
          Romman
        </h2>
        <p
          className="text-[13px] uppercase tracking-[0.2em] font-[family-name:var(--font-open-sans)] mb-14"
          style={{ color: "#1a1210" }}
        >
          digital archive
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/signin"
            className="rounded-full py-4 text-center text-[11px] tracking-[0.2em] uppercase font-[family-name:var(--font-open-sans)] transition-all hover:opacity-90"
            style={{ background: "#c43040", color: "#f5f0ec" }}
          >
            Begin
          </Link>
        </div>
      </div>
    </div>
  );
}
