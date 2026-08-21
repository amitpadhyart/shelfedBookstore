"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteBookButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(`/api/admin/books/${id}`, { method: "DELETE" });
    router.refresh();
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs text-wine dark:text-wine-light">Delete?</span>
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="font-mono text-xs text-wine dark:text-wine-light underline"
        >
          {loading ? "…" : "Yes"}
        </button>
        <button type="button" onClick={() => setConfirming(false)} className="font-mono text-xs text-ink-faint dark:text-paper-soft/40">
          No
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setConfirming(true)}
      aria-label={`Delete ${title}`}
      className="text-ink-faint hover:text-wine dark:hover:text-wine-light"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
