import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

interface SearchEngine {
  id: string;
  name: string;
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
  const [engineId, setEngineId] = useLocalStorage<string>("dashboard.searchEngine", "google");
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
      className="flex items-center gap-2 w-full rounded-full bg-white/[0.06] border border-white/10 pl-2 pr-1.5 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 focus-within:bg-white/[0.10] focus-within:border-white/20"
    >
      <select
        value={engineId}
        onChange={(e) => setEngineId(e.target.value)}
        aria-label="Search engine"
        className="shrink-0 rounded-full bg-white/10 border border-white/5 px-3 py-1.5 text-xs font-semibold text-white/80 outline-none cursor-pointer hover:bg-white/15 transition-colors [&>option]:bg-slate-900"
      >
        {ENGINES.map((eng) => (
          <option key={eng.id} value={eng.id}>{eng.name}</option>
        ))}
      </select>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={`${engine.hint}…`}
        className="flex-1 min-w-0 bg-transparent px-3 py-1.5 text-sm text-white placeholder:text-white/30 outline-none"
      />

      <button
        type="submit"
        className="shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}
