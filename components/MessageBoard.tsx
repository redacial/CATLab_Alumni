"use client";

import { useEffect, useState } from "react";
import { BoardMessage } from "@/lib/types";
import { seedMessages } from "@/lib/data";
import { timeAgo } from "@/lib/time";

const STORAGE_KEY = "catlab-board-v1";

const categories: BoardMessage["category"][] = [
  "General",
  "Job",
  "Internship",
  "Event",
];

const categoryStyle: Record<BoardMessage["category"], string> = {
  Job: "bg-emerald-100 text-emerald-800",
  Internship: "bg-blue-100 text-blue-800",
  Event: "bg-purple-100 text-purple-800",
  General: "bg-westmont-navy/10 text-westmont-blue",
};

export default function MessageBoard() {
  const [messages, setMessages] = useState<BoardMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<BoardMessage["category"]>("General");

  // Load from localStorage (seed on first visit)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setMessages(JSON.parse(raw));
      } else {
        setMessages(seedMessages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMessages));
      }
    } catch {
      setMessages(seedMessages);
    }
    setHydrated(true);
  }, []);

  function persist(next: BoardMessage[]) {
    setMessages(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore quota errors in demo */
    }
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !body.trim()) return;
    const msg: BoardMessage = {
      id: `m-${Date.now()}`,
      author: author.trim(),
      role: "student",
      category,
      body: body.trim(),
      date: new Date().toISOString(),
    };
    persist([msg, ...messages]);
    setBody("");
  }

  const sorted = [...messages].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl border border-westmont-navy/10 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-westmont-navy">📌 Message Board</h2>
      <p className="mb-4 text-sm text-westmont-blue/60">
        Job postings, events, and open questions from the community.
      </p>

      <form onSubmit={handlePost} className="mb-5 space-y-2 rounded-xl bg-westmont-navy/[0.03] p-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            className="flex-1 rounded-lg border border-westmont-navy/15 bg-white px-3 py-2 text-sm outline-none focus:border-westmont-sky"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as BoardMessage["category"])}
            className="rounded-lg border border-westmont-navy/15 bg-white px-3 py-2 text-sm outline-none focus:border-westmont-sky"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share a job posting, an event, or ask the community something…"
          rows={2}
          className="w-full resize-none rounded-lg border border-westmont-navy/15 bg-white px-3 py-2 text-sm outline-none focus:border-westmont-sky"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!author.trim() || !body.trim()}
            className="rounded-lg bg-westmont-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-westmont-blue disabled:opacity-40"
          >
            Post to board
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {!hydrated ? (
          <p className="text-sm text-westmont-blue/50">Loading board…</p>
        ) : (
          sorted.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-westmont-navy/10 p-3.5"
            >
              <div className="mb-1 flex items-center gap-2">
                <span className="font-semibold text-westmont-navy">{m.author}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${categoryStyle[m.category]}`}
                >
                  {m.category}
                </span>
                <span className="ml-auto text-xs text-westmont-blue/50">
                  {timeAgo(m.date)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-westmont-blue/90">{m.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
