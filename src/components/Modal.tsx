import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { IconButton } from "./ui";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Reusable glass modal shell: overlay click + Escape close + ARIA accessibility. */
export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity animate-fade-up"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-white/15 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)] text-white animate-[pop_0.2s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="flex items-center justify-between mb-4">
          <h3 id="modal-title" className="text-lg font-semibold tracking-tight text-white/95">
            {title}
          </h3>
          <IconButton
            icon={<X className="w-4 h-4" />}
            label="Close modal"
            variant="ghost"
            size="sm"
            onClick={onClose}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
