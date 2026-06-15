import Link from "next/link";
import { announcements, alumni, students } from "@/lib/data";
import { timeAgo } from "@/lib/time";
import MessageBoard from "@/components/MessageBoard";
import TechTalks from "@/components/TechTalks";

export default function HomePage() {
  const sorted = [...announcements].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-westmont-navy to-westmont-blue p-8 text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Connect with the CATLab community
        </h1>
        <p className="mt-2 max-w-xl text-sm text-white/80">
          The Center for Applied Technology network — where Westmont students and
          alumni meet for mentorship, advice, and opportunities.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/alumni"
            className="rounded-lg bg-westmont-gold px-4 py-2 text-sm font-semibold text-westmont-navy transition hover:opacity-90"
          >
            Browse Alumni ({alumni.length})
          </Link>
          <Link
            href="/students"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
          >
            Browse Students ({students.length})
          </Link>
          <Link
            href="/give"
            className="rounded-lg bg-westmont-gold px-4 py-2 text-sm font-semibold text-westmont-navy transition hover:opacity-90"
          >
            Support CATLab
          </Link>
        </div>
      </section>

      {/* Announcements */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-westmont-navy">
          📣 Announcements
          <span className="ml-2 text-sm font-normal text-westmont-blue/50">
            from the CATLab Creative Team
          </span>
        </h2>
        <div className="space-y-3">
          {sorted.map((a) => (
            <article
              key={a.id}
              className={`rounded-xl border bg-white p-5 shadow-sm ${
                a.pinned
                  ? "border-westmont-gold/40 ring-1 ring-westmont-gold/20"
                  : "border-westmont-navy/10"
              }`}
            >
              <div className="mb-1 flex items-center gap-2">
                {a.pinned && <span className="tag-gold">📌 Pinned</span>}
                <h3 className="font-semibold text-westmont-navy">{a.title}</h3>
                <span className="ml-auto whitespace-nowrap text-xs text-westmont-blue/50">
                  {timeAgo(a.date)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-westmont-blue/90">{a.body}</p>
              <p className="mt-2 text-xs text-westmont-blue/50">— {a.author}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Tech Talks */}
      <section>
        <TechTalks />
      </section>

      {/* Message board */}
      <section>
        <MessageBoard />
      </section>
    </div>
  );
}
