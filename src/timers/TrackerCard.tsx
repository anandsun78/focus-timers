import { GOAL_DURATION_DAYS, TrackerSummary } from "./trackerModel";

interface TrackerCardProps {
  summary: TrackerSummary;
  isSelected: boolean;
  onSelectTitle(): void;
  onStart(): void;
  onRelapse(): void;
  onReset(): void;
  onDelete(): void;
}

export const TrackerCard = ({
  summary,
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
              ★ title tracker
            </span>
          )}
        </h2>

        <button
          className="icon-btn"
          type="button"
          title={`Delete ${tracker.label}`}
          onClick={onDelete}
        >
          ✕
        </button>
      </div>

      <div className="meta">
        <span className="chip">
          {isRunning
            ? `Current: ${elapsed.hours}h ${elapsed.minutes}m ${elapsed.seconds}s`
            : "Not started"}
        </span>
        <span className="chip">Relapses: {tracker.totalRelapses}</span>
        <span className="chip">
          Avg before relapse: {average.hours}h {average.minutes}m{" "}
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
          {isSelected ? "★ Title tracker" : "Set as title ★"}
        </button>
      </div>

      <div className="progress-wrap">
        <div className="progress-label">
          <span>{metrics.progress.toFixed(2)}% to {GOAL_DURATION_DAYS} days</span>
          <span>{metrics.remainingPercent.toFixed(2)}% left</span>
        </div>
        <progress className="progress" value={metrics.progress} max={100} />
      </div>

      <div className="tracker-buttons">
        {isRunning ? (
          <>
            <button className="btn btn-danger" type="button" onClick={onRelapse}>
              I Relapsed
            </button>
            <button className="btn btn-secondary" type="button" onClick={onReset}>
              Reset
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ok" type="button" onClick={onStart}>
              Start
            </button>
            <button className="btn btn-secondary" type="button" onClick={onReset}>
              Reset
            </button>
          </>
        )}
      </div>
    </div>
  );
};
