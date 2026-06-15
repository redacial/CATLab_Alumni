"use client";

import { useEffect } from "react";
import { Person } from "@/lib/types";
import Avatar from "./Avatar";

export default function PersonModal({
  person,
  onClose,
}: {
  person: Person | null;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (person) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [person, onClose]);

  if (!person) return null;

  const isAlum = person.role === "alumni";
  const topics = isAlum ? person.askMeAbout ?? [] : person.lookingFor ?? [];
  const topicsLabel = isAlum ? "Ask me about" : "Looking for";

  const mailto = `mailto:${person.email}?subject=${encodeURIComponent(
    `CATLab Network — connecting with you`
  )}&body=${encodeURIComponent(
    `Hi ${person.name.split(" ")[0]},\n\nI found your profile on the CATLab Network and would love to connect`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-westmont-navy/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-westmont-blue/60 hover:bg-westmont-navy/5"
          >
            ✕
          </button>

          <div className="flex items-start gap-4">
            <Avatar name={person.name} gradient={person.avatarColor} size="lg" />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-westmont-navy">{person.name}</h2>
              {isAlum ? (
                <p className="text-sm text-westmont-blue">
                  {person.currentRole} · {person.company}
                </p>
              ) : (
                <p className="text-sm text-westmont-blue">
                  Student · Class of {person.expectedGradYear}
                </p>
              )}
              <p className="mt-0.5 text-xs text-westmont-blue/70">
                {person.major}
                {isAlum ? ` · ${person.gradYear}` : ""}
                {person.location ? ` · ${person.location}` : ""}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-westmont-blue/90">{person.bio}</p>

          {topics.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-westmont-blue/60">
                {topicsLabel}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <span key={t} className="tag-gold">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-westmont-blue/60">
              Interests
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {person.interests.map((t) => (
                <span key={t} className="tag">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <a
              href={mailto}
              className="flex-1 rounded-lg bg-westmont-navy px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-westmont-blue"
            >
              ✉️ Reach out by email
            </a>
            {person.linkedinUrl && (
              <a
                href={person.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-lg bg-westmont-sky px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
              >
                in · View LinkedIn
              </a>
            )}
          </div>
          <p className="mt-2 text-center text-xs text-westmont-blue/50">
            {person.email}
          </p>
        </div>
      </div>
    </div>
  );
}
