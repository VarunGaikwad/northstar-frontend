import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../client";
import type { BackgroundResponse } from "../types";

export function useBackground() {
  return useQuery({
    queryKey: ["background"],
    queryFn: () => apiGet<BackgroundResponse>("/background"),
    staleTime: 3_600_000,
  });
}
