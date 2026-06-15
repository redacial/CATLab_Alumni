"use client";

import { useEffect, useState } from "react";
import { GivingPledge } from "@/lib/types";
import { seedPledges } from "@/lib/data";

const STORAGE_KEY = "catlab-giving-v1";

function ProgressBar({ current, goal }: { current: number; goal: number }) {
  const pct = Math.min(100, Math.round((current / goal) * 100));
  return (
    <div>
      <div className="mb-1.5 flex items-end justify-between text-sm">
        <span className="font-semibold text-westmont-navy">
          ${(current / 1000).toFixed(0)}k endowment
        </span>
        <span className="text-westmont-blue/60">${(goal / 1_000_000).toFixed(0)}M goal</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-westmont-navy/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-westmont-gold to-amber-400 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-westmont-blue/60">{pct}% of endowment goal</p>
    </div>
  );
}

export default function GivePage() {
  const [pledges, setPledges] = useState<GivingPledge[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [name, setName] = useState("");
  const [classYear, setClassYear] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setPledges(raw ? JSON.parse(raw) : seedPledges);
      if (!raw) localStorage.setItem(STORAGE_KEY, JSON.stringify(seedPledges));
    } catch {
      setPledges(seedPledges);
    }
    setHydrated(true);
  }, []);

  function persist(next: GivingPledge[]) {
    setPledges(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* noop */ }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const pledge: GivingPledge = {
      id: `gp-${Date.now()}`,
      name: name.trim(),
      classYear: classYear.trim() || undefined,
      message: message.trim() || undefined,
      date: new Date().toISOString(),
    };
    persist([...pledges, pledge]);
    setSubmitted(true);
  }

  const sorted = [...pledges].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="rounded-2xl bg-gradient-to-br from-westmont-navy to-westmont-blue p-8 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">Support CATLab</h1>
        <p className="mt-2 max-w-xl text-sm text-white/80">
          Every person in this network is part of what makes CATLab possible.
          This page is about community, not checkbooks.
        </p>
      </section>

      {/* Why giving matters */}
      <section className="rounded-2xl border border-westmont-gold/30 bg-amber-50 p-6 ring-1 ring-westmont-gold/20">
        <h2 className="mb-3 text-lg font-bold text-westmont-navy">Why your support matters</h2>
        <p className="text-sm leading-relaxed text-westmont-blue/90">
          CATLab currently operates with a{" "}
          <strong className="text-westmont-navy">$120,000 endowment</strong>. Every{" "}
          <strong className="text-westmont-navy">$100,000</strong> we add means one more student
          gets paid for a full summer of applied technology work — real projects, real experience,
          no unpaid internship pressure.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-westmont-blue/90">
          If the endowment reaches{" "}
          <strong className="text-westmont-navy">$5 million</strong>, CATLab becomes
          self-sustaining — the program runs entirely on its own without relying on the college for
          funding. That&apos;s the long game.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-westmont-blue/90">
          But here&apos;s what we really believe:{" "}
          <strong className="text-westmont-navy">
            it&apos;s not about how much you give — it&apos;s about being in the network.
          </strong>{" "}
          Showing up, mentoring, spreading the word, and signing your name below is every bit as
          meaningful as a dollar figure. The community is the endowment.
        </p>

        <div className="mt-5">
          <ProgressBar current={120_000} goal={5_000_000} />
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Current endowment", value: "$120k" },
            { label: "Per student per summer", value: "$100k" },
            { label: "Self-sustaining goal", value: "$5M" },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-westmont-gold/20">
              <p className="text-lg font-bold text-westmont-navy">{s.value}</p>
              <p className="text-xs text-westmont-blue/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign-up form */}
      <section className="rounded-2xl border border-westmont-navy/10 bg-white p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-westmont-navy">Add your name</h2>
        <p className="mb-5 text-sm text-westmont-blue/60">
          No commitment required — just signal that you&apos;re part of the community that
          believes in this mission. Alumni, students, and friends welcome.
        </p>

        {submitted ? (
          <div className="rounded-xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
            <p className="text-lg font-bold text-emerald-800">Thank you! 🙌</p>
            <p className="mt-1 text-sm text-emerald-700">
              Your name has been added to the CATLab supporter wall.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name *"
                className="flex-1 rounded-lg border border-westmont-navy/15 px-3 py-2.5 text-sm outline-none focus:border-westmont-sky focus:ring-2 focus:ring-westmont-sky/20"
              />
              <input
                value={classYear}
                onChange={(e) => setClassYear(e.target.value)}
                placeholder="Class year (optional)"
                className="w-full rounded-lg border border-westmont-navy/15 px-3 py-2.5 text-sm outline-none focus:border-westmont-sky sm:w-44"
              />
            </div>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a message for current students (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-westmont-navy/15 px-3 py-2.5 text-sm outline-none focus:border-westmont-sky focus:ring-2 focus:ring-westmont-sky/20"
            />
            <button
              type="submit"
              className="rounded-lg bg-westmont-navy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-westmont-blue"
            >
              Sign my name
            </button>
          </form>
        )}
      </section>

      {/* Supporter wall */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-westmont-navy">
          Supporter wall{" "}
          <span className="text-sm font-normal text-westmont-blue/50">
            {hydrated ? `${pledges.length} supporters` : ""}
          </span>
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {sorted.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-westmont-navy/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold text-westmont-navy">{p.name}</span>
                {p.classYear && (
                  <span className="text-xs text-westmont-blue/60">· {p.classYear}</span>
                )}
              </div>
              {p.message && (
                <p className="mt-1 text-sm italic leading-relaxed text-westmont-blue/80">
                  &ldquo;{p.message}&rdquo;
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
