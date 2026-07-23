import { useState } from "react";
import { BackgroundImage } from "./components/BackgroundImage";
import { BottomBar } from "./components/BottomBar";
import { Clock } from "./components/Clock";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { FocusPrompt } from "./components/FocusPrompt";
import { FolderFormModal } from "./components/FolderFormModal";
import { LinkFormModal } from "./components/LinkFormModal";
import { SearchBar } from "./components/SearchBar";
import { DEFAULT_STATE, uid } from "./data/defaultData";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { DashboardState, Folder, Link } from "./types";

const STORAGE_KEY = "dashboard.state.v1";

type DeleteTarget =
  | { kind: "folder"; folder: Folder }
  | { kind: "link"; folderId: string; link: Link }
  | null;

export default function App() {
  const [state, setState] = useLocalStorage<DashboardState>(STORAGE_KEY, DEFAULT_STATE);

  const [folderModal, setFolderModal] = useState<{ open: boolean; editing: Folder | null }>({ open: false, editing: null });
  const [linkModal, setLinkModal] = useState<{ open: boolean; folderId: string | null; editing: Link | null }>({ open: false, folderId: null, editing: null });
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  const saveFolder = (name: string) => {
    setState((prev) => {
      if (folderModal.editing) {
        return { ...prev, folders: prev.folders.map((f) => f.id === folderModal.editing!.id ? { ...f, name } : f) };
      }
      const folder: Folder = { id: uid(), name, links: [] };
      return { ...prev, folders: [...prev.folders, folder], activeFolderId: folder.id };
    });
    setFolderModal({ open: false, editing: null });
  };

  const deleteFolder = (folder: Folder) => {
    setState((prev) => {
      const folders = prev.folders.filter((f) => f.id !== folder.id);
      return {
        ...prev,
        folders,
        activeFolderId: prev.activeFolderId === folder.id ? (folders[0]?.id ?? null) : prev.activeFolderId,
      };
    });
  };

  const saveLink = (name: string, url: string) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => {
        if (f.id !== linkModal.folderId) return f;
        if (linkModal.editing) {
          return { ...f, links: f.links.map((l) => l.id === linkModal.editing!.id ? { ...l, name, url } : l) };
        }
        return { ...f, links: [...f.links, { id: uid(), name, url }] };
      }),
    }));
    setLinkModal({ open: false, folderId: null, editing: null });
  };

  const deleteLink = (folderId: string, link: Link) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => f.id === folderId ? { ...f, links: f.links.filter((l) => l.id !== link.id) } : f),
    }));
  };

  const confirmMessage =
    deleteTarget?.kind === "folder"
      ? `Delete folder "${deleteTarget.folder.name}" and all its links?`
      : deleteTarget?.kind === "link"
        ? `Delete link "${deleteTarget.link.name}"?`
        : "";

  const handleConfirmDelete = () => {
    if (deleteTarget?.kind === "folder") deleteFolder(deleteTarget.folder);
    if (deleteTarget?.kind === "link") deleteLink(deleteTarget.folderId, deleteTarget.link);
    setDeleteTarget(null);
  };

  const activeFolderId = state.activeFolderId;

  return (
    <div className="h-screen overflow-hidden font-sans text-white">
      <BackgroundImage />

      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
        <SearchBar />
      </div>

      <main className="relative z-10 h-full flex flex-col items-center justify-center px-4 pb-20">
        <Clock user={state.user} />
        <FocusPrompt />
      </main>

      <BottomBar
        folders={state.folders}
        activeFolderId={activeFolderId}
        weather={state.weather}
        onSelectFolder={(id) => setState((prev) => ({ ...prev, activeFolderId: id }))}
        onAddFolder={() => setFolderModal({ open: true, editing: null })}
        onRenameFolder={(folder) => setFolderModal({ open: true, editing: folder })}
        onDeleteFolder={(folder) => setDeleteTarget({ kind: "folder", folder })}
        onAddLink={() => setLinkModal({ open: true, folderId: activeFolderId, editing: null })}
        onEditLink={(link) => setLinkModal({ open: true, folderId: activeFolderId, editing: link })}
        onDeleteLink={(link) => activeFolderId && setDeleteTarget({ kind: "link", folderId: activeFolderId, link })}
      />

      <FolderFormModal
        open={folderModal.open}
        initialName={folderModal.editing?.name ?? null}
        onClose={() => setFolderModal({ open: false, editing: null })}
        onSave={saveFolder}
      />

      <LinkFormModal
        open={linkModal.open}
        link={linkModal.editing}
        onClose={() => setLinkModal({ open: false, folderId: null, editing: null })}
        onSave={saveLink}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        message={confirmMessage}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
