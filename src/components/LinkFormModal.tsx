import { useState } from "react";
import type { Link } from "../types";
import { Modal } from "./Modal";

interface LinkFormModalProps {
  open: boolean;
  /** null = adding a new link, otherwise editing this link */
  link: Link | null;
  onClose: () => void;
  onSave: (name: string, url: string) => void;
}

const inputCls =
  "w-full bg-black/25 border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20";

const btnPrimary =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-indigo-400 to-violet-500 shadow-[0_6px_18px_rgba(108,140,255,0.35)] hover:-translate-y-px transition cursor-pointer";
const btnGhost =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition cursor-pointer";

export function LinkFormModal(props: LinkFormModalProps) {
  // Key forces remount when the modal opens for a different link,
  // so form state initializes from props without an effect.
  return <LinkFormInner key={`${props.open}-${props.link?.id ?? "new"}`} {...props} />;
}

function LinkFormInner({
  open,
  link,
  onClose,
  onSave,
}: LinkFormModalProps) {
  const [name, setName] = useState(link?.name ?? "");
  const [url, setUrl] = useState(link?.url ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let cleanUrl = url.trim();
    const cleanName = name.trim();
    if (!cleanName || !cleanUrl) return;
    // Normalize bare domains so anchor href works
    if (!/^https?:\/\//i.test(cleanUrl)) cleanUrl = "https://" + cleanUrl;
    onSave(cleanName, cleanUrl);
  };

  return (
    <Modal
      open={open}
      title={link ? "Edit Link" : "Add Link"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-slate-300">Name</span>
          <input
            className={inputCls}
            placeholder="Google"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[13px] font-medium text-slate-300">URL</span>
          <input
            className={inputCls}
            placeholder="https://google.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
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
