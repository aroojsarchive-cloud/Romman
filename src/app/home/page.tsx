"use client";

import Image from "next/image";
import Link from "next/link";

const friends = [
  { name: "Sharmin", initial: "S", answered: true },
  { name: "H", initial: "H", answered: false },
  { name: "Arooj", initial: "A", answered: false },
];

const quotes = [
  { text: "The heart is like a mirror. If you do not polish it, the rust will cover it.", author: "Imam Al-Ghazali" },
  { text: "Patience is of two kinds: patience over what pains you, and patience against what you covet.", author: "Imam Al-Ghazali" },
  { text: "Know that the knowledge of self is the key to the knowledge of God.", author: "Imam Al-Ghazali" },
  { text: "The tongue is like a lion. If you let it loose, it will wound someone.", author: "Imam Al-Ghazali" },
  { text: "He who knows himself knows his Lord.", author: "Imam Al-Ghazali" },
  { text: "The greatest form of worship is thinking and reflecting.", author: "Imam Al-Ghazali" },
  { text: "Declare your jihad on thirteen enemies you cannot see — ego, arrogance, conceit, selfishness, greed, lust, intolerance, anger, lying, cheating, gossiping, and slandering.", author: "Imam Al-Ghazali" },
  { text: "If you see that your heart is attached to something of this world, know that the love of that thing has filled a space that was meant for Allah.", author: "Imam Al-Ghazali" },
  { text: "Do not be a slave to others when Allah has created you free.", author: "Imam Al-Shafi'ee" },
  { text: "The one who advises his brother secretly has sincerely advised him. The one who advises him openly has embarrassed him.", author: "Imam Al-Shafi'ee" },
  { text: "Tell me your companion and I will tell you who you are.", author: "Imam Al-Shafi'ee" },
  { text: "How can I be happy when I do not know if my past deeds have been accepted?", author: "Imam Al-Shafi'ee" },
  { text: "The more I learn, the more I realise how little I know.", author: "Imam Al-Shafi'ee" },
  { text: "If you fear loneliness, do not befriend the world, for the world is the loneliest companion.", author: "Imam Al-Shafi'ee" },
  { text: "Be in this world as if you are a stranger or a traveller.", author: "Imam Al-Shafi'ee" },
  { text: "Whoever wants the world to be right for him, let him put right what is between him and Allah.", author: "Imam Al-Shafi'ee" },
  { text: "The medicine of the heart is in five things: reading the Quran with reflection, emptying the stomach, night prayer, supplication at dawn, and keeping company with the righteous.", author: "Imam Al-Ghazali" },
  { text: "Solitude is better than the company of those who do not remind you of Allah.", author: "Imam Al-Ghazali" },
  { text: "A man who claims to love Allah while not guarding what Allah has prohibited is misguided in his claim.", author: "Imam Al-Ghazali" },
  { text: "The world is a bridge — pass over it, do not build upon it.", author: "Imam Al-Ghazali" },
  { text: "Your heart will not find tranquillity until it empties itself of everything other than Allah.", author: "Imam Al-Ghazali" },
  { text: "Silence is an ocean. Speech is a river. When the ocean is looking for you, do not go to the river.", author: "Imam Al-Balkhi" },
  { text: "Health is of two kinds — health of the body and health of the soul. The soul's health is in its nearness to its Creator.", author: "Imam Al-Balkhi" },
  { text: "Sorrow and worry are the roots of most bodily illness. Guard your inner world and your body will follow.", author: "Imam Al-Balkhi" },
  { text: "The one who knows the self will not be deceived by the world.", author: "Imam Al-Balkhi" },
  { text: "Beware of overthinking, for it is a thief that robs you of the present moment.", author: "Imam Al-Balkhi" },
  { text: "Joy that comes from within is the only joy that lasts.", author: "Imam Al-Balkhi" },
  { text: "The person who does not reflect on their own character will never correct it.", author: "Imam Al-Balkhi" },
  { text: "Do not grieve over what has passed. What was written was always going to reach you.", author: "Imam Al-Ghazali" },
  { text: "Gratitude for the abundance you have received is the best insurance that the abundance will continue.", author: "Imam Al-Ghazali" },
  { text: "Whoever is offered sincerity and rejects it has been offered salvation and refused it.", author: "Imam Al-Shafi'ee" },
  { text: "Lower your desires, and you will see the majesty of what is eternal.", author: "Imam Al-Ghazali" },
  { text: "Let not your tongue mention the shame of another, for you yourself are covered in sins.", author: "Imam Al-Shafi'ee" },
  { text: "The heart that is full of gratitude has no room for envy.", author: "Imam Al-Ghazali" },
  { text: "Do not let your difficulties fill you with anxiety. After all, it is only in the darkest nights that stars shine the brightest.", author: "Imam Al-Shafi'ee" },
  { text: "Renew your heart each morning, for the heart is a vessel that must be emptied before it can be filled.", author: "Imam Al-Ghazali" },
  { text: "The wise person does not grieve over what they have lost, but gives thanks for what remains.", author: "Imam Al-Balkhi" },
  { text: "Your soul's ease comes when you align your will with the will of your Creator.", author: "Imam Al-Ghazali" },
  { text: "Three signs of a pure heart: it does not celebrate another's misfortune, it does not envy another's blessings, and it acts the same whether seen or unseen.", author: "Imam Al-Ghazali" },
  { text: "Speak only when your words are more beautiful than silence.", author: "Imam Al-Shafi'ee" },
  { text: "Whoever loves for Allah and hates for Allah, gives for Allah and withholds for Allah — then his faith is complete.", author: "Imam Al-Ghazali" },
  { text: "The soul that is at peace with its Lord fears nothing and grieves over nothing.", author: "Imam Al-Ghazali" },
  { text: "A kind word is a form of charity.", author: "Imam Al-Ghazali" },
  { text: "When you wake each morning, ask yourself: what have I done for my soul today?", author: "Imam Al-Balkhi" },
  { text: "The greatest distance you will ever travel is from your head to your heart.", author: "Imam Al-Ghazali" },
  { text: "Be gentle with yourself. You are a child of the universe, no less than the trees and the stars.", author: "Imam Al-Balkhi" },
  { text: "Patience is not the absence of feeling, it is the choice to trust in what you cannot yet see.", author: "Imam Al-Ghazali" },
  { text: "There is no night that does not end, and no sorrow that does not pass.", author: "Imam Al-Shafi'ee" },
  { text: "Real knowledge is to know that you are bound to Allah and free from everything else.", author: "Imam Al-Ghazali" },
  { text: "The most generous person is one who fulfils what Allah has asked of them.", author: "Imam Al-Shafi'ee" },
  { text: "Time is your most precious gift. Spend it with intention, and it will spend itself for you.", author: "Imam Al-Balkhi" },
  { text: "If you are walking towards Allah, run. If you are running, fly.", author: "Imam Al-Ghazali" },
];

const sections = [
  { label: "Memories", sub: "photos & moments", href: "/memories" },
  { label: "Words", sub: "questions & answers", href: "/words" },
  { label: "Board", sub: "our moodboard", href: "/board" },
  { label: "Notes", sub: "for each other", href: "/notes" },
];

export default function ArchiveHome() {
  const answeredCount = friends.filter((f) => f.answered).length;
  const week = Math.floor((Date.now() - new Date("2026-06-30").getTime()) / 604800000) + 1;
  const quote = quotes[Math.max(0, week - 1) % quotes.length];

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
        {/* Quote of the week */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ background: "rgba(139,26,42,0.7)", border: "1px solid rgba(196,64,48,0.3)", backdropFilter: "blur(4px)" }}
        >
          <p className="text-[9px] uppercase tracking-[0.2em] mb-3" style={{ color: "#f5d0c0" }}>reflection</p>
          <p
            className="text-[14px] leading-[1.65] mb-3"
            style={{ color: "#f5f0eb", fontStyle: "italic", fontFamily: "Georgia, serif" }}
          >
            "{quote.text}"
          </p>
          <p className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "rgba(245,208,192,0.6)" }}>
            — {quote.author}
          </p>
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
