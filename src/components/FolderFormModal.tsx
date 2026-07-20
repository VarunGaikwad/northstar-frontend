import { useState } from "react";
import { Modal } from "./Modal";

interface FolderFormModalProps {
  open: boolean;
  /** Current name when renaming, null when adding */
  initialName: string | null;
  onClose: () => void;
  onSave: (name: string) => void;
}

const inputCls =
  "w-full bg-black/25 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20";

const btnPrimary =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_6px_18px_rgba(108,140,255,0.35)] hover:-translate-y-px transition cursor-pointer";
const btnGhost =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition cursor-pointer";

export function FolderFormModal(props: FolderFormModalProps) {
  // Key forces remount when the modal opens for a different folder,
  // so form state initializes from props without an effect.
  return (
    <FolderFormInner
      key={`${props.open}-${props.initialName ?? "new"}`}
      {...props}
    />
  );
}

function FolderFormInner({
  open,
  initialName,
  onClose,
  onSave,
}: FolderFormModalProps) {
  const [name, setName] = useState(initialName ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean) return;
    onSave(clean);
  };

  return (
    <Modal
      open={open}
      title={initialName !== null ? "Rename Folder" : "Add Folder"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-slate-300">
            Folder name
          </span>
          <input
            className={inputCls}
            placeholder="Work"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </label>
        <div className="flex justify-end gap-2.5 mt-1">
          <button type="button" className={btnGhost} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={btnPrimary}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  );
}
