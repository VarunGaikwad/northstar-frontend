import { useState } from "react";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { FolderFormModal } from "./components/FolderFormModal";
import { Header } from "./components/Header";
import { LinkFormModal } from "./components/LinkFormModal";
import { LrtWidget } from "./components/LrtWidget";
import { QuickAccess } from "./components/QuickAccess";
import { SearchBar } from "./components/SearchBar";
import { WeatherWidget } from "./components/WeatherWidget";
import { DEFAULT_STATE, uid } from "./data/defaultData";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { DashboardState, Folder, Link } from "./types";

const STORAGE_KEY = "dashboard.state.v1";

/** Pending deletion target for the confirm dialog */
type DeleteTarget =
  | { kind: "folder"; folder: Folder }
  | { kind: "link"; folderId: string; link: Link }
  | null;

export default function App() {
  const [state, setState] = useLocalStorage<DashboardState>(
    STORAGE_KEY,
    DEFAULT_STATE
  );

  // Modal state
  const [folderModal, setFolderModal] = useState<{
    open: boolean;
    editing: Folder | null;
  }>({ open: false, editing: null });
  const [linkModal, setLinkModal] = useState<{
    open: boolean;
    folderId: string | null;
    editing: Link | null;
  }>({ open: false, folderId: null, editing: null });
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget>(null);

  /* ---- Folder actions ---- */

  const saveFolder = (name: string) => {
    setState((prev) => {
      if (folderModal.editing) {
        return {
          ...prev,
          folders: prev.folders.map((f) =>
            f.id === folderModal.editing!.id ? { ...f, name } : f
          ),
        };
      }
      const folder: Folder = { id: uid(), name, links: [] };
      return {
        ...prev,
        folders: [...prev.folders, folder],
        activeFolderId: folder.id,
      };
    });
    setFolderModal({ open: false, editing: null });
  };

  const deleteFolder = (folder: Folder) => {
    setState((prev) => {
      const folders = prev.folders.filter((f) => f.id !== folder.id);
      return {
        ...prev,
        folders,
        activeFolderId:
          prev.activeFolderId === folder.id
            ? (folders[0]?.id ?? null)
            : prev.activeFolderId,
      };
    });
  };

  /* ---- Link actions ---- */

  const saveLink = (name: string, url: string) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.map((f) => {
        if (f.id !== linkModal.folderId) return f;
        if (linkModal.editing) {
          return {
            ...f,
            links: f.links.map((l) =>
              l.id === linkModal.editing!.id ? { ...l, name, url } : l
            ),
          };
        }
        return { ...f, links: [...f.links, { id: uid(), name, url }] };
      }),
    }));
    setLinkModal({ open: false, folderId: null, editing: null });
  };

  const deleteLink = (folderId: string, link: Link) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.map((f) =>
        f.id === folderId
          ? { ...f, links: f.links.filter((l) => l.id !== link.id) }
          : f
      ),
    }));
  };

  /* ---- Confirm dialog ---- */

  const confirmMessage =
    deleteTarget?.kind === "folder"
      ? `Delete folder "${deleteTarget.folder.name}" and all its links?`
      : deleteTarget?.kind === "link"
        ? `Delete link "${deleteTarget.link.name}"?`
        : "";

  const handleConfirmDelete = () => {
    if (deleteTarget?.kind === "folder") deleteFolder(deleteTarget.folder);
    if (deleteTarget?.kind === "link")
      deleteLink(deleteTarget.folderId, deleteTarget.link);
    setDeleteTarget(null);
  };

  const activeFolderId = state.activeFolderId;

  return (
    <div className="h-screen overflow-hidden font-sans text-slate-100 bg-slate-950">
      {/* Animated background blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <span className="blob w-[560px] h-[560px] bg-indigo-500 -top-40 -left-32" />
        <span className="blob w-[480px] h-[480px] bg-violet-600 -bottom-44 -right-24 [animation-delay:-6s]" />
        <span className="blob w-[380px] h-[380px] bg-emerald-400 top-[35%] left-[55%] [animation-delay:-12s]" />
        <span className="blob w-[300px] h-[300px] bg-sky-400 top-[65%] left-[10%] [animation-delay:-9s]" />
        <div className="bg-dots absolute inset-0" />
      </div>

      <main className="h-full w-full max-w-[1600px] mx-auto px-5 lg:px-10 pt-5 pb-5 flex flex-col min-h-0">
        <Header user={state.user} />

        <SearchBar />

        <section className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.8fr_1fr_1fr] gap-5 overflow-y-auto lg:overflow-visible">
          <QuickAccess
            folders={state.folders}
            activeFolderId={activeFolderId}
            onSelectFolder={(id) =>
              setState((prev) => ({ ...prev, activeFolderId: id }))
            }
            onAddFolder={() => setFolderModal({ open: true, editing: null })}
            onRenameFolder={(folder) =>
              setFolderModal({ open: true, editing: folder })
            }
            onDeleteFolder={(folder) =>
              setDeleteTarget({ kind: "folder", folder })
            }
            onAddLink={() =>
              setLinkModal({
                open: true,
                folderId: activeFolderId,
                editing: null,
              })
            }
            onEditLink={(link) =>
              setLinkModal({ open: true, folderId: activeFolderId, editing: link })
            }
            onDeleteLink={(link) =>
              activeFolderId &&
              setDeleteTarget({ kind: "link", folderId: activeFolderId, link })
            }
          />

          <WeatherWidget weather={state.weather} />
          <LrtWidget />
        </section>
      </main>

      <FolderFormModal
        open={folderModal.open}
        initialName={folderModal.editing?.name ?? null}
        onClose={() => setFolderModal({ open: false, editing: null })}
        onSave={saveFolder}
      />

      <LinkFormModal
        open={linkModal.open}
        link={linkModal.editing}
        onClose={() =>
          setLinkModal({ open: false, folderId: null, editing: null })
        }
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
