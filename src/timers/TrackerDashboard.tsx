import { FormEvent, useMemo, useState } from "react";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useTicker } from "../lib/useTicker";
import { useTrackerBoard } from "./useTrackerBoard";
import { buildTrackerSummary, deriveHeaderSummary } from "./trackerModel";
import { TrackerCard } from "./TrackerCard";
import {
  APP_TITLE,
  SYNC_STATUS,
  TRACKER_TEXT,
  formatDeleteConfirmation,
} from "../constants";

export const TrackerDashboard = () => {
  const { state, actions } = useTrackerBoard();
  const [newLabel, setNewLabel] = useState("");
  const now = useTicker();

  const summaries = useMemo(
    () => state.trackers.map((tracker) => buildTrackerSummary(tracker, now)),
    [state.trackers, now]
  );

  const header = useMemo(
    () => deriveHeaderSummary(summaries, state.selectedKey),
    [summaries, state.selectedKey]
  );

  useDocumentTitle(
    header && header.progress > 0
      ? `${header.progress.toFixed(2)}% (${header.label})`
      : APP_TITLE
  );

  const shouldShowTitleHint =
    state.trackers.length > 0 && !header?.usesSelectedTracker;

  const handleAdd = async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    if (!newLabel.trim()) return;
    await actions.addTracker(newLabel);
    setNewLabel("");
  };

  const handleDelete = async (label: string, key: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(formatDeleteConfirmation(label))
    ) {
      return;
    }
    await actions.deleteTracker(key);
  };

  return (
    <div className="DaysSinceWastedTime">
      <div className="header">
        <div>
          <h1 className="h1">
            {APP_TITLE}
            {header && header.progress > 0 ? (
              <>
                {" "}
                —{" "}
                <span className="badge">
                  <span
                    style={{
                      color: header.usesSelectedTracker ? "#f59e0b" : "#9ca3af",
                      marginRight: 6,
                    }}
                  >
                    {header.usesSelectedTracker
                      ? TRACKER_TEXT.starFilled
                      : TRACKER_TEXT.starOutline}
                  </span>
                  <strong>{header.progress.toFixed(2)}%</strong> • {header.label}
                </span>
              </>
            ) : null}
          </h1>
          {shouldShowTitleHint && (
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
              {TRACKER_TEXT.titleHint} <b>{TRACKER_TEXT.titleHintAction}</b> on
              a card to pin one.
            </div>
          )}
        </div>
        <div className="status-cluster">
          {state.syncStatus === SYNC_STATUS.saving && (
            <span className="status-pill">{TRACKER_TEXT.saving}</span>
          )}
          {state.syncStatus === SYNC_STATUS.error && state.syncError && (
            <span className="status-pill status-pill--error">
              {state.syncError}
            </span>
          )}
        </div>
      </div>

      {state.loadError && (
        <div className="error-banner">
          {TRACKER_TEXT.loadErrorPrefix} {state.loadError}
        </div>
      )}

      <form className="add-tracker-row" onSubmit={handleAdd}>
        <input
          className="input"
          value={newLabel}
          onChange={(event) => setNewLabel(event.target.value)}
          placeholder={TRACKER_TEXT.addPlaceholder}
        />
        <button className="btn" type="submit" disabled={!newLabel.trim()}>
          {TRACKER_TEXT.addButton}
        </button>
      </form>

      {state.loading ? (
        <div className="skeleton" />
      ) : (
        <div className="trackers-grid">
          {summaries.length === 0 ? (
            <div className="empty">{TRACKER_TEXT.emptyState}</div>
          ) : (
            summaries.map((summary) => (
              <TrackerCard
                key={summary.tracker.key}
                summary={summary}
                isSelected={state.selectedKey === summary.tracker.key}
                onSelectTitle={() => actions.selectTitle(summary.tracker.key)}
                onStart={() => {
                  void actions.startTracker(summary.tracker.key);
                }}
                onRelapse={() => {
                  void actions.relapseTracker(summary.tracker.key);
                }}
                onReset={() => {
                  void actions.resetTracker(summary.tracker.key);
                }}
                onDelete={() => {
                  void handleDelete(
                    summary.tracker.label,
                    summary.tracker.key
                  );
                }}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};
