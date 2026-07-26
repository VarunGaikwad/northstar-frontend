import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost, apiMessage } from "../client";
import { queryClient } from "../queryClient";
import type { FavLink, Folder } from "../types";

export function useFavLinks(folderId?: string | null) {
  const params = folderId ? `?folderId=${encodeURIComponent(folderId)}` : "";
  return useQuery({
    queryKey: ["favlinks", "folder", folderId ?? "none"],
    queryFn: () => apiGet<FavLink[]>(`/favlinks${params}`),
  });
}

/**
 * Fetches all favlinks across all folders globally.
 * Queries root /favlinks as well as each folder's /favlinks?folderId=...
 * and merges/deduplicates them to guarantee 100% link coverage.
 */
export async function fetchAllFavLinksGlobal(): Promise<FavLink[]> {
  const folders = await apiGet<Folder[]>("/folders").catch(() => []);
  const rootLinksPromise = apiGet<FavLink[]>("/favlinks").catch(() => []);

  const folderLinksPromises = (folders || []).map((f) =>
    apiGet<FavLink[]>(`/favlinks?folderId=${encodeURIComponent(f.id)}`).catch(() => [])
  );

  const [rootLinks, ...folderLinksArrays] = await Promise.all([
    rootLinksPromise,
    ...folderLinksPromises,
  ]);

  const map = new Map<string, FavLink>();

  (rootLinks || []).forEach((l) => {
    if (l && l.id) map.set(l.id, l);
  });

  folderLinksArrays.forEach((arr) => {
    (arr || []).forEach((l) => {
      if (l && l.id) map.set(l.id, l);
    });
  });

  return Array.from(map.values());
}

export function useAllFavLinks() {
  return useQuery({
    queryKey: ["favlinks", "global_all"],
    queryFn: fetchAllFavLinksGlobal,
    staleTime: 30_000,
  });
}

export function useFavLink(id: string) {
  return useQuery({
    queryKey: ["favlinks", id],
    queryFn: () => apiGet<FavLink>(`/favlinks/${id}`),
  });
}

export function useCreateFavLink() {
  return useMutation({
    mutationFn: (body: {
      title: string;
      url: string;
      folderId?: string | null;
    }) => apiPost<FavLink>("/favlinks", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favlinks"] }),
  });
}

export function useUpdateFavLink() {
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: {
      id: string;
      title?: string;
      url?: string;
      folderId?: string | null;
    }) => apiPatch<FavLink>(`/favlinks/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favlinks"] }),
  });
}

export function useDeleteFavLink() {
  return useMutation({
    mutationFn: (id: string) => apiMessage(`/favlinks/${id}`, "DELETE"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["favlinks"] }),
  });
}
