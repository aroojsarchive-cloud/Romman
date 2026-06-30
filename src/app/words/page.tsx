"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Question = {
  id: string;
  week_number: number;
  text: string;
};

type Answer = {
  id: string;
  question_id: string;
  user_id: string;
  body: string;
  created_at: string;
  profiles?: { initial: string; name: string };
};

type Quote = {
  id: string;
  user_id: string;
  text: string;
  attribution: string | null;
  created_at: string;
  profiles?: { initial: string; name: string };
};

const byColor: Record<string, string> = {
  S: "#8b1a2a",
  H: "#c4a06a",
  A: "#6b4a3a",
};

export default function Collected() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(1);

  // question answer sheet
  const [openQuestion, setOpenQuestion] = useState<Question | null>(null);
  const [showAnswerSheet, setShowAnswerSheet] = useState(false);
  const [draft, setDraft] = useState("");
  const [savingAnswer, setSavingAnswer] = useState(false);

  // quote sheet
  const [showQuoteSheet, setShowQuoteSheet] = useState(false);
  const [quoteText, setQuoteText] = useState("");
  const [quoteAttribution, setQuoteAttribution] = useState("");
  const [savingQuote, setSavingQuote] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
    loadAll();
  }, []);

  async function loadAll() {
    const [qRes, aRes] = await Promise.all([
      supabase.from("questions").select("*").order("week_number"),
      supabase.from("answers").select("*, profiles(initial, name)"),
    ]);
    if (qRes.data) {
      setQuestions(qRes.data);
      const weeksSinceStart = Math.max(1, Math.floor((Date.now() - new Date("2026-06-30").getTime()) / 604800000) + 1);
      setCurrentWeek(Math.min(weeksSinceStart, qRes.data.length || 1));
    }
    if (aRes.data) setAnswers(aRes.data as Answer[]);

    // quotes table may not exist yet — load separately so it never blocks the rest
    const quotesRes = await supabase
      .from("quotes")
      .select("*, profiles(initial, name)")
      .order("created_at", { ascending: false });
    if (quotesRes.data) setQuotes(quotesRes.data as Quote[]);
  }

  function answersFor(questionId: string) {
    return answers.filter((a) => a.question_id === questionId);
  }

  function myAnswer(questionId: string) {
    return answers.find((a) => a.question_id === questionId && a.user_id === userId);
  }

  async function handleSaveAnswer() {
    if (!userId || !draft.trim() || !openQuestion) return;
    setSavingAnswer(true);
    await supabase.from("answers").insert({ question_id: openQuestion.id, user_id: userId, body: draft.trim() });
    setDraft("");
    setShowAnswerSheet(false);
    setSavingAnswer(false);
    loadAll();
  }

  async function handleSaveQuote() {
    if (!userId || !quoteText.trim()) return;
    setSavingQuote(true);
    await supabase.from("quotes").insert({
      user_id: userId,
      text: quoteText.trim(),
      attribution: quoteAttribution.trim() || null,
    });
    setQuoteText("");
    setQuoteAttribution("");
    setShowQuoteSheet(false);
    setSavingQuote(false);
    loadAll();
  }

  async function handleDeleteQuote(id: string, ownerId: string) {
    if (ownerId !== userId) return;
    await supabase.from("quotes").delete().eq("id", id);
    loadAll();
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  const currentQ = questions.find((q) => q.week_number === currentWeek);
  const pastQuestions = questions.filter((q) => q.week_number < currentWeek).reverse();

  return (
    <div className="min-h-screen flex flex-col pb-16" style={{ background: "#f0ebe3" }}>

      <header className="flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-[20px]" style={{ color: "#9b8070" }}>←</Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>shared</p>
            <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#1a1210" }}>Collected</h1>
          </div>
        </div>
        <button
          onClick={() => setShowQuoteSheet(true)}
          className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em]"
          style={{ background: "#8b1a2a", color: "#f5f0eb" }}
        >
          + quote
        </button>
      </header>

      {/* This week's question */}
      {currentQ && (
        <div className="px-5 mb-6">
          <div className="rounded-3xl p-6" style={{ background: "#8b1a2a" }}>
            <p className="text-[9px] uppercase tracking-[0.3em] mb-4" style={{ color: "rgba(245,208,192,0.7)" }}>
              this week · {currentQ.week_number} of 52
            </p>
            <p
              className="text-[19px] leading-[1.55] mb-6"
              style={{ color: "#f5ede0", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}
            >
              {currentQ.text}
            </p>

            <div className="flex items-center gap-2 mb-5">
              {["S", "H", "A"].map((initial) => {
                const answered = answersFor(currentQ.id).some((a) => a.profiles?.initial === initial);
                return (
                  <div
                    key={initial}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold"
                    style={{
                      background: answered ? byColor[initial] : "rgba(245,235,215,0.2)",
                      color: answered ? "#f5f0eb" : "rgba(245,235,215,0.4)",
                      border: answered ? "none" : "1px solid rgba(245,235,215,0.3)",
                    }}
                  >
                    {initial}
                  </div>
                );
              })}
              <span className="text-[11px] ml-1" style={{ color: "rgba(245,235,215,0.5)" }}>
                {answersFor(currentQ.id).length} of 3 answered
              </span>
            </div>

            {myAnswer(currentQ.id) ? (
              <button
                onClick={() => setOpenQuestion(currentQ)}
                className="w-full rounded-full py-3.5 text-[11px] tracking-[0.2em] uppercase"
                style={{ background: "rgba(245,235,215,0.15)", color: "#f5ede0", border: "1px solid rgba(245,235,215,0.3)" }}
              >
                read answers
              </button>
            ) : (
              <button
                onClick={() => { setOpenQuestion(currentQ); setShowAnswerSheet(true); }}
                className="w-full rounded-full py-3.5 text-[11px] tracking-[0.2em] uppercase"
                style={{ background: "#f5ede0", color: "#8b1a2a" }}
              >
                write your answer
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quotes feed */}
      {quotes.length > 0 && (
        <div className="px-5 flex flex-col gap-3 mb-6">
          <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#9b8070" }}>quotes</p>
          {quotes.map((q) => {
            const initial = q.profiles?.initial ?? "?";
            const isOwn = q.user_id === userId;
            return (
              <div key={q.id} className="rounded-2xl px-5 py-5" style={{ background: "#e8e0d5", border: "1px solid #d4c8b8" }}>
                <p
                  className="text-[16px] leading-[1.8] mb-3"
                  style={{ color: "#2a1810", fontFamily: "Georgia, serif", fontStyle: "italic" }}
                >
                  "{q.text}"
                </p>
                {q.attribution && (
                  <p className="text-[11px] uppercase tracking-[0.15em] mb-3" style={{ color: "#9b8070" }}>
                    — {q.attribution}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold"
                      style={{ background: byColor[initial] ?? "#8b1a2a", color: "#f5f0eb" }}
                    >
                      {initial}
                    </div>
                    <span className="text-[10px]" style={{ color: "#c4b8a8" }}>{formatDate(q.created_at)}</span>
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => handleDeleteQuote(q.id, q.user_id)}
                      className="text-[10px] uppercase tracking-wide"
                      style={{ color: "#c43030" }}
                    >
                      remove
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past questions */}
      {pastQuestions.length > 0 && (
        <div className="px-5 flex flex-col gap-3">
          <p className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "#9b8070" }}>past weeks</p>
          {pastQuestions.map((q) => {
            const qAnswers = answersFor(q.id);
            return (
              <button
                key={q.id}
                onClick={() => setOpenQuestion(q)}
                className="rounded-2xl p-5 text-left active:opacity-80"
                style={{ background: "#e8e0d5", border: "1px solid #d4c8b8" }}
              >
                <p className="text-[9px] uppercase tracking-[0.2em] mb-2" style={{ color: "#9b8070" }}>week {q.week_number}</p>
                <p className="text-[15px] leading-snug mb-3" style={{ color: "#2a1810", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                  {q.text}
                </p>
                <div className="flex gap-1.5">
                  {["S", "H", "A"].map((initial) => {
                    const answered = qAnswers.some((a) => a.profiles?.initial === initial);
                    return (
                      <div
                        key={initial}
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-semibold"
                        style={{ background: answered ? byColor[initial] : "rgba(155,128,112,0.2)", color: answered ? "#f5f0eb" : "#9b8070" }}
                      >
                        {initial}
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {quotes.length === 0 && questions.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-8 text-center">
          <p className="text-[16px]" style={{ color: "#9b8070", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
            nothing collected yet —<br />add the first quote
          </p>
        </div>
      )}

      {/* Question answers overlay */}
      {openQuestion && !showAnswerSheet && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#f5f0eb" }}>
          <header className="flex items-center justify-between px-6 pt-12 pb-4">
            <button onClick={() => setOpenQuestion(null)} className="text-[20px]" style={{ color: "#9b8070" }}>←</button>
            <p className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "#9b8070" }}>week {openQuestion.week_number}</p>
            <div style={{ width: 24 }} />
          </header>
          <div className="px-6 mb-6">
            <p className="text-[20px] leading-[1.55]" style={{ color: "#1a1210", fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400 }}>
              {openQuestion.text}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-5 pb-10">
            {answersFor(openQuestion.id).length === 0 && (
              <p className="text-[15px] text-center py-8" style={{ color: "#9b8070", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                no answers yet
              </p>
            )}
            {answersFor(openQuestion.id).map((ans) => {
              const initial = ans.profiles?.initial ?? "?";
              return (
                <div key={ans.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                      style={{ background: byColor[initial] ?? "#8b1a2a", color: "#f5f0eb" }}>
                      {initial}
                    </div>
                    <span className="text-[12px] font-semibold" style={{ color: "#2a1810" }}>{ans.profiles?.name}</span>
                  </div>
                  <p className="text-[16px] leading-[1.75] pl-8" style={{ color: "#3a2820", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                    {ans.body}
                  </p>
                </div>
              );
            })}
          </div>
          {!myAnswer(openQuestion.id) && (
            <div className="px-6 pb-10">
              <button
                onClick={() => setShowAnswerSheet(true)}
                className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase"
                style={{ background: "#8b1a2a", color: "#f5f0eb" }}
              >
                write your answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Write answer sheet */}
      {showAnswerSheet && openQuestion && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(20,12,8,0.5)" }}
          onClick={() => setShowAnswerSheet(false)}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5ede0" }}
            onClick={(e) => e.stopPropagation()}>
            <p className="text-[14px] leading-snug text-center mb-1"
              style={{ color: "#6b4a3a", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
              "{openQuestion.text}"
            </p>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="your answer…"
              rows={5}
              autoFocus
              className="w-full rounded-2xl px-5 py-4 text-[16px] leading-relaxed outline-none resize-none"
              style={{ background: "#ede8df", color: "#2a1810", border: "1px solid #d4c8b8", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            />
            <button
              onClick={handleSaveAnswer}
              disabled={!draft.trim() || savingAnswer}
              className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
              style={{ background: "#8b1a2a", color: "#f5f0eb" }}
            >
              {savingAnswer ? "saving…" : "submit answer"}
            </button>
            <button onClick={() => { setShowAnswerSheet(false); setDraft(""); }}
              className="text-[12px] text-center" style={{ color: "#9b8070" }}>
              cancel
            </button>
          </div>
        </div>
      )}

      {/* Add quote sheet */}
      {showQuoteSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(20,12,8,0.5)" }}
          onClick={() => setShowQuoteSheet(false)}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5ede0" }}
            onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-1" style={{ color: "#9b8070" }}>share a quote</p>
            <textarea
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="the quote…"
              rows={4}
              autoFocus
              className="w-full rounded-2xl px-5 py-4 text-[16px] leading-relaxed outline-none resize-none"
              style={{ background: "#ede8df", color: "#2a1810", border: "1px solid #d4c8b8", fontFamily: "Georgia, serif", fontStyle: "italic" }}
            />
            <input
              value={quoteAttribution}
              onChange={(e) => setQuoteAttribution(e.target.value)}
              placeholder="who said it (optional)"
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8df", color: "#2a1810", border: "1px solid #d4c8b8" }}
            />
            <button
              onClick={handleSaveQuote}
              disabled={!quoteText.trim() || savingQuote}
              className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
              style={{ background: "#8b1a2a", color: "#f5f0eb" }}
            >
              {savingQuote ? "saving…" : "collect it"}
            </button>
            <button onClick={() => { setShowQuoteSheet(false); setQuoteText(""); setQuoteAttribution(""); }}
              className="text-[12px] text-center" style={{ color: "#9b8070" }}>
              cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
