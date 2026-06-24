"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

type Note = {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: { initial: string; name: string };
};

const byColor: Record<string, string> = {
  S: "#8b1a2a",
  H: "#c4a06a",
  A: "#6b4a3a",
};

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showWrite, setShowWrite] = useState(false);
  const [body, setBody] = useState("");
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    loadNotes();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function loadNotes() {
    const { data } = await supabase
      .from("notes")
      .select("*, profiles(initial, name)")
      .order("created_at", { ascending: false });
    if (data) setNotes(data as Note[]);
  }

  async function handleSave() {
    if (!userId || !body.trim()) return;
    setSaving(true);
    await supabase.from("notes").insert({ user_id: userId, body: body.trim() });
    setBody("");
    setShowWrite(false);
    setSaving(false);
    loadNotes();
  }

  async function handleDelete(id: string, noteUserId: string) {
    if (noteUserId !== userId) return;
    await supabase.from("notes").delete().eq("id", id);
    loadNotes();
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    });
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background */}
      <Image
        src="/images/b3ef917ae5a12172dea37ffc715ab1fd.jpg"
        alt=""
        fill
        className="object-cover object-center"
        priority
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-[20px]" style={{ color: "rgba(245,235,215,0.7)" }}>←</Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "rgba(245,235,215,0.55)" }}>for each other</p>
            <h1
              className="text-[22px] leading-none"
              style={{ color: "#f5f0eb", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
            >
              Notes
            </h1>
          </div>
        </div>
        <button
          onClick={() => setShowWrite(true)}
          className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em]"
          style={{ background: "rgba(139,26,42,0.85)", color: "#f5f0eb", border: "1px solid rgba(196,64,48,0.4)" }}
        >
          + write
        </button>
      </header>

      {/* Notes list */}
      <div className="relative z-10 flex-1 px-5 pb-24 flex flex-col gap-4 pt-2">
        {notes.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-24">
            <p
              className="text-[18px] leading-relaxed"
              style={{ color: "rgba(245,235,215,0.55)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            >
              nothing written yet —<br />leave the first note
            </p>
          </div>
        )}

        {notes.map((note) => {
          const initial = note.profiles?.initial ?? "?";
          const color = byColor[initial] ?? "#8b1a2a";
          const isOwn = note.user_id === userId;

          return (
            <div
              key={note.id}
              className="rounded-2xl px-5 py-5 relative"
              style={{
                background: "rgba(245,235,215,0.1)",
                border: "1px solid rgba(245,235,215,0.18)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Author dot */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                  style={{ background: color, color: "#f5f0eb" }}
                >
                  {initial}
                </div>
                <span className="text-[11px]" style={{ color: "rgba(245,235,215,0.5)" }}>
                  {note.profiles?.name ?? ""}
                </span>
                <span className="text-[10px] ml-auto" style={{ color: "rgba(245,235,215,0.35)" }}>
                  {formatDate(note.created_at)}
                </span>
              </div>

              {/* Body */}
              <p
                className="text-[16px] leading-[1.75]"
                style={{ color: "#f5ede0", fontFamily: "Georgia, serif", fontStyle: "italic" }}
              >
                {note.body}
              </p>

              {/* Delete own */}
              {isOwn && (
                <button
                  onClick={() => handleDelete(note.id, note.user_id)}
                  className="mt-3 text-[10px] uppercase tracking-wide"
                  style={{ color: "rgba(196,64,48,0.6)" }}
                >
                  remove
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Write sheet */}
      {showWrite && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: "rgba(20,12,8,0.6)" }}
          onClick={() => setShowWrite(false)}
        >
          <div
            className="rounded-t-3xl p-8 flex flex-col gap-4"
            style={{ background: "#f5ede0" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p
              className="text-[11px] uppercase tracking-[0.25em] text-center mb-1"
              style={{ color: "#9b8070" }}
            >
              leave a note
            </p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="write something…"
              rows={5}
              autoFocus
              className="w-full rounded-2xl px-5 py-4 text-[16px] leading-relaxed outline-none resize-none"
              style={{
                background: "#ede8df",
                color: "#2a1810",
                border: "1px solid #d4c8b8",
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
              }}
            />
            <button
              onClick={handleSave}
              disabled={!body.trim() || saving}
              className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
              style={{ background: "#8b1a2a", color: "#f5f0eb" }}
            >
              {saving ? "saving…" : "leave note"}
            </button>
            <button
              onClick={() => { setShowWrite(false); setBody(""); }}
              className="text-[12px] text-center"
              style={{ color: "#9b8070" }}
            >
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
