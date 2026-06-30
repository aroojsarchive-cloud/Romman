import Link from "next/link";
import Image from "next/image";

export default function Welcome() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start px-0 overflow-hidden"
      style={{ background: "#f5f0eb", fontFamily: "'Georgia', serif" }}>

      {/* Top image strip */}
      <div className="relative w-full h-52 overflow-hidden">
        <Image
          src="/images/50986ae64c1d68d87e73c1a11e58150f.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(26,18,16,0.2), rgba(245,240,235,1))" }} />
      </div>

      {/* Content */}
      <div className="w-full max-w-md px-8 pb-20 -mt-6 flex flex-col">

        {/* Pomegranate mark */}
        <div className="flex justify-center mb-6">
          <div className="relative w-10 h-10">
            <Image
              src="/images/Gemini_Generated_Image_366i9e366i9e366i (1).png"
              alt="pomegranate"
              fill
              className="object-contain"
            />
          </div>
        </div>

        {/* Masthead */}
        <div className="text-center mb-10">
          <p className="text-[9px] uppercase tracking-[0.4em] mb-2" style={{ color: "#9b8070" }}>
            a gift · 30 june 2026
          </p>
          <h1 className="text-[38px] leading-none mb-3" style={{ color: "#1a1210", fontStyle: "italic", fontWeight: 400 }}>
            Romman
          </h1>
          <div className="w-10 mx-auto" style={{ borderTop: "1px solid #c4b8a8" }} />
        </div>

        {/* Opening */}
        <p className="text-[13px] uppercase tracking-[0.25em] mb-5" style={{ color: "#8b1a2a" }}>
          for Sharmin, on her 25th
        </p>

        <p className="text-[17px] leading-[1.9] mb-6" style={{ color: "#2a1810", fontStyle: "italic" }}>
          Dear Sharmin,
        </p>

        <p className="text-[16px] leading-[1.85] mb-5" style={{ color: "#2a1810" }}>
          We made you something. Not flowers, not a card you'll lose — something that lives, and grows, and holds the three of us together long after today.
        </p>

        <p className="text-[16px] leading-[1.85] mb-5" style={{ color: "#2a1810" }}>
          It's called <span style={{ fontStyle: "italic" }}>Romman</span> — named after the pomegranate, for all the things it carries: sweetness, depth, abundance, and seeds that keep giving.
        </p>

        <p className="text-[16px] leading-[1.85] mb-8" style={{ color: "#2a1810" }}>
          Inside is a space built just for us — for memories, letters, things we've collected, and a board to fill with beauty. It will grow with us, week by week, for as long as we let it.
        </p>

        {/* Divider flourish */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1" style={{ borderTop: "1px solid #d4c8b8" }} />
          <span style={{ color: "#c4b8a8", fontSize: 14 }}>✦</span>
          <div className="flex-1" style={{ borderTop: "1px solid #d4c8b8" }} />
        </div>

        {/* What's inside */}
        <p className="text-[10px] uppercase tracking-[0.3em] mb-5" style={{ color: "#9b8070" }}>what's inside</p>

        <div className="flex flex-col gap-4 mb-10">
          {[
            { name: "Memories", desc: "albums for our photos, framed like art" },
            { name: "Collected", desc: "quotes and questions, answered together" },
            { name: "Pinned", desc: "a shared moodboard for things we love" },
            { name: "Cards", desc: "something waiting for you to open" },
          ].map((s) => (
            <div key={s.name} className="flex items-start gap-4">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#8b1a2a" }} />
              <div>
                <p className="text-[15px]" style={{ color: "#1a1210", fontStyle: "italic" }}>{s.name}</p>
                <p className="text-[12px] mt-0.5" style={{ color: "#9b8070" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/signin"
          className="w-full text-center rounded-full py-4 text-[11px] uppercase tracking-[0.25em] mb-4 block"
          style={{ background: "#8b1a2a", color: "#f5f0eb" }}
        >
          Open Romman
        </Link>

        <p className="text-center text-[12px] mb-12" style={{ color: "#9b8070" }}>
          sign in with <span style={{ fontStyle: "italic" }}>sharminakthar@hotmail.com</span>
        </p>

        {/* Sign off */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1" style={{ borderTop: "1px solid #d4c8b8" }} />
          <span style={{ color: "#c4b8a8", fontSize: 14 }}>✦</span>
          <div className="flex-1" style={{ borderTop: "1px solid #d4c8b8" }} />
        </div>

        <p className="text-[16px] leading-[1.85] mb-6" style={{ color: "#2a1810" }}>
          Happy birthday. May 25 hold more than you imagined, and may we be there for all of it.
        </p>

        <p className="text-[16px] leading-[1.85] mb-1" style={{ color: "#2a1810", fontStyle: "italic" }}>
          With so much love,
        </p>
        <p className="text-[16px]" style={{ color: "#2a1810", fontStyle: "italic" }}>
          Hannah & Arooj
        </p>

        <p className="text-[15px] mt-3 text-right" style={{ color: "#8b1a2a", direction: "rtl" }}>
          في الدنيا والآخرة
        </p>

        {/* Footer */}
        <div className="mt-14 text-center">
          <p className="text-[9px] uppercase tracking-[0.3em]" style={{ color: "#c4b8a8" }}>
            romman · made for three · 2026
          </p>
        </div>
      </div>
    </div>
  );
}
