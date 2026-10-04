import { useEffect, useRef, useState } from "react";
import { parseProgress, STORAGE_KEY } from "../data";
import type { ChangeProgress, Progress } from "../types";

function loadProgress(): { checked: Progress; error: string } {
  try {
    return { checked: parseProgress(localStorage.getItem(STORAGE_KEY)), error: "" };
  } catch {
    return { checked: {}, error: "Saved progress could not be read. Changes will stay in this session until you enable saving." };
  }
}

export function useChecklistProgress() {
  const [initial] = useState(loadProgress);
  const [checked, setChecked] = useState<Progress>(initial.checked);
  const [storageError, setStorageError] = useState(initial.error);
  const [savingBlocked, setSavingBlocked] = useState(!!initial.error);
  const dirty = useRef(false);

  useEffect(() => {
    if (!dirty.current || savingBlocked) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
      setStorageError("");
    } catch {
      setStorageError("Browser storage is unavailable. Your checks will only last for this session.");
    }
  }, [checked, savingBlocked]);

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.storageArea !== localStorage || (event.key !== STORAGE_KEY && event.key !== null)) return;
      try {
        dirty.current = false;
        setChecked(parseProgress(event.newValue));
      } catch {
        setStorageError("Could not read the checklist update from another tab.");
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const change: ChangeProgress = (ids, value) => {
    dirty.current = true;
    setChecked(previous => {
      const next = { ...previous };
      ids.forEach(id => { if (value) next[id] = true; else delete next[id]; });
      return next;
    });
  };
  const enableSaving = () => {
    dirty.current = true;
    setSavingBlocked(false);
  };
  return { checked, storageError, savingBlocked, enableSaving, change };
}
