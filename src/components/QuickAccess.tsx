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
    <div className="flex flex-col min-h-0 gap-4">
      <FolderChips
        folders={folders}
        activeFolderId={activeFolderId}
        onSelect={onSelectFolder}
        onRename={onRenameFolder}
        onDelete={onDeleteFolder}
        onAdd={onAddFolder}
      />

      <div className="flex-1 min-h-0 overflow-y-auto grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3 content-start pr-1">
        {!activeFolder && (
          <p className="text-slate-400 col-span-full text-sm">
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
            className="flex items-center justify-center gap-2 min-h-24 rounded-2xl border-[1.5px] border-dashed border-white/20 text-slate-400 text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:text-white hover:border-indigo-400 hover:bg-indigo-400/10 hover:shadow-[0_0_24px_rgba(108,140,255,0.2)]"
          >
            + Add link
          </button>
        )}
      </div>
    </div>
  );
}
