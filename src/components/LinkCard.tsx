import type { Link } from "../types";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
}

function prettyUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

// Deterministic gradient per link, hashed from name
const GRADIENTS = [
  "from-indigo-400 to-violet-500",
  "from-sky-400 to-blue-600",
  "from-emerald-400 to-teal-600",
  "from-amber-400 to-orange-600",
  "from-pink-400 to-rose-600",
  "from-cyan-400 to-indigo-500",
];

function gradientFor(name: string): string {
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

const actionBtn =
  "w-6 h-6 inline-flex items-center justify-center rounded-md bg-white/10 border border-white/10 text-slate-300 text-xs hover:text-white hover:bg-white/20";

export function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const initial = (link.name || "?").trim().charAt(0).toUpperCase();

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col gap-2.5 p-4 rounded-2xl bg-white/[0.06] border border-white/10 text-white overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:bg-white/[0.12] hover:border-white/25 hover:shadow-[0_14px_32px_rgba(0,0,0,0.4),0_0_24px_rgba(108,140,255,0.15)]"
    >
      <div
        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientFor(link.name)} flex items-center justify-center text-xl font-bold shadow-[0_4px_14px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-200`}
      >
        {initial}
      </div>
      <div>
        <div className="font-semibold text-[15px] truncate">{link.name}</div>
        <div className="text-xs text-slate-400 truncate">
          {prettyUrl(link.url)}
        </div>
      </div>
      <div className="absolute top-2.5 right-2.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          type="button"
          title="Edit link"
          aria-label={`Edit ${link.name}`}
          className={actionBtn}
          onClick={(e) => {
            e.preventDefault();
            onEdit(link);
          }}
        >
          ✎
        </button>
        <button
          type="button"
          title="Delete link"
          aria-label={`Delete ${link.name}`}
          className={actionBtn}
          onClick={(e) => {
            e.preventDefault();
            onDelete(link);
          }}
        >
          ×
        </button>
      </div>
    </a>
  );
}
