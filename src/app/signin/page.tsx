"use client";

import { useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

const ALLOWED_EMAILS = [
  "aroojsarchive@gmail.com",
  "hannahabdalla@hotmail.com",
  // add Sharmin's email
];

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!ALLOWED_EMAILS.includes(email.toLowerCase().trim())) {
      setError("This app is private. Check your email address.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
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
      <div className="absolute inset-0 bg-[#f5f0ec]/70" />

      <div className="relative z-10 w-full max-w-sm bg-[#f5f0ec]/90 rounded-2xl px-8 py-10 backdrop-blur-sm text-center">
        <div className="w-10 h-10 rounded-xl overflow-hidden mx-auto mb-6 relative">
          <Image src="/icon.png" alt="Romman" fill className="object-cover" />
        </div>

        <p className="text-[10px] uppercase tracking-[0.3em] mb-2" style={{ color: "#8b1a2a" }}>
          welcome back
        </p>
        <h1 className="text-[24px] font-semibold mb-8" style={{ color: "#1a1210" }}>
          Romman
        </h1>

        {!sent ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-full px-5 py-3.5 text-[14px] text-center outline-none"
              style={{
                background: "#ede8e2",
                color: "#1a1210",
                border: "1px solid #d4c8b8",
              }}
            />
            {error && (
              <p className="text-[12px]" style={{ color: "#c43040" }}>{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase transition-all hover:opacity-90 disabled:opacity-50"
              style={{ background: "#c43040", color: "#f5f0ec" }}
            >
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>
        ) : (
          <div>
            <p className="text-[32px] mb-4">✉️</p>
            <p className="text-[16px] leading-relaxed" style={{ color: "#6b4a3a" }}>
              Check your email — a sign-in link is waiting for you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
