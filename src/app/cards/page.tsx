"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    from: "Hannah",
    initial: "H",
    color: "#8b1a2a",
    message: `To Sharmin,

Happy birthday!! Thank you for gracing the world with your existence.

Getting to be your friend and sister over the past six years has been an absolute honour and privilege. You are nothing but a kind, supportive and compassionate woman who continues to support, strengthen and guide every soul you come across. Watching you grow to be the grounded, intelligent, God Conscious and ambitious woman that you are today has been beautiful to witness and be inspired by.

May our friendship continue to strengthen. May Allah SWT protect you always and fill you with love, light and abundant peace.

Too many more memories together in this life and the next, happy 25th x`,
    sign: "Love,\nHannah / Hani / Trex",
    arabic: null,
  },
  {
    from: "Arooj",
    initial: "A",
    color: "#6b4a3a",
    message: `Dear Sharmin,

Words will never do justice to what you are — to how freely you love, how quietly you give, how wholly you show up.

I never knew conversation could heal until I met you. I never knew what leadership rooted in tenderness looked like until I witnessed it in you. You have stirred something good in so many of us, and I ask Allah to accept it all and let it weigh heavy on your scale of good deeds.

Your 25th is special — so you get a mad little web app inspired by pomegranates, built for three, full of memories still to be made — because it all started with a scrapbook and four words that we carry: buy yourself some flowers.

Happy 25th, habibti. Here's to everything that has been and everything yet to come, inshaaAllah.`,
    sign: "With love,\nArooj",
    arabic: "في الدنيا والآخرة",
  },
];

function Envelope({ card }: { card: typeof cards[0] }) {
  const [state, setState] = useState<"closed" | "opening" | "open">("closed");

  function handleTap() {
    if (state === "closed") {
      setState("opening");
      setTimeout(() => setState("open"), 600);
    }
  }

  return (
    <div className="w-full flex flex-col items-center">
      {state !== "open" ? (
        <button onClick={handleTap} className="w-full" style={{ perspective: "1000px" }}>
          {/* Envelope body */}
          <div className="relative w-full" style={{ paddingTop: "65%" }}>
            {/* Back of envelope */}
            <div className="absolute inset-0 rounded-lg shadow-lg overflow-hidden"
              style={{ background: "#f0e8d8", border: "1px solid #d4c4a8" }}>

              {/* Bottom triangle fold lines */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 65" preserveAspectRatio="none">
                <line x1="0" y1="65" x2="50" y2="35" stroke="#d4c4a8" strokeWidth="0.5" />
                <line x1="100" y1="65" x2="50" y2="35" stroke="#d4c4a8" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="50" y2="35" stroke="#d4c4a8" strokeWidth="0.5" />
                <line x1="100" y1="0" x2="50" y2="35" stroke="#d4c4a8" strokeWidth="0.5" />
              </svg>

              {/* Flap */}
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  transformOrigin: "top center",
                  transform: state === "opening" ? "rotateX(-180deg)" : "rotateX(0deg)",
                  transition: "transform 0.55s ease-in-out",
                  zIndex: 2,
                }}
              >
                <svg viewBox="0 0 100 42" className="w-full" style={{ display: "block" }}>
                  <polygon points="0,0 100,0 50,42" fill="#e8dcc8" stroke="#d4c4a8" strokeWidth="0.5" />
                </svg>
              </div>

              {/* Wax seal */}
              <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 3 }}>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-semibold shadow-md"
                  style={{
                    background: card.color,
                    color: "#f5f0eb",
                    border: "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  {card.initial}
                </div>
              </div>
            </div>
          </div>

          {/* Label */}
          <div className="mt-3 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>from {card.from}</p>
            <p className="text-[12px] mt-1" style={{ color: "#c4b8a8", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
              tap to open
            </p>
          </div>
        </button>
      ) : (
        /* Open card */
        <div
          className="w-full rounded-2xl shadow-lg overflow-hidden"
          style={{
            background: "#faf6f0",
            border: "1px solid #e0d4c0",
            animation: "slideUp 0.4s ease-out",
          }}
        >
          {/* Card header stripe */}
          <div className="h-1.5 w-full" style={{ background: card.color }} />

          <div className="px-7 py-8">
            {/* Seal */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold mb-6"
              style={{ background: card.color, color: "#f5f0eb" }}
            >
              {card.initial}
            </div>

            {card.message.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="text-[15px] leading-[1.9] mb-5"
                style={{ color: "#2a1810", fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                {para}
              </p>
            ))}

            {/* Divider */}
            <div className="my-6" style={{ borderTop: "1px solid #e0d4c0" }} />

            <p
              className="text-[15px] leading-relaxed whitespace-pre-line"
              style={{ color: "#2a1810", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              {card.sign}
            </p>

            {card.arabic && (
              <p
                className="text-[18px] mt-4 text-right"
                style={{ color: card.color, fontFamily: "Georgia, serif", direction: "rtl" }}
              >
                {card.arabic}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default function Cards() {
  return (
    <div className="relative min-h-screen flex flex-col pb-16">
      <Image
        src="/images/50986ae64c1d68d87e73c1a11e58150f.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0" style={{ background: "rgba(245,240,236,0.85)" }} />

      <header className="relative z-10 flex items-center gap-3 px-6 pt-12 pb-6">
        <Link href="/home" className="text-[20px]" style={{ color: "#9b8070" }}>←</Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>for you</p>
          <h1
            className="text-[20px] leading-none"
            style={{ color: "#1a1210", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
          >
            Letters for Sharmin
          </h1>
        </div>
      </header>

      <div className="relative z-10 flex flex-col gap-8 px-6">
        {cards.map((card) => (
          <Envelope key={card.from} card={card} />
        ))}
      </div>
    </div>
  );
}
