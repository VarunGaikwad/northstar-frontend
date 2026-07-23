import type { Weather } from "../types";

interface WeatherWidgetProps {
  weather: Weather;
}

export function WeatherWidget({ weather }: WeatherWidgetProps) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl leading-none drop-shadow-[0_4px_20px_rgba(108,140,255,0.5)]">
          {weather.icon}
        </div>
        <div>
          <div className="text-4xl font-extrabold tracking-tight">
            {weather.temp}
            <span className="text-xl align-super font-semibold text-slate-400">°C</span>
          </div>
          <div className="mt-0.5 font-semibold text-sm text-slate-300">
            {weather.condition}
          </div>
        </div>
      </div>

      <div className="text-sm font-medium text-slate-400 mb-4">
        {weather.city}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-3">
          <div className="text-xs font-medium text-slate-400">Humidity</div>
          <div className="mt-0.5 text-lg font-bold">{weather.humidity}%</div>
        </div>
        <div className="rounded-xl bg-white/10 border border-white/10 px-3.5 py-3">
          <div className="text-xs font-medium text-slate-400">Wind</div>
          <div className="mt-0.5 text-lg font-bold">{weather.wind} km/h</div>
        </div>
      </div>

      <div className="flex gap-2">
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
    </div>
  );
}
