import { useQuery } from "@tanstack/react-query";
import { apiGet } from "../client";
import type { QuoteResponse } from "../types";

export function useQuote() {
  return useQuery({
    queryKey: ["quote"],
    queryFn: () => apiGet<QuoteResponse>("/quote"),
    staleTime: 86_400_000,
  });
}
