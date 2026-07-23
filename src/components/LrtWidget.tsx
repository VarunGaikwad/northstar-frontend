import { useEffect, useMemo, useState } from "react";
import { generateDummyTimetable, STATIONS } from "../data/lrtData";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MAX_UPCOMING = 6;
const MIN_PER_STOP = 2.4;

function nowMinutes(): number {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

interface PlannedTrain {
  depart: string;
  arrive: string;
  departMin: number;
  arriveNextDay: boolean;
  durationMins: number;
  direction: "INBOUND" | "OUTBOUND";
  trainType: "LOCAL" | "RAPID";
}

export function LrtWidget() {
  const [fromCode, setFromCode] = useLocalStorage<number>("dashboard.lrtFrom", STATIONS[0].code);
  const [toCode, setToCode] = useLocalStorage<number>("dashboard.lrtTo", STATIONS[STATIONS.length - 1].code);
  const [now, setNow] = useState(nowMinutes);

  useEffect(() => {
    const id = setInterval(() => setNow(nowMinutes()), 30_000);
    return () => clearInterval(id);
  }, []);

  const from = STATIONS.find((s) => s.code === fromCode) ?? STATIONS[0];
  const to = STATIONS.find((s) => s.code === toCode) ?? STATIONS[STATIONS.length - 1];
  const sameStation = from.code === to.code;
  const direction = from.code < to.code ? "INBOUND" : "OUTBOUND";

  const plans: PlannedTrain[] = useMemo(() => {
    if (sameStation) return [];
    const travelMins = Math.round(Math.abs(to.code - from.code) * MIN_PER_STOP);
    return generateDummyTimetable(from.code)
      .filter((t) => t.direction === direction)
      .map<PlannedTrain>((t) => {
        const arriveMin = t.minuteOfDay + travelMins;
        return {
          depart: t.time,
          arrive: formatArrive(arriveMin),
          departMin: t.minuteOfDay,
          arriveNextDay: arriveMin >= 24 * 60,
          durationMins: travelMins,
          direction: t.direction,
          trainType: t.trainType,
        };
      });
  }, [from.code, to.code, direction, sameStation]);

  const upcoming = plans.filter((p) => p.departMin >= now).slice(0, MAX_UPCOMING);

  const swap = () => {
    setFromCode(to.code);
    setToCode(from.code);
  };

  const selectCls =
    "flex-1 min-w-0 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-[13px] font-semibold text-white outline-none cursor-pointer hover:bg-white/15 transition-colors [&>option]:bg-slate-900";

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-medium pl-1">From</label>
          <select
            value={from.code}
            onChange={(e) => setFromCode(Number(e.target.value))}
            aria-label="From station"
            className={selectCls}
          >
            {STATIONS.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          aria-label="Swap from and to"
          title="Swap"
          className="shrink-0 mt-5 w-9 h-9 rounded-xl bg-white/10 border border-white/15 text-slate-300 hover:text-white hover:bg-white/20 hover:rotate-180 transition-all duration-300 cursor-pointer"
        >
          ⇄
        </button>

        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <label className="text-[11px] text-slate-400 font-medium pl-1">To</label>
          <select
            value={to.code}
            onChange={(e) => setToCode(Number(e.target.value))}
            aria-label="To station"
            className={selectCls}
          >
            {STATIONS.map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!sameStation && (
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-[12px] text-slate-400">{from.name}</span>
          <span
            className={
              "text-[11px] font-bold px-2 py-0.5 rounded-md " +
              (direction === "INBOUND"
                ? "bg-indigo-400/20 text-indigo-300"
                : "bg-emerald-400/20 text-emerald-300")
            }
          >
            {direction === "INBOUND" ? "上り →" : "← 下り"}
          </span>
          <span className="text-[12px] text-slate-400">{to.name}</span>
        </div>
      )}

      {sameStation ? (
        <p className="text-sm text-slate-400">Pick two different stations to see trains.</p>
      ) : upcoming.length === 0 ? (
        <p className="text-sm text-slate-400">No more trains today.</p>
      ) : (
        <ul className="flex flex-col gap-2 pr-1 max-h-[35vh] overflow-y-auto">
          {upcoming.map((p, i) => (
            <li
              key={`${p.depart}-${p.direction}-${i}`}
              className={
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 border transition-colors " +
                (i === 0
                  ? "bg-gradient-to-br from-indigo-400/25 to-violet-500/25 border-indigo-400/40"
                  : "bg-white/[0.06] border-white/10 hover:bg-white/15")
              }
            >
              <div className="flex flex-col items-center gap-0.5 shrink-0 w-16">
                <span className="text-base font-bold tabular-nums leading-none">{p.depart}</span>
                <span className="text-slate-500 leading-none">↓</span>
                <span className="text-sm font-semibold tabular-nums leading-none text-indigo-200">
                  {p.arrive}
                  {p.arriveNextDay && <span className="ml-1 text-[9px] text-amber-300/80">+1</span>}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold">{p.durationMins} min</div>
                {i === 0 && <div className="text-[11px] text-indigo-300 font-medium">Next train</div>}
              </div>
              <span
                className={
                  "shrink-0 text-[10px] font-bold px-2 py-1 rounded-md " +
                  (p.trainType === "RAPID"
                    ? "bg-red-400/20 text-red-300"
                    : "bg-emerald-400/15 text-emerald-300")
                }
              >
                {p.trainType === "RAPID" ? "快速" : "各停"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-3 text-[11px] text-slate-500">
        {plans.length} trips today · updates every 30s
      </p>
    </div>
  );
}

function formatArrive(minuteOfDay: number): string {
  const m = minuteOfDay % 1440;
  return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
}
