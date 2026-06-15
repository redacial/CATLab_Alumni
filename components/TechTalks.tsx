import { techTalks } from "@/lib/data";
import { TechTalk } from "@/lib/types";

function TalkCard({ talk }: { talk: TechTalk }) {
  const d = new Date(talk.date);
  const label = d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className={`relative rounded-xl border bg-white p-5 shadow-sm ${
        talk.upcoming
          ? "border-westmont-sky/40 ring-1 ring-westmont-sky/20"
          : "border-westmont-navy/10"
      }`}
    >
      {talk.upcoming && (
        <span className="absolute right-4 top-4 rounded-full bg-westmont-sky px-2.5 py-0.5 text-[11px] font-semibold text-white">
          Upcoming
        </span>
      )}
      <p className="mb-1 text-xs font-medium text-westmont-blue/50">{label}</p>
      <h3 className="pr-20 font-semibold leading-snug text-westmont-navy">
        {talk.title}
      </h3>
      <p className="mt-0.5 text-xs text-westmont-blue/70">
        {talk.speaker} · {talk.speakerRole}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-westmont-blue/80">
        {talk.description}
      </p>
      {talk.videoUrl && !talk.upcoming && (
        <a
          href={talk.videoUrl}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-westmont-sky hover:underline"
        >
          ▶ Watch recording
        </a>
      )}
    </div>
  );
}

export default function TechTalks() {
  const upcoming = techTalks.filter((t) => t.upcoming);
  const past = techTalks.filter((t) => !t.upcoming).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="rounded-2xl border border-westmont-navy/10 bg-white p-5 shadow-sm">
      <h2 className="mb-1 text-lg font-bold text-westmont-navy">🎙 Tech Talks</h2>
      <p className="mb-5 text-sm text-westmont-blue/60">
        Alumni sharing what they wish they'd known. Hosted by CATLab.
      </p>

      {upcoming.length > 0 && (
        <div className="mb-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-westmont-blue/50">
            Coming up
          </h3>
          <div className="space-y-3">
            {upcoming.map((t) => (
              <TalkCard key={t.id} talk={t} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-westmont-blue/50">
          Past talks
        </h3>
        <div className="space-y-3">
          {past.map((t) => (
            <TalkCard key={t.id} talk={t} />
          ))}
        </div>
      </div>
    </div>
  );
}
