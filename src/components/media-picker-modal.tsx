"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getMediaGalleryAction, updateMediaAltAction, uploadMediaAction } from "@/features/article/actions";

type MediaItem = { id: string; url: string; alt: string | null };

type MediaPickerResult = { url: string; alt: string | null; mediaId: string } | null;

type MediaPickerModalProps = {
  onSelect: (result: MediaPickerResult) => void;
  onClose: () => void;
};

export function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
  const [tab, setTab] = useState<"upload" | "gallery">("upload");
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadGallery = useCallback(async () => {
    const items = await getMediaGalleryAction();
    setGallery(items);
  }, []);

  useEffect(() => {
    loadGallery();
  }, [loadGallery]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      if (altText.trim()) fd.append("alt", altText.trim());

      const result = await uploadMediaAction(fd);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      onSelect({ url: result.url, alt: result.alt, mediaId: result.id });
    } catch {
      setError("อัปโหลดล้มเหลว");
    } finally {
      setUploading(false);
    }
  };

  const selected = gallery.find((m) => m.id === selectedId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-[var(--surface)] shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-[var(--text)]">เลือกรูปภาพ</h2>
          <button type="button" onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)]">&times;</button>
        </div>

        <div className="flex border-b border-[var(--border)]">
          <button
            type="button"
            onClick={() => setTab("upload")}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tab === "upload" ? "border-b-2 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-muted)]"
            }`}
          >
            อัปโหลดจากเครื่อง
          </button>
          <button
            type="button"
            onClick={() => { setTab("gallery"); setSelectedId(null); }}
            className={`flex-1 py-3 text-sm font-medium transition ${
              tab === "gallery" ? "border-b-2 border-[var(--accent)] text-[var(--accent)]" : "text-[var(--text-muted)]"
            }`}
          >
            เลือกจากคลัง
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "upload" && (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-muted)]">รูปภาพ</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-[var(--text)] file:mr-3 file:rounded file:border-0 file:bg-[var(--accent)] file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[var(--text-muted)]">คำอธิบาย (Alt Text)</label>
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="คำอธิบายรูปภาพ"
                  maxLength={300}
                  className="w-full rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="button"
                onClick={handleUpload}
                disabled={!file || uploading}
                className="rounded-lg bg-[var(--accent)] px-6 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลดและเลือก"}
              </button>
            </div>
          )}

          {tab === "gallery" && (
            <div className="space-y-4">
              {gallery.length === 0 ? (
                <p className="text-sm text-[var(--text-muted)] text-center py-8">ไม่มีรูปภาพในคลัง</p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {gallery.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedId(item.id);
                        setAltText(item.alt ?? "");
                      }}
                      className={`relative aspect-square overflow-hidden rounded-lg border-2 transition ${
                        selectedId === item.id ? "border-[var(--accent)] ring-2 ring-[var(--accent)]" : "border-[var(--border)] hover:border-[var(--accent)]"
                      }`}
                    >
                      <Image src={item.url} alt={item.alt ?? ""} fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}

              {selected && (
                <div className="rounded-lg border border-[var(--border)] p-4 space-y-3">
                  <p className="text-xs text-[var(--text-muted)]">แก้ไข Alt Text</p>
                  <input
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="คำอธิบายรูปภาพ"
                    maxLength={300}
                    className="w-full rounded-[var(--radius-input)] border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--primary)]"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={async () => {
                        await updateMediaAltAction(selected.id, altText);
                        onSelect({ url: selected.url, alt: altText, mediaId: selected.id });
                      }}
                      className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      เลือกรูปนี้
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
