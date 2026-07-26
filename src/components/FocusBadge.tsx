import { Clock } from "lucide-react";

interface FocusBadgeProps {
  onClick?: () => void;
}

export function FocusBadge({ onClick }: FocusBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 text-xs font-semibold text-white/90 transition-all cursor-pointer shadow-sm active:scale-95"
    >
      <Clock className="w-3.5 h-3.5 text-emerald-400" />
      <span>Attendance</span>
    </button>
  );
}
