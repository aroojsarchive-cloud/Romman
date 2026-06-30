"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Memory = {
  id: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
  profiles?: { initial: string; name: string };
};

const byColor: Record<string, string> = {
  S: "#8b1a2a",
  H: "#c4a06a",
  A: "#6b4a3a",
};

export default function Memories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Memory | null>(null);
  const [holdMemory, setHoldMemory] = useState<Memory | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
    loadMemories();
  }, []);

  async function loadMemories() {
    const { data } = await supabase
      .from("memories")
      .select("*, profiles(initial, name)")
      .order("created_at", { ascending: false });
    if (data) setMemories(data as Memory[]);
  }

  function getImageUrl(path: string) {
    return supabase.storage.from("memories").getPublicUrl(path).data.publicUrl;
  }

  async function handleDelete(mem: Memory) {
    if (mem.user_id !== userId) return;
    await supabase.storage.from("memories").remove([mem.storage_path]);
    await supabase.from("memories").delete().eq("id", mem.id);
    setHoldMemory(null);
    loadMemories();
  }

  async function handleUpload(files: FileList) {
    if (!userId) { alert("Not signed in."); return; }
    if (files.length === 0) return;
    setUploading(true);
    setUploadProgress({ done: 0, total: files.length });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path = `gallery/${userId}-${Date.now()}-${i}.${ext}`;

      const { error: storageError } = await supabase.storage.from("memories").upload(path, file);
      if (storageError) {
        alert(`Photo ${i + 1} failed to upload: ${storageError.message}`);
        setUploadProgress({ done: i + 1, total: files.length });
        continue;
      }

      const { error: dbError } = await supabase.from("memories").insert({
        user_id: userId,
        storage_path: path,
        caption: null,
      });
      if (dbError) {
        alert(`Photo ${i + 1} saved to storage but failed to record: ${dbError.message}`);
      }

      setUploadProgress({ done: i + 1, total: files.length });
    }

    setUploading(false);
    setUploadProgress(null);
    setShowUpload(false);
    loadMemories();
  }

  return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#f0ebe3" }}>

      <header className="flex items-center justify-between px-6 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <Link href="/home" className="text-[20px]" style={{ color: "#9b8070" }}>←</Link>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>our</p>
            <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#1a1210" }}>Memories</h1>
          </div>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[20px]"
          style={{ background: "#8b1a2a", color: "#f5f0eb" }}
        >
          +
        </button>
      </header>

      {memories.length === 0 && !uploading && (
        <div className="flex-1 flex items-center justify-center px-8 text-center">
          <p className="text-[16px]" style={{ color: "#9b8070", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            nothing here yet — add your first memory
          </p>
        </div>
      )}

      {/* Gallery grid */}
      <div className="px-5 grid grid-cols-2 gap-5">
        {memories.map((mem) => (
          <div
            key={mem.id}
            className="flex flex-col items-center cursor-pointer active:opacity-80"
            onMouseDown={() => { holdTimer.current = setTimeout(() => setHoldMemory(mem), 500); }}
            onMouseUp={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
            onTouchStart={() => { holdTimer.current = setTimeout(() => setHoldMemory(mem), 500); }}
            onTouchEnd={() => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
            onClick={() => { if (!holdMemory) setSelected(mem); }}
          >
            <div className="w-full" style={{
              background: "#f8f4ee",
              padding: "8px",
              paddingBottom: "28px",
              outline: "1px solid #d4c8b0",
              boxShadow: "0 4px 20px rgba(26,18,16,0.12)",
            }}>
              <img src={getImageUrl(mem.storage_path)} alt="" className="w-full object-cover" />
            </div>
          </div>
        ))}
      </div>

      {/* Long-press delete overlay */}
      {holdMemory && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8"
          style={{ background: "rgba(26,18,16,0.7)" }}
          onClick={() => setHoldMemory(null)}
        >
          <div
            className="rounded-3xl p-6 flex flex-col gap-3 w-full max-w-xs"
            style={{ background: "#f5f0eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full aspect-square overflow-hidden rounded-xl mb-1">
              <img src={getImageUrl(holdMemory.storage_path)} alt="" className="w-full h-full object-cover" />
            </div>
            {holdMemory.user_id === userId ? (
              <button
                onClick={() => handleDelete(holdMemory)}
                className="w-full rounded-full py-3.5 text-[11px] tracking-[0.2em] uppercase"
                style={{ background: "#c43030", color: "#f5f0eb" }}
              >
                delete
              </button>
            ) : (
              <p className="text-center text-[12px]" style={{ color: "#9b8070" }}>
                you can only delete your own photos
              </p>
            )}
            <button
              onClick={() => setHoldMemory(null)}
              className="text-[12px] text-center"
              style={{ color: "#9b8070" }}
            >
              cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload sheet */}
      {showUpload && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end"
          style={{ background: "rgba(26,18,16,0.5)" }}
          onClick={() => !uploading && setShowUpload(false)}
        >
          <div
            className="rounded-t-3xl p-8 flex flex-col gap-4"
            style={{ background: "#f5f0eb" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>
              add memories
            </p>

            {uploadProgress ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <p className="text-[14px]" style={{ color: "#1a1210", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                  uploading {uploadProgress.done} of {uploadProgress.total}…
                </p>
                <div className="w-full rounded-full h-1.5 overflow-hidden" style={{ background: "#e8e0d5" }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ background: "#8b1a2a", width: `${(uploadProgress.done / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="relative w-full">
                <button
                  className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase"
                  style={{ background: "#8b1a2a", color: "#f5f0eb" }}
                >
                  choose photos
                </button>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => { if (e.target.files?.length) handleUpload(e.target.files); }}
                />
              </div>
            )}

            {!uploading && (
              <button
                onClick={() => setShowUpload(false)}
                className="text-[12px] text-center"
                style={{ color: "#9b8070" }}
              >
                cancel
              </button>
            )}
          </div>
        </div>
      )}

      {/* Full screen view */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
          style={{ background: "rgba(26,18,16,0.92)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="p-3 pb-10 shadow-xl w-full"
            style={{ background: "#faf7f2", maxWidth: 320 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={getImageUrl(selected.storage_path)} alt="" className="w-full object-cover" />
            <div className="flex items-center justify-center gap-2 mt-4">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold"
                style={{ background: byColor[selected.profiles?.initial ?? ""] ?? "#8b1a2a", color: "#f5f0eb" }}
              >
                {selected.profiles?.initial ?? "?"}
              </div>
              <p className="text-[11px]" style={{ color: "#9b8070" }}>{selected.profiles?.name ?? ""}</p>
            </div>
          </div>
          <button className="mt-6 text-[12px] uppercase tracking-wide" style={{ color: "rgba(245,240,235,0.4)" }}>
            close
          </button>
        </div>
      )}
    </div>
  );
}
