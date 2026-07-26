import { useEffect } from "react";
import { apiGet } from "../api/client";
import { queryClient } from "../api/queryClient";
import type {
  AttendanceDay,
  AttendanceMonth,
  FavLink,
  Folder,
  LrtStationsResponse,
} from "../api/types";

function monthInputValue(d = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function todayParam(d = new Date()): string {
  return d.toISOString().split("T")[0];
}

const userTz = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export function usePrefetchDrawers() {
  useEffect(() => {
    const month = monthInputValue();
    const today = todayParam();
    const tz = userTz();

    void queryClient.prefetchQuery({
      queryKey: ["folders"],
      queryFn: () => apiGet<Folder[]>("/folders"),
    });

    void queryClient.prefetchQuery({
      queryKey: ["favlinks", "global_all"],
      queryFn: () => apiGet<FavLink[]>("/favlinks"),
    });

    void queryClient.prefetchQuery({
      queryKey: ["lrt", "stations"],
      queryFn: () => apiGet<LrtStationsResponse>("/lrt/stations"),
    });

    void queryClient.prefetchQuery({
      queryKey: ["attendance", "today", today, tz],
      queryFn: () =>
        apiGet<AttendanceDay>(`/attendance/me?date=${today}&tz=${encodeURIComponent(tz)}`),
    });

    void queryClient.prefetchQuery({
      queryKey: ["attendance", "month", month, tz],
      queryFn: () =>
        apiGet<AttendanceMonth>(
          `/attendance/me/month?month=${month}&tz=${encodeURIComponent(tz)}`
        ),
    });
  }, []);
}
