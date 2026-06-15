"use client";

import { useMemo, useState } from "react";
import { Person } from "@/lib/types";
import Avatar from "./Avatar";
import PersonModal from "./PersonModal";

function PersonCard({ person, onClick }: { person: Person; onClick: () => void }) {
  const isAlum = person.role === "alumni";
  const topics = isAlum ? person.askMeAbout ?? [] : person.lookingFor ?? [];

  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col rounded-xl border border-westmont-navy/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-westmont-sky/40 hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <Avatar name={person.name} gradient={person.avatarColor} />
        <div className="min-w-0">
          <h3 className="font-semibold text-westmont-navy group-hover:text-westmont-sky">
            {person.name}
          </h3>
          {isAlum ? (
            <p className="truncate text-sm text-westmont-blue">
              {person.currentRole} · {person.company}
            </p>
          ) : (
            <p className="text-sm text-westmont-blue">Class of {person.expectedGradYear}</p>
          )}
          <p className="mt-0.5 text-xs text-westmont-blue/60">
            {person.major}
            {isAlum ? ` · '${String(person.gradYear).slice(2)}` : ""}
          </p>
        </div>
      </div>

      {topics.length > 0 && (
        <div className="mt-3">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-westmont-blue/50">
            {isAlum ? "Ask me about" : "Looking for"}
          </p>
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 3).map((t) => (
              <span key={t} className="tag-gold">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1">
        {person.interests.slice(0, 3).map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </button>
  );
}

export default function Directory({
  people,
  kind,
}: {
  people: Person[];
  kind: "alumni" | "student";
}) {
  const [query, setQuery] = useState("");
  const [major, setMajor] = useState("All");
  const [selected, setSelected] = useState<Person | null>(null);

  const majors = useMemo(
    () => ["All", ...Array.from(new Set(people.map((p) => p.major))).sort()],
    [people]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return people.filter((p) => {
      if (major !== "All" && p.major !== major) return false;
      if (!q) return true;
      const haystack = [
        p.name,
        p.major,
        p.currentRole,
        p.company,
        p.bio,
        ...p.interests,
        ...(p.askMeAbout ?? []),
        ...(p.lookingFor ?? []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [people, query, major]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            kind === "alumni"
              ? "Search by name, role, company, or interest…"
              : "Search by name, major, or interest…"
          }
          className="flex-1 rounded-lg border border-westmont-navy/15 bg-white px-4 py-2.5 text-sm outline-none focus:border-westmont-sky focus:ring-2 focus:ring-westmont-sky/20"
        />
        <select
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className="rounded-lg border border-westmont-navy/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-westmont-sky"
        >
          {majors.map((m) => (
            <option key={m} value={m}>
              {m === "All" ? "All majors" : m}
            </option>
          ))}
        </select>
      </div>

      <p className="mb-3 text-sm text-westmont-blue/60">
        {filtered.length} {filtered.length === 1 ? "person" : "people"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-westmont-navy/20 py-12 text-center text-sm text-westmont-blue/60">
          No matches. Try a different search.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PersonCard key={p.id} person={p} onClick={() => setSelected(p)} />
          ))}
        </div>
      )}

      <PersonModal person={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
