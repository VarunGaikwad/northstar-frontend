import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SearchEngine {
  id: string;
  name: string;
  /** URL template — query appended to this */
  url: string;
  hint: string;
}

const ENGINES: SearchEngine[] = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q=", hint: "Search Google" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q=", hint: "Search DuckDuckGo" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q=", hint: "Search Bing" },
  { id: "brave", name: "Brave", url: "https://search.brave.com/search?q=", hint: "Search Brave" },
  { id: "startpage", name: "Startpage", url: "https://www.startpage.com/sp/search?query=", hint: "Search Startpage" },
  { id: "ecosia", name: "Ecosia", url: "https://www.ecosia.org/search?q=", hint: "Search Ecosia" },
];

export function SearchBar() {
  const [engineId, setEngineId] = useLocalStorage<string>(
    "dashboard.searchEngine",
    "google"
  );
  const [query, setQuery] = useState("");

  const engine = ENGINES.find((e) => e.id === engineId) ?? ENGINES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    window.open(engine.url + encodeURIComponent(q), "_blank", "noopener");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-2xl flex items-center gap-2 mb-6 shrink-0 rounded-full bg-white/[0.07] border border-white/15 backdrop-blur-xl pl-2 pr-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] focus-within:border-indigo-400/70 focus-within:shadow-[0_0_0_4px_rgba(108,140,255,0.15),0_8px_32px_rgba(0,0,0,0.35)] transition-all"
    >
      <select
        value={engineId}
        onChange={(e) => setEngineId(e.target.value)}
        aria-label="Search engine"
        className="shrink-0 rounded-full bg-white/10 border border-white/10 px-3.5 py-2 text-sm font-semibold text-white outline-none cursor-pointer hover:bg-white/15 transition-colors [&>option]:bg-slate-900"
      >
        {ENGINES.map((eng) => (
          <option key={eng.id} value={eng.id}>
            {eng.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`${engine.hint}…`}
        className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
      />

      <button
        type="submit"
        className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_6px_18px_rgba(108,140,255,0.35)] hover:-translate-y-px hover:brightness-110 transition cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
