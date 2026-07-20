import type { Folder, Link } from "../types";
import { FolderChips } from "./FolderChips";
import { LinkCard } from "./LinkCard";

interface QuickAccessProps {
  folders: Folder[];
  activeFolderId: string | null;
  onSelectFolder: (id: string) => void;
  onAddFolder: () => void;
  onRenameFolder: (folder: Folder) => void;
  onDeleteFolder: (folder: Folder) => void;
  onAddLink: () => void;
  onEditLink: (link: Link) => void;
  onDeleteLink: (link: Link) => void;
}

const btnPrimary =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_6px_18px_rgba(108,140,255,0.35)] hover:-translate-y-px transition cursor-pointer";

export function QuickAccess({
  folders,
  activeFolderId,
  onSelectFolder,
  onAddFolder,
  onRenameFolder,
  onDeleteFolder,
  onAddLink,
  onEditLink,
  onDeleteLink,
}: QuickAccessProps) {
  const activeFolder = folders.find((f) => f.id === activeFolderId) ?? null;

  return (
    <div className="h-full min-h-0 flex flex-col rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.03] border border-white/15 backdrop-blur-xl p-6 shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.1)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="text-indigo-300">✦</span> Quick Access
        </h2>
        <button type="button" className={btnPrimary} onClick={onAddFolder}>
          + Folder
        </button>
      </div>

      <FolderChips
        folders={folders}
        activeFolderId={activeFolderId}
        onSelect={onSelectFolder}
        onRename={onRenameFolder}
        onDelete={onDeleteFolder}
        onAdd={onAddFolder}
      />

      <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 content-start pr-1">
        {!activeFolder && (
          <p className="text-slate-400">
            No folders yet. Create one to get started.
          </p>
        )}
        {activeFolder?.links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onEdit={onEditLink}
            onDelete={onDeleteLink}
          />
        ))}
        {activeFolder && (
          <button
            type="button"
            onClick={onAddLink}
            className="flex items-center justify-center gap-2 min-h-24 rounded-2xl border-[1.5px] border-dashed border-white/20 text-slate-300 text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:text-white hover:border-indigo-400 hover:bg-indigo-400/10 hover:shadow-[0_0_24px_rgba(108,140,255,0.2)]"
          >
            + Add link
          </button>
        )}
      </div>
    </div>
  );
}
