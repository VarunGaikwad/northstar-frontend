import type { Folder } from "../types";

interface FolderChipsProps {
  folders: Folder[];
  activeFolderId: string | null;
  onSelect: (id: string) => void;
  onRename: (folder: Folder) => void;
  onDelete: (folder: Folder) => void;
  onAdd: () => void;
}

const chipBase =
  "inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-200 hover:-translate-y-px";

export function FolderChips({
  folders,
  activeFolderId,
  onSelect,
  onRename,
  onDelete,
  onAdd,
}: FolderChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-5">
      {folders.map((folder) => {
        const active = folder.id === activeFolderId;
        return (
          <div
            key={folder.id}
            role="button"
            tabIndex={0}
            onClick={() => onSelect(folder.id)}
            onKeyDown={(e) => e.key === "Enter" && onSelect(folder.id)}
            className={
              chipBase +
              (active
                ? " bg-gradient-to-br from-indigo-400 to-violet-500 text-white shadow-[0_6px_18px_rgba(108,140,255,0.5),inset_0_1px_0_rgba(255,255,255,0.3)] border-transparent"
                : " bg-white/[0.06] border border-white/15 text-slate-300 hover:text-white hover:bg-white/15 hover:border-white/25")
            }
          >
            <span>{folder.name}</span>
            <button
              type="button"
              title="Rename folder"
              aria-label={`Rename ${folder.name}`}
              className="opacity-60 hover:opacity-100 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onRename(folder);
              }}
            >
              ✎
            </button>
            <button
              type="button"
              title="Delete folder"
              aria-label={`Delete ${folder.name}`}
              className="opacity-60 hover:opacity-100 hover:text-red-400"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(folder);
              }}
            >
              ×
            </button>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onAdd}
        className={
          chipBase +
          " bg-transparent border border-dashed border-white/20 text-slate-300 hover:text-white hover:border-indigo-400 hover:bg-indigo-400/10 hover:-translate-y-px"
        }
      >
        + New
      </button>
    </div>
  );
}
