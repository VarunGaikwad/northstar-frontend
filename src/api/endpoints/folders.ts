import { useMutation, useQuery } from "@tanstack/react-query";
import { apiGet, apiPatch, apiPost, apiMessage } from "../client";
import { queryClient } from "../queryClient";
import type { Folder } from "../types";

export function useFolders() {
  return useQuery({
    queryKey: ["folders"],
    queryFn: () => apiGet<Folder[]>("/folders"),
  });
}

export function useFolder(id: string) {
  return useQuery({
    queryKey: ["folders", id],
    queryFn: () => apiGet<Folder>(`/folders/${id}`),
  });
}

export function useCreateFolder() {
  return useMutation({
    mutationFn: (body: { name: string; parentId?: string | null }) =>
      apiPost<Folder>("/folders", body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
  });
}

export function useUpdateFolder() {
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: { id: string; name?: string; parentId?: string | null }) =>
      apiPatch<Folder>(`/folders/${id}`, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["folders"] }),
  });
}

export function useDeleteFolder() {
  return useMutation({
    mutationFn: (id: string) => apiMessage(`/folders/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["favlinks"] });
    },
  });
}
