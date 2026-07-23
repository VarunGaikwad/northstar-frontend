import { useState } from "react";
import type { Folder, Link, Weather } from "../types";
import { QuickAccess } from "./QuickAccess";
import { WeatherWidget } from "./WeatherWidget";
import { LrtWidget } from "./LrtWidget";
import { SlideUpPanel } from "./SlideUpPanel";

type PanelType = "quickaccess" | "weather" | "lrt";

interface BottomBarProps {
  folders: Folder[];
  activeFolderId: string | null;
  weather: Weather;
  onSelectFolder: (id: string) => void;
  onAddFolder: () => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onAddLink: () => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
}

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

export function BottomBar(props: BottomBarProps) {
  const [activePanel, setActivePanel] = useState<PanelType | null>(null);

  const activeFolder = props.folders.find((f) => f.id === props.activeFolderId) ?? null;
  const links = activeFolder?.links ?? [];

  const closePanel = () => setActivePanel(null);

  return (
    <>
      <SlideUpPanel open={activePanel === "quickaccess"} onClose={closePanel} title="Quick Access">
        <QuickAccess
          folders={props.folders}
          activeFolderId={props.activeFolderId}
          onSelectFolder={props.onSelectFolder}
          onAddFolder={props.onAddFolder}
          onRenameFolder={props.onRenameFolder}
          onDeleteFolder={props.onDeleteFolder}
          onAddLink={props.onAddLink}
          onEditLink={props.onEditLink}
          onDeleteLink={props.onDeleteLink}
        />
      </SlideUpPanel>

      <SlideUpPanel open={activePanel === "weather"} onClose={closePanel} title="Weather">
        <WeatherWidget weather={props.weather} />
      </SlideUpPanel>

      <SlideUpPanel open={activePanel === "lrt"} onClose={closePanel} title="LRT">
        <LrtWidget />
      </SlideUpPanel>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-900/70 backdrop-blur-xl border-t border-white/10">
        {/* Quick Access icon strip */}
        <button
          type="button"
          onClick={() => setActivePanel(activePanel === "quickaccess" ? null : "quickaccess")}
          className="flex items-center gap-1.5 flex-1 min-w-0 rounded-2xl bg-white/[0.06] border border-white/10 px-3 py-2 text-left hover:bg-white/[0.10] transition-colors cursor-pointer"
        >
          <span className="text-xs font-semibold text-white/60 shrink-0">
            {activeFolder ? activeFolder.name : "Links"}
          </span>
          <div className="flex items-center gap-1 overflow-hidden">
            {links.slice(0, 8).map((link) => {
              const initial = (link.name || "?").charAt(0).toUpperCase();
              return (
                <span
                  key={link.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(link.url, "_blank", "noopener");
                  }}
                  className={`shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${gradientFor(link.name)} flex items-center justify-center text-[10px] font-bold text-white shadow cursor-pointer hover:scale-110 transition-transform`}
                  title={link.name}
                >
                  {initial}
                </span>
              );
            })}
            {links.length === 0 && (
              <span className="text-[11px] text-white/30">No links</span>
            )}
          </div>
        </button>

        {/* Weather toggle */}
        <button
          type="button"
          onClick={() => setActivePanel(activePanel === "weather" ? null : "weather")}
          className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-lg flex items-center justify-center hover:bg-white/[0.12] transition-colors cursor-pointer"
          title="Weather"
        >
          ☀
        </button>

        {/* LRT toggle */}
        <button
          type="button"
          onClick={() => setActivePanel(activePanel === "lrt" ? null : "lrt")}
          className="shrink-0 w-10 h-10 rounded-xl bg-white/[0.06] border border-white/10 text-lg flex items-center justify-center hover:bg-white/[0.12] transition-colors cursor-pointer"
          title="LRT"
        >
          🚊
        </button>
      </div>
    </>
  );
}
