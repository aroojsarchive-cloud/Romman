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

type Album = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  cover?: string;
  position: number;
};

function SortableAlbum({ album, index, onTap, loadMemories }: {
  album: Album;
  index: number;
  onTap: (a: Album) => void;
  loadMemories: (id: string) => void;
}) {
  const rotations = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: album.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        rotate: `${rotations[index % rotations.length]}deg`,
      }}
      {...attributes}
      {...listeners}
      className="flex flex-col cursor-grab active:cursor-grabbing"
      onClick={() => !isDragging && (onTap(album), loadMemories(album.id))}
    >
      <div className="w-full rounded-sm p-2 pb-8 shadow-sm flex flex-col" style={{ background: "#faf7f2", border: "1px solid #e8ddd0" }}>
        <div className="w-full aspect-square rounded-sm overflow-hidden mb-1" style={{ background: "#e8ddd0" }}>
          {album.cover ? (
            <img src={album.cover} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      </div>
      <p className="text-[12px] font-semibold mt-2 text-center" style={{ color: "#1a1210", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
        {album.name}
      </p>
      {album.description && (
        <p className="text-[10px] text-center" style={{ color: "#9b8070" }}>{album.description}</p>
      )}
    </div>
  );
}

type Memory = {
  id: string;
  album_id: string;
  user_id: string;
  storage_path: string;
  caption: string | null;
  taken_at: string | null;
  created_at: string;
  profiles?: { initial: string; name: string };
};

const rotations = [-2, 1.5, -1, 2.5, -1.5, 1, -2.5, 2];

export default function Memories() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showNewAlbum, setShowNewAlbum] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDesc, setAlbumDesc] = useState("");
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [caption, setCaption] = useState("");
  const [takenAt, setTakenAt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selected, setSelected] = useState<Memory | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

  async function handleAlbumDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = albums.findIndex((a) => a.id === active.id);
    const newIndex = albums.findIndex((a) => a.id === over.id);
    const reordered = arrayMove(albums, oldIndex, newIndex);
    setAlbums(reordered);
    await Promise.all(
      reordered.map((album, i) =>
        supabase.from("albums").update({ position: i }).eq("id", album.id)
      )
    );
  }

  useEffect(() => {
    loadAlbums();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  async function loadAlbums() {
    const { data } = await supabase.from("albums").select("*").order("position", { ascending: true });
    if (data) setAlbums(data);
  }

  async function loadMemories(albumId: string) {
    const { data } = await supabase
      .from("memories")
      .select("*, profiles(initial, name)")
      .eq("album_id", albumId)
      .order("taken_at", { ascending: true, nullsFirst: false });
    if (data) setMemories(data as Memory[]);
  }

  function getImageUrl(path: string) {
    return supabase.storage.from("memories").getPublicUrl(path).data.publicUrl;
  }

  async function createAlbum() {
    if (!userId || !albumName) return;
    const { data } = await supabase.from("albums").insert({ name: albumName, description: albumDesc || null, created_by: userId }).select().single();
    if (data) { setAlbums([data, ...albums]); setOpenAlbum(data); loadMemories(data.id); }
    setAlbumName(""); setAlbumDesc(""); setShowNewAlbum(false);
  }

  async function handlePhotoUpload(file: File) {
    if (!userId || !openAlbum) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${openAlbum.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("memories").upload(path, file);
    if (error) { alert("Upload error: " + error.message); setUploading(false); return; }
    if (!error) {
      const publicUrl = supabase.storage.from("memories").getPublicUrl(path).data.publicUrl;
      await supabase.from("memories").insert({
        album_id: openAlbum.id,
        user_id: userId,
        storage_path: path,
        caption: caption || null,
        taken_at: takenAt || null,
      });
      // set album cover if not already set
      if (!openAlbum.cover) {
        await supabase.from("albums").update({ cover: publicUrl }).eq("id", openAlbum.id);
        setOpenAlbum({ ...openAlbum, cover: publicUrl });
      }
      setCaption(""); setTakenAt(""); setShowAddPhoto(false);
      loadMemories(openAlbum.id);
      loadAlbums();
    }
    setUploading(false);
  }

  // Album list view
  if (!openAlbum) {
    return (
      <div className="relative min-h-screen flex flex-col pb-10" style={{ background: "#f0ebe3" }}>
        <Image src="/images/063dba5544b77dec533ae34e9b598236.jpg" alt="" fill className="object-cover object-top" priority />
        <header className="relative z-10 flex items-center justify-between px-6 pt-12 pb-6">
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-[20px]" style={{ color: "#9b8070" }}>←</Link>
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>our</p>
              <h1 className="text-[20px] leading-none font-semibold" style={{ color: "#1a1210" }}>Memories</h1>
            </div>
          </div>
          <button
            onClick={() => setShowNewAlbum(true)}
            className="rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em]"
            style={{ background: "#8b1a2a", color: "#f5f0eb" }}
          >
            + album
          </button>
        </header>

        {albums.length === 0 && (
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
            <p className="text-[16px]" style={{ color: "#9b8070", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
              no albums yet — start one
            </p>
          </div>
        )}

        {/* Album grid — sortable polaroid style */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleAlbumDragEnd}>
          <SortableContext items={albums.map((a) => a.id)} strategy={rectSortingStrategy}>
            <div className="relative z-10 px-6 grid grid-cols-2 gap-6">
              {albums.map((album, i) => (
                <SortableAlbum
                  key={album.id}
                  album={album}
                  index={i}
                  onTap={setOpenAlbum}
                  loadMemories={loadMemories}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* New album sheet */}
        {showNewAlbum && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(26,18,16,0.5)" }} onClick={() => setShowNewAlbum(false)}>
            <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5f0eb" }} onClick={(e) => e.stopPropagation()}>
              <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>new album</p>
              <input value={albumName} onChange={(e) => setAlbumName(e.target.value)} placeholder="album name"
                className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
                style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8" }} />
              <input value={albumDesc} onChange={(e) => setAlbumDesc(e.target.value)} placeholder="description (optional)"
                className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
                style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8" }} />
              <button onClick={createAlbum} disabled={!albumName}
                className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
                style={{ background: "#c43040", color: "#f5f0eb" }}>
                create album
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Open album — scrapbook view
  return (
    <div className="min-h-screen flex flex-col pb-10" style={{ background: "#f0ebe3", backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")" }}>

      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => { setOpenAlbum(null); setMemories([]); }} className="text-[20px]" style={{ color: "#9b8070" }}>←</button>
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#9b8070" }}>album</p>
            <h1 className="text-[18px] leading-none font-semibold" style={{ color: "#1a1210", fontFamily: "Georgia, serif", fontStyle: "italic" }}>{openAlbum.name}</h1>
          </div>
        </div>
        <button
          onClick={() => setShowAddPhoto(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-[20px]"
          style={{ background: "#8b1a2a", color: "#f5f0eb" }}
        >
          +
        </button>
      </header>

      {openAlbum.description && (
        <p className="px-6 mb-4 text-[13px]" style={{ color: "#9b8070", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
          {openAlbum.description}
        </p>
      )}

      {memories.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <p className="text-[16px]" style={{ color: "#9b8070", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
            nothing here yet — add your first memory
          </p>
        </div>
      )}

      {/* Scrapbook grid */}
      <div className="px-4 flex flex-col gap-2">
        {memories.map((mem, i) => (
          <button
            key={mem.id}
            onClick={() => setSelected(mem)}
            className="active:opacity-80"
            style={{ transform: `rotate(${rotations[i % rotations.length]}deg)`, alignSelf: i % 3 === 0 ? "flex-start" : i % 3 === 1 ? "center" : "flex-end", marginLeft: i % 2 === 0 ? "8px" : "0", marginRight: i % 2 !== 0 ? "8px" : "0" }}
          >
            <div className="p-2 pb-8 shadow-md" style={{ background: "#faf7f2", border: "1px solid #e8ddd0", maxWidth: 200 }}>
              <div className="overflow-hidden" style={{ width: 180, height: 160 }}>
                <img src={getImageUrl(mem.storage_path)} alt="" className="w-full h-full object-cover" />
              </div>
              {mem.caption && (
                <p className="text-[11px] mt-2 px-1 text-center" style={{ color: "#6b4a3a", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                  {mem.caption}
                </p>
              )}
              {mem.taken_at && (
                <p className="text-[9px] text-center mt-0.5" style={{ color: "#9b8070" }}>
                  {new Date(mem.taken_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Full screen memory */}
      {selected && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-8" style={{ background: "rgba(26,18,16,0.92)" }} onClick={() => setSelected(null)}>
          <div className="p-3 pb-10 shadow-xl" style={{ background: "#faf7f2", maxWidth: 300, width: "100%" }} onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(selected.storage_path)} alt="" className="w-full object-cover" />
            {selected.caption && (
              <p className="text-[14px] mt-4 px-2 text-center" style={{ color: "#6b4a3a", fontFamily: "Georgia, serif", fontStyle: "italic" }}>
                {selected.caption}
              </p>
            )}
            {selected.taken_at && (
              <p className="text-[10px] text-center mt-1" style={{ color: "#9b8070" }}>
                {new Date(selected.taken_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold"
                style={{ background: "#8b1a2a", color: "#f5f0eb" }}>
                {selected.profiles?.initial ?? "?"}
              </div>
              <p className="text-[11px]" style={{ color: "#9b8070" }}>{selected.profiles?.name ?? ""}</p>
            </div>
          </div>
          <button className="mt-6 text-[12px] uppercase tracking-wide" style={{ color: "rgba(245,240,235,0.5)" }}>close</button>
        </div>
      )}

      {/* Add photo sheet */}
      {showAddPhoto && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ background: "rgba(26,18,16,0.5)" }} onClick={() => setShowAddPhoto(false)}>
          <div className="rounded-t-3xl p-8 flex flex-col gap-4" style={{ background: "#f5f0eb" }} onClick={(e) => e.stopPropagation()}>
            <p className="text-[10px] uppercase tracking-[0.25em] text-center mb-2" style={{ color: "#9b8070" }}>add a memory</p>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="caption (optional)"
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8e2", color: "#1a1210", border: "1px solid #d4c8b8", fontFamily: "Georgia, serif", fontStyle: "italic" }} />
            <input type="date" value={takenAt} onChange={(e) => setTakenAt(e.target.value)}
              className="w-full rounded-2xl px-5 py-3.5 text-[14px] outline-none"
              style={{ background: "#ede8e2", color: "#9b8070", border: "1px solid #d4c8b8" }} />
            <div className="relative w-full">
              <button
                disabled={uploading}
                className="w-full rounded-full py-4 text-[11px] tracking-[0.2em] uppercase disabled:opacity-50"
                style={{ background: "#c43040", color: "#f5f0eb" }}
              >
                {uploading ? "uploading…" : "choose photo"}
              </button>
              {!uploading && (
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => { if (e.target.files?.[0]) handlePhotoUpload(e.target.files[0]); }}
                />
              )}
            </div>
            <button onClick={() => setShowAddPhoto(false)} className="text-[12px] text-center" style={{ color: "#9b8070" }}>cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
