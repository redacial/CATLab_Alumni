"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { GameApi, SlotInfo } from "@/lib/animecraft/engine";

export default function AnimeCraft() {
  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<GameApi | null>(null);
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(false);
  const [started, setStarted] = useState(false);
  const [slot, setSlot] = useState(0);
  const [hotbar, setHotbar] = useState<SlotInfo[]>([]);

  useEffect(() => {
    let cancelled = false;
    const mount = mountRef.current;
    if (!mount) return;

    (async () => {
      const { createGame } = await import("@/lib/animecraft/engine");
      if (cancelled) return;
      const api = createGame(mount);
      apiRef.current = api;
      setHotbar(api.hotbar);
      api.onLockChange(setLocked);
      api.onSlotChange(setSlot);
      setReady(true);
    })();

    return () => {
      cancelled = true;
      apiRef.current?.dispose();
      apiRef.current = null;
    };
  }, []);

  const play = () => {
    setStarted(true);
    apiRef.current?.start();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#ffd9ec]">
      <div ref={mountRef} className="absolute inset-0" />

      {/* crosshair */}
      {locked && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-light text-white/90 drop-shadow">
          +
        </div>
      )}

      {/* hotbar */}
      {started && hotbar.length > 0 && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-xl bg-black/25 p-2 backdrop-blur-sm">
          {hotbar.map((s, i) => (
            <div
              key={s.id}
              className={`flex h-12 w-12 flex-col items-center justify-center rounded-lg border-2 transition ${
                i === slot ? "scale-110 border-white bg-white/20" : "border-white/25"
              }`}
              title={s.name}
            >
              <span
                className="h-6 w-6 rounded shadow-inner"
                style={{ backgroundColor: s.color }}
              />
              <span className="mt-0.5 text-[9px] font-semibold text-white/80">{i + 1}</span>
            </div>
          ))}
        </div>
      )}

      {/* selected block name */}
      {locked && hotbar[slot] && (
        <div className="pointer-events-none absolute bottom-[5.5rem] left-1/2 -translate-x-1/2 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {hotbar[slot].name}
        </div>
      )}

      {/* start / pause overlay */}
      {!locked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-pink-300/60 via-pink-200/40 to-sky-200/50 backdrop-blur-[2px]">
          <div className="mx-4 max-w-md rounded-2xl border border-white/60 bg-white/80 p-8 text-center shadow-2xl">
            <div className="text-4xl">🌸⛏️</div>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-pink-500">
              SakuraCraft
            </h1>
            <p className="text-sm font-medium tracking-[0.35em] text-pink-400">桜クラフト</p>
            <p className="mt-3 text-sm text-slate-600">
              An anime-inspired voxel world — wander the sakura groves, pass through the
              torii gate, and build under falling petals.
            </p>
            <button
              onClick={play}
              disabled={!ready}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 px-6 py-3 font-bold text-white shadow-lg transition hover:brightness-105 active:scale-95 disabled:opacity-50"
            >
              {!ready ? "Growing the world…" : started ? "▶ Resume" : "▶ Play"}
            </button>
            <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1 text-left text-xs text-slate-500">
              <span><b className="text-slate-700">WASD</b> — move</span>
              <span><b className="text-slate-700">Mouse</b> — look</span>
              <span><b className="text-slate-700">Space</b> — jump / swim</span>
              <span><b className="text-slate-700">Shift</b> — sprint</span>
              <span><b className="text-slate-700">Left click</b> — break</span>
              <span><b className="text-slate-700">Right click</b> — place</span>
              <span><b className="text-slate-700">1–9 / scroll</b> — pick block</span>
              <span><b className="text-slate-700">Esc</b> — pause</span>
            </div>
            <p className="mt-4 text-[11px] text-slate-400">
              Best on desktop with a mouse and keyboard.
            </p>
          </div>
          <Link
            href="/"
            className="mt-4 rounded-full bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-600 shadow hover:bg-white"
          >
            ← Back to CATLab Network
          </Link>
        </div>
      )}
    </div>
  );
}
