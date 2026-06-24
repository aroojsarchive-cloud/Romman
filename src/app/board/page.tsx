"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Pin = {
  id: string;
  type: "image" | "link" | "note";
  storage_path: string | null;
  url: string | null;
  link_title: string | null;
  caption: string | null;
  created_at: string;
  user_id: string;
  position: number;
  profiles?: { initial: string; name: string };
};

const byColor: Record<string, string> = {
  S: "#8b1a2a",
  H: "#c4a06a",
  A: "#6b4a3a",
};

function SortablePinCard({ pin, onTap, getImageUrl }: {
  pin: Pin;
  onTap: (p: Pin) => void;
  getImageUrl: (path: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: pin.id });
  const initial = pin.profiles?.initial ?? "?";

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
      }}
      {...attributes}
      {...listeners}
      className="w-full rounded-2xl overflow-hidden relative cursor-grab active:cursor-grabbing"
      onClick={() => !isDragging && onTap(pin)}
    >
      <div className="w-full rounded-2xl overflow-hidden relative" style={{ background: pin.type === "note" ? "#ede8e2" : "#d4c8b8" }}>
        {pin.type === "image" && pin.storage_path && (
          <img src={getImageUrl(pin.storage_path)} alt="" className="w-full object-cover rounded-2xl" />
        )}
        {pin.type === "link" && (
          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wide mb-1" style={{ color: "#9b8070" }}>link</p>
            <p className="text-[13px] font-semibold leading-snug" style={{ color: "#1a1210" }}>{pin.link_title || pin.url}</p>
            {pin.caption && <p className="text-[11px] mt-1" style={{ color: "#6b4a3a" }}>{pin.caption}</p>}
          </div>
        )}
        {pin.type === "note" && (
          <div className="p-4">
            <p className="text-[13px] leading-relaxed" style={{ color: "#6b4a3a", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
              {pin.caption}
            </p>
          </div>
        )}
        {pin.caption && pin.type === "image" && (
          <div className="px-3 py-2">
            <p className="text-[11px]" style={{ color: "#6b4a3a" }}>{pin.caption}</p>
          </div>
        )}
        <div className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold"
          style={{ background: byColor[initial] ?? "#8b1a2a", color: "#f5f0eb" }}>
          {initial}
        </div>
      </div>
    </div>
  );
}

export default function Board() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [selected, setSelected] = useState<Pin | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<"image" | "link" | "note" | null>(null);
  const [caption, setCaption] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  useEffect(() => {
    loadPins();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function loadPins() {
    const { data } = await supabase
      .from("pins")
      .select("*, profiles(initial, name)")
      .order("position", { ascending: true });
    if (data) setPins(data as Pin[]);
  }

  function getImageUrl(path: string) {
    return supabase.storage.from("pins").getPublicUrl(path).data.publicUrl;
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = pins.findIndex((p) => p.id === active.id);
    const newIndex = pins.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(pins, oldIndex, newIndex);
    setPins(reordered);
    await Promise.all(
      reordered.map((pin, i) =>
        supabase.from("pins").update({ position: i }).eq("id", pin.id)
      )
    );
  }

  async function handleImageUpload(file: File) {
    if (!userId) { alert("Please sign in to add to the board."); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${userId}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("pins").upload(path, file);
    if (uploadError) { alert("Upload error: " + uploadError.message); setUploading(false); return; }
    const { error: insertError } = await supabase.from("pins").insert({ user_id: userId, type: "image", storage_path: path, caption: caption || null, position: pins.length });
    if (insertError) { alert("Save error: " + insertError.message); setUploading(false); return; }
    setCaption(""); setAddType(null); setShowAdd(false); setUploading(false);
    loadPins();
  }

  async function handleAddLink() {
    if (!linkUrl) return;
    if (!userId) { alert("Please sign in to add to the board."); return; }
    setUploading(true);
    await supabase.from("pins").insert({ user_id: userId, type: "link", url: linkUrl, link_title: linkTitle || linkUrl, caption: caption || null, position: pins.length });
    setLinkUrl(""); setLinkTitle(""); setCaption(""); setAddType(null); setShowAdd(false); setUploading(false);
    loadPins();
  }

  async function handleAddNote() {
    if (!noteText) return;
    if (!userId) { alert("Please sign in to add to the board."); return; }
    setUploading(true);
    await supabase.from("pins").insert({ user_id: userId, type: "note", caption: noteText, position: pins.length });
    setNoteText(""); setAddType(null); setShowAdd(false); setUploading(false);
    loadPins();
  }

  async function handleDelete(pin: Pin) {
    if (pin.user_id !== userId) return;
    if (pin.storage_path) await supabase.storage.from("pins").remove([pin.storage_path]);
    await supabase.from("pins").delete().eq("id", pin.id);
    setSelected(null);
    loadPins();
  }

  const left = pins.filter((_, i) => i % 2 === 0);
  const right = pins.filter((_, i) => i % 2 !== 0);

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "#f5f0eb" }}>
      <Image src="/images/board.jpg" alt="" fill className="object-cover object-center" priority />

      <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-[20px]" style={{ color: "#9b8070" }}>←</Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>shared</p>
            <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#1a1210" }}>Pinned</h1>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[20px] font-light"
          style={{ background: "#8b1a2a", color: "#f5f0eb" }}
        >
          +
        </button>
      </header>

      {pins.length === 0 && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
          <p className="text-[16px]" style={{ color: "#9b8070", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            nothing pinned yet — be the first
          </p>
        </div>
      )}

      {pins.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={pins.map((p) => p.id)} strategy={rectSortingStrategy}>
            <div className="relative z-10 px-4 pb-24 flex gap-3">
              <div className="flex-1 flex flex-col gap-3">
                {left.map((pin) => (
                  <SortablePinCard key={pin.id} pin={pin} onTap={setSelected} getImageUrl={getImageUrl} />
                ))}
              </div>
              <div className="flex-1 flex flex-col gap-3 mt-6">
                {right.map((pin) => (
                  <SortablePinCard key={pin.id} pin={pin} onTap={setSelected} getImageUrl={getImageUrl} />
                ))}
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Full screen pin view */}
      {selected && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "rgba(26,18,16,0.95)" }} onClick={() => setSelected(null)}>
          <button className="absolute top-12 right-6 text-[28px]" style={{ color: "#f5f0eb" }}>×</button>
          <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4" onClick={(e) => e.stopPropagation()}>
            {selected.type === "image" && selected.storage_path && (
              <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: 340 }}>
                <Image src={getImageUrl(selected.storage_path)} alt="" fill className="object-cover" />
              </div>
            )}
            {selected.type === "note" && (
              <div className="w-full rounded-2xl p-6" style={{ background: "#ede8e2" }}>
                <p className="text-[18px] leading-relaxed" style={{ color: "#6b4a3a", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                  {selected.caption}
                </p>
              </div>
            )}
            {selected.type === "link" && (
              <div className="w-full rounded-2xl p-6" style={{ background: "#ede8e2" }}>
                <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: "#9b8070" }}>link</p>
                <p className="text-[18px] font-semibold mb-3" style={{ color: "#1a1210" }}>{selected.link_title}</p>
                {selected.url && (
                  <a href={selected.url} target="_blank" rel="noopener noreferrer" className="text-[13px] underline" style={{ color: "#8b1a2a" }}>
                    open link →
                  </a>
                )}
              </div>
            )}
            {selected.caption && selected.type !== "note" && (
              <p className="text-[15px]" style={{ color: "#f5f0eb", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                {selected.caption}
              </p>
            )}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold"
                  style={{ background: byColor[selected.profiles?.initial ?? "S"] ?? "#8b1a2a", color: "#f5f0eb" }}>
                  {selected.profiles?.initial ?? "?"}
                </div>
                <p className="text-[12px]" style={{ color: "rgba(245,240,235,0.6)" }}>
                  pinned by {selected.profiles?.name ?? "someone"}
                </p>
              </div>
              {selected.user_id === userId && (
                <button onClick={() => handleDelete(selected)} className="text-[12px] uppercase tracking-wide" style={{ color: "#c43040" }}>
                  remove
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add pin sheet */}
      {showAdd && !addType && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(26,18,16,0.5)" }} onClick={() => setShowAdd(false)}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5f0eb" }} onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>add to board</p>
            {[
              { label: "Photo or image", icon: "◈", type: "image" as const },
              { label: "Link", icon: "↗", type: "link" as const },
              { label: "Note", icon: "✦", type: "note" as const },
            ].map((opt) => (
              <button key={opt.label} onClick={() => setAddType(opt.type)}
                className="flex items-center gap-4 rounded-2xl px-5 py-4 text-left active:opacity-70"
                style={{ background: "#ede8e2" }}>
                <span className="text-[18px]" style={{ color: "#8b1a2a" }}>{opt.icon}</span>
                <span className="text-[15px] font-semibold" style={{ color: "#1a1210" }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {showAdd && addType === "image" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(26,18,16,0.5)" }}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5f0eb" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>add a caption (optional)</p>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="say something…"
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8" }} />
            <div className="relative w-full">
              <button disabled={uploading}
                className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
                style={{ background: "#c43040", color: "#f5f0eb" }}>
                {uploading ? "uploading…" : "choose photo"}
              </button>
              {!uploading && (
                <input type="file" accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]); }} />
              )}
            </div>
            <button onClick={() => { setAddType(null); setCaption(""); }} className="text-[12px] text-center" style={{ color: "#9b8070" }}>cancel</button>
          </div>
        </div>
      )}

      {showAdd && addType === "link" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(26,18,16,0.5)" }}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5f0eb" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>add a link</p>
            <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…"
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8" }} />
            <input value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="title (optional)"
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8" }} />
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="caption (optional)"
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8" }} />
            <button onClick={handleAddLink} disabled={!linkUrl || uploading}
              className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
              style={{ background: "#c43040", color: "#f5f0eb" }}>
              {uploading ? "saving…" : "pin link"}
            </button>
            <button onClick={() => { setAddType(null); setLinkUrl(""); setLinkTitle(""); setCaption(""); }}
              className="text-[12px] text-center" style={{ color: "#9b8070" }}>cancel</button>
          </div>
        </div>
      )}

      {showAdd && addType === "note" && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(26,18,16,0.5)" }}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5f0eb" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>leave a note</p>
            <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="write something…" rows={4}
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none resize-none"
              style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8", fontStyle: "italic", fontFamily: "Georgia, serif" }} />
            <button onClick={handleAddNote} disabled={!noteText || uploading}
              className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
              style={{ background: "#c43040", color: "#f5f0eb" }}>
              {uploading ? "saving…" : "pin note"}
            </button>
            <button onClick={() => { setAddType(null); setNoteText(""); }}
              className="text-[12px] text-center" style={{ color: "#9b8070" }}>cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
