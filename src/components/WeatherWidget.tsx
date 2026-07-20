import type { Weather } from "../types";

interface WeatherWidgetProps {
  weather: Weather;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <aside className="h-full rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/15 backdrop-blur-xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-sky-300">☀</span> Weather
        </h2>
        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/10 text-slate-400">
          Dummy Data
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-6xl leading-none drop-shadow-[0_4px_20px_rgba(108,140,255,0.5)]">
          {weather.icon}
        </div>
        <div>
          <div className="text-5xl font-extrabold tracking-tight">
            {weather.temp}
            <span className="text-2xl align-super font-semibold text-slate-300">
              °C
            </span>
          </div>
          <div className="mt-0.5 font-semibold text-[15px]">
            {weather.condition}
          </div>
        </div>
      </div>

      <div className="mt-1.5 text-sm font-medium text-slate-300">
        {weather.city}
      </div>

      <div className="grid grid-cols-2 gap-3 mt-5">
        <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-3">
          <div className="text-xs font-medium text-slate-400">Humidity</div>
          <div className="mt-0.5 text-lg font-bold">{weather.humidity}%</div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-3">
          <div className="text-xs font-medium text-slate-400">Wind</div>
          <div className="mt-0.5 text-lg font-bold">{weather.wind} km/h</div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        {weather.forecast.map((f) => (
          <div
            key={f.day}
            className="flex-1 text-center px-1.5 py-2.5 rounded-xl bg-white/10 border border-white/10"
          >
            <div className="text-xs text-slate-400">{f.day}</div>
            <div className="text-xl my-0.5">{f.icon}</div>
            <div className="text-[13px] font-semibold">{f.temp}°</div>
          </div>
        ))}
      </div>
    </aside>
  );
}
