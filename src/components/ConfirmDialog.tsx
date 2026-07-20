import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const btnDanger =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-red-400 to-pink-500 shadow-[0_6px_18px_rgba(255,107,107,0.35)] hover:-translate-y-px transition cursor-pointer";
const btnGhost =
  "px-4 py-2.5 rounded-lg text-sm font-semibold text-slate-300 border border-white/10 hover:bg-white/10 hover:text-white transition cursor-pointer";

export function ConfirmDialog({
  open,
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title="Are you sure?" onClose={onCancel}>
      <p className="text-sm text-slate-300 mb-4">{message}</p>
      <div className="flex justify-end gap-2.5">
        <button type="button" className={btnGhost} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={btnDanger} onClick={onConfirm}>
          Delete
        </button>
      </div>
    </Modal>
  );
}
