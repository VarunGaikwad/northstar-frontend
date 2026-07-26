import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../client";
import type { LrtRouteSearchResponse, LrtStationsResponse } from "../types";

export function useLrtStations() {
  return useQuery({
    queryKey: ["lrt", "stations"],
    queryFn: () => apiGet<LrtStationsResponse>("/lrt/stations"),
  });
}

export function useLrtSearch({
  from,
  to,
  date,
  enabled = true,
}: {
  from: string | number;
  to: string | number;
  date?: string;
  enabled?: boolean;
}) {
  const params = new URLSearchParams();
  params.set("from", String(from));
  params.set("to", String(to));
  if (date) params.set("date", date);
  return useQuery({
    queryKey: ["lrt", "search", String(from), String(to), date ?? "today"],
    queryFn: () => apiGet<LrtRouteSearchResponse>(`/lrt/search?${params.toString()}`),
    refetchInterval: 60_000,
    enabled,
  });
}
