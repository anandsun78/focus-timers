import { TRACKER_TEXT } from "../constants";
import { TrackerSummary } from "./trackerModel";

interface TrackerCardProps {
  summary: TrackerSummary;
  goalDays: number;
  isSelected: boolean;
  onSelectTitle(): void;
  onStart(): void;
  onRelapse(): void;
  onReset(): void;
  onDelete(): void;
}

export const TrackerCard = ({
  summary,
  goalDays,
  isSelected,
  onSelectTitle,
  onStart,
  onRelapse,
  onReset,
  onDelete,
}: TrackerCardProps) => {
  const { tracker, metrics } = summary;
  const isRunning = Boolean(tracker.startTime);
  const average = metrics.averageBeforeRelapse;
  const elapsed = metrics.elapsed;

  return (
    <div className="tracker-card">
      <div className="tracker-card-header">
        <h2 className="tracker-title">
          {tracker.label}
          {isSelected && (
            <span
              style={{
                fontSize: 12,
                marginLeft: 6,
                color: "#f59e0b",
              }}
            >
              {TRACKER_TEXT.titleSuffix}
            </span>
          )}
        </h2>

        <button
          className="icon-btn"
          type="button"
          title={`${TRACKER_TEXT.deletePrefix} ${tracker.label}`}
          onClick={onDelete}
        >
          ✕
        </button>
      </div>

      <div className="meta">
        <span className="chip">
          {isRunning
            ? `${TRACKER_TEXT.currentPrefix} ${elapsed.days}d ${elapsed.hours}h ${elapsed.minutes}m ${elapsed.seconds}s`
            : TRACKER_TEXT.notStarted}
        </span>
        <span className="chip">
          {TRACKER_TEXT.relapsesLabel} {tracker.totalRelapses}
        </span>
        <span className="chip">
          {TRACKER_TEXT.avgBeforeRelapseLabel} {average.days}d {average.hours}h{" "}
          {average.minutes}m{" "}
          {average.seconds}s
        </span>
        <button
          className="chip"
          style={{
            cursor: "pointer",
            background: isSelected ? "#fef3c7" : "#f9fafb",
            borderColor: isSelected ? "#f59e0b" : "#e5e7eb",
          }}
          onClick={onSelectTitle}
        >
          {isSelected ? TRACKER_TEXT.titleTracker : TRACKER_TEXT.setTitle}
        </button>
      </div>

      <div className="progress-wrap">
        <div className="progress-label">
          <span>
            {metrics.progress.toFixed(2)}% to {goalDays}{" "}
            {TRACKER_TEXT.progressToDays}
          </span>
          <span>
            {metrics.remainingPercent.toFixed(2)}%{" "}
            {TRACKER_TEXT.progressLeftSuffix}
          </span>
        </div>
        <progress className="progress" value={metrics.progress} max={100} />
      </div>

      <div className="tracker-buttons">
        {isRunning ? (
          <>
            <button className="btn btn-danger" type="button" onClick={onRelapse}>
              {TRACKER_TEXT.relapsed}
            </button>
            <button className="btn btn-secondary" type="button" onClick={onReset}>
              {TRACKER_TEXT.reset}
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ok" type="button" onClick={onStart}>
              {TRACKER_TEXT.start}
            </button>
            <button className="btn btn-secondary" type="button" onClick={onReset}>
              {TRACKER_TEXT.reset}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
