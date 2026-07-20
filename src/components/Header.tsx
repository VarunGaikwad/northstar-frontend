import { useClock } from "../hooks/useClock";

interface HeaderProps {
  user: string;
}

export function Header({ user }: HeaderProps) {
  const { time, date, greeting } = useClock();

  return (
    <header className="flex flex-wrap items-start justify-between gap-6 mb-5 shrink-0">
      <div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-br from-white via-indigo-200 to-violet-300 bg-clip-text text-transparent">
          {greeting}, {user}
        </h1>
        <p className="mt-1 text-indigo-200/70 font-medium text-base md:text-lg">
          Here's your dashboard for today.
        </p>
      </div>
      <div className="text-right">
        <div className="text-4xl md:text-5xl font-bold tabular-nums tracking-wide text-white drop-shadow-[0_0_25px_rgba(108,140,255,0.4)]">
          {time}
        </div>
        <div className="mt-1 text-sm text-slate-400">{date}</div>
      </div>
    </header>
  );
}
