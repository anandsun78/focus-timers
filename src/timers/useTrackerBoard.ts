import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_GOAL_DURATION_DAYS,
  Tracker,
  addTracker as addTrackerMutation,
  deleteTracker as deleteTrackerMutation,
  relapseTracker as relapseTrackerMutation,
  resetTracker as resetTrackerMutation,
  startTracker as startTrackerMutation,
} from "./trackerModel";
import {
  NetlifyTrackerRepository,
  TrackerRepository,
} from "./trackerRepository";
import { safeStorage } from "../lib/safeStorage";
import { ERROR_TEXT, STORAGE_KEYS, SYNC_STATUS } from "../constants";

type SyncStatus = (typeof SYNC_STATUS)[keyof typeof SYNC_STATUS];

export interface TrackerBoardState {
  trackers: Tracker[];
  loading: boolean;
  loadError?: string;
  syncError?: string;
  syncStatus: SyncStatus;
  selectedKey: string;
  goalDays: number;
}

export interface TrackerBoardActions {
  addTracker(label: string): Promise<void>;
  startTracker(key: string): Promise<void>;
  relapseTracker(key: string): Promise<void>;
  resetTracker(key: string): Promise<void>;
  deleteTracker(key: string): Promise<void>;
  selectTitle(key: string): void;
}

export const useTrackerBoard = (
  repository?: TrackerRepository
): { state: TrackerBoardState; actions: TrackerBoardActions } => {
  const repo = useMemo(
    () => repository ?? new NetlifyTrackerRepository(),
    [repository]
  );

  const [state, setState] = useState<TrackerBoardState>(() => ({
    trackers: [],
    loading: true,
    syncStatus: SYNC_STATUS.idle,
    selectedKey: safeStorage.get(STORAGE_KEYS.selectedTracker) ?? "",
    goalDays: DEFAULT_GOAL_DURATION_DAYS,
    loadError: undefined,
    syncError: undefined,
  }));

  useEffect(() => {
    let cancelled = false;

    repo
      .load()
      .then(({ trackers, goalDays }) => {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          trackers,
          loading: false,
          goalDays,
          loadError: undefined,
        }));
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const message =
          error instanceof Error ? error.message : ERROR_TEXT.loadTrackers;
        setState((prev) => ({
          ...prev,
          loading: false,
          loadError: message,
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [repo]);

  useEffect(() => {
    safeStorage.set(STORAGE_KEYS.selectedTracker, state.selectedKey);
  }, [state.selectedKey]);

  const persistTrackers = useCallback(
    async (trackers: Tracker[]) => {
      setState((prev) => ({ ...prev, syncStatus: SYNC_STATUS.saving }));
      try {
        await repo.save(trackers);
        setState((prev) => ({
          ...prev,
          syncStatus: SYNC_STATUS.idle,
          syncError: undefined,
        }));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : ERROR_TEXT.saveTrackers;
        setState((prev) => ({
          ...prev,
          syncStatus: SYNC_STATUS.error,
          syncError: message,
        }));
      }
    },
    [repo]
  );

  const updateTrackers = useCallback(
    (mutator: (trackers: Tracker[]) => Tracker[]) => {
      const next = mutator(state.trackers);
      setState((prev) => ({ ...prev, trackers: next }));
      return persistTrackers(next);
    },
    [persistTrackers, state.trackers]
  );

  const addTracker = useCallback(
    async (label: string) => {
      const trimmed = label.trim();
      if (!trimmed) {
        return;
      }
      await updateTrackers((trackers) =>
        addTrackerMutation(trackers, trimmed)
      );
    },
    [updateTrackers]
  );

  const startTracker = useCallback(
    (key: string) => updateTrackers((trackers) => startTrackerMutation(trackers, key)),
    [updateTrackers]
  );

  const relapseTracker = useCallback(
    (key: string) => updateTrackers((trackers) => relapseTrackerMutation(trackers, key)),
    [updateTrackers]
  );

  const resetTracker = useCallback(
    (key: string) => updateTrackers((trackers) => resetTrackerMutation(trackers, key)),
    [updateTrackers]
  );

  const deleteTracker = useCallback(
    async (key: string) => {
      await updateTrackers((trackers) => deleteTrackerMutation(trackers, key));
      setState((prev) => ({
        ...prev,
        selectedKey: prev.selectedKey === key ? "" : prev.selectedKey,
      }));
    },
    [updateTrackers]
  );

  const selectTitle = useCallback((key: string) => {
    setState((prev) => ({ ...prev, selectedKey: key }));
  }, []);

  const actions = useMemo<TrackerBoardActions>(
    () => ({
      addTracker,
      startTracker,
      relapseTracker,
      resetTracker,
      deleteTracker,
      selectTitle,
    }),
    [addTracker, startTracker, relapseTracker, resetTracker, deleteTracker, selectTitle]
  );

  return { state, actions };
};
