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
    sign: "With love,\nArooj\n\nفي الدنيا والآخرة",
  },
];

function Card({ card }: { card: typeof cards[0] }) {
  const [opened, setOpened] = useState(false);

  return (
    <div className="w-full">
      {!opened ? (
        /* Envelope */
        <button
          onClick={() => setOpened(true)}
          className="w-full flex flex-col items-center active:scale-[0.98] transition-transform"
        >
          <div
            className="w-full rounded-2xl px-6 py-8 flex flex-col items-center gap-4 shadow-md"
            style={{ background: "#faf7f2", border: "1px solid #e8ddd0" }}
          >
            {/* Wax seal */}
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-[18px] font-semibold shadow-sm"
              style={{ background: card.color, color: "#f5f0eb" }}
            >
              {card.initial}
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#9b8070" }}>
                a letter for you
              </p>
              <p
                className="text-[18px]"
                style={{ color: "#1a1210", fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                from {card.from}
              </p>
            </div>
            <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#c4b8a8" }}>
              tap to open
            </p>
          </div>
        </button>
      ) : (
        /* Open card */
        <div
          className="w-full rounded-2xl px-6 py-8 shadow-md"
          style={{ background: "#faf7f2", border: "1px solid #e8ddd0" }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold mb-6"
            style={{ background: card.color, color: "#f5f0eb" }}
          >
            {card.initial}
          </div>
          {card.message.split("\n\n").map((para, i) => (
            <p
              key={i}
              className="text-[15px] leading-[1.85] mb-4"
              style={{ color: "#2a1810", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              {para}
            </p>
          ))}
          <p
            className="text-[15px] leading-relaxed mt-6 whitespace-pre-line"
            style={{ color: "#2a1810", fontFamily: "Georgia, serif", fontStyle: "italic" }}
          >
            {card.sign}
          </p>
        </div>
      )}
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
      <div className="absolute inset-0" style={{ background: "rgba(245,240,236,0.82)" }} />

      <header className="relative z-10 flex items-center gap-3 px-6 pt-12 pb-6">
        <Link href="/home" className="text-[20px]" style={{ color: "#9b8070" }}>←</Link>
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>for you</p>
          <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#1a1210" }}>Letters for Sharmin</h1>
        </div>
      </header>

      <div className="relative z-10 flex flex-col gap-5 px-5">
        {cards.map((card) => (
          <Card key={card.from} card={card} />
        ))}
      </div>
    </div>
  );
}
