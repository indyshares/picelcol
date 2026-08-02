"use client";

import { Loader2, Trash2, X } from "lucide-react";

type DeleteArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  isDeleting?: boolean;
};

export function DeleteArticleModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isDeleting = false,
}: DeleteArticleModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="clay-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-article-title"
        className="clay-pop-in clay-card w-full max-w-md space-y-4 rounded-3xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rose-100 p-3 text-rose-500 dark:bg-rose-500/15 dark:text-rose-400">
            <Trash2 className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <h2 id="delete-article-title" className="text-lg font-semibold text-[var(--text)]">
              Confirm Article Deletion
            </h2>
            <p className="mt-1 text-sm text-[var(--text-light)]">
              This action cannot be undone. Please review the article before continuing.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="clay-bounce flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--clay-bg-soft)] text-[var(--text-muted)] motion-reduce:transition-none hover:text-[var(--text)] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="clay-well rounded-2xl p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Article
          </p>
          <p className="mt-1 line-clamp-2 font-medium text-[var(--text)]">{title}</p>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="clay-button clay-bounce bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 motion-reduce:transition-none hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="clay-button clay-bounce inline-flex items-center gap-2 bg-rose-500 px-4 py-2 text-sm font-medium text-white motion-reduce:transition-none hover:bg-rose-600 disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isDeleting ? "Deleting..." : "Delete Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
