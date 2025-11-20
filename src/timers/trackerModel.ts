export interface Tracker {
  key: string;
  label: string;
  startTime: Date | null;
  totalRelapses: number;
  totalElapsedSeconds: number;
}

export interface TrackerDTO extends Omit<Tracker, "startTime"> {
  startTime: string | null;
}

export interface DurationParts {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TrackerMetrics {
  elapsed: DurationParts;
  averageBeforeRelapse: DurationParts;
  progress: number;
  remainingPercent: number;
}

export interface TrackerSummary {
  tracker: Tracker;
  metrics: TrackerMetrics;
}

export interface HeaderSummary {
  label: string;
  progress: number;
  usesSelectedTracker: boolean;
}

export const GOAL_DURATION_DAYS = 60;
export const GOAL_DURATION_MS = GOAL_DURATION_DAYS * 24 * 60 * 60 * 1000;

const MS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;
const MINUTES_IN_HOUR = 60;

const slugify = (label: string): string =>
  label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const uniqueKey = (base: string, existing: Set<string>): string => {
  if (!existing.has(base)) {
    return base;
  }
  let attempt = 1;
  while (existing.has(`${base}-${attempt}`)) {
    attempt += 1;
  }
  return `${base}-${attempt}`;
};

const toDurationParts = (totalSeconds: number): DurationParts => {
  const hours = Math.floor(
    totalSeconds / (SECONDS_IN_MINUTE * MINUTES_IN_HOUR)
  );
  const minutes = Math.floor(
    (totalSeconds % (SECONDS_IN_MINUTE * MINUTES_IN_HOUR)) / SECONDS_IN_MINUTE
  );
  const seconds = totalSeconds % SECONDS_IN_MINUTE;
  return { hours, minutes, seconds };
};

export const trackerFromDto = (dto: TrackerDTO): Tracker => ({
  ...dto,
  startTime: dto.startTime ? new Date(dto.startTime) : null,
});

export const trackerToDto = (tracker: Tracker): TrackerDTO => ({
  ...tracker,
  startTime: tracker.startTime ? tracker.startTime.toISOString() : null,
});

export const addTracker = (trackers: Tracker[], label: string): Tracker[] => {
  const normalized = slugify(label) || `tracker-${Date.now()}`;
  const nextKey = uniqueKey(
    normalized,
    new Set(trackers.map((tracker) => tracker.key))
  );

  const newTracker: Tracker = {
    key: nextKey,
    label: label.trim(),
    startTime: null,
    totalRelapses: 0,
    totalElapsedSeconds: 0,
  };

  return [...trackers, newTracker];
};

const mapTracker = (
  trackers: Tracker[],
  key: string,
  updater: (tracker: Tracker) => Tracker
): Tracker[] =>
  trackers.map((tracker) => (tracker.key === key ? updater(tracker) : tracker));

export const startTracker = (
  trackers: Tracker[],
  key: string,
  now = new Date()
): Tracker[] =>
  mapTracker(trackers, key, (tracker) => ({
    ...tracker,
    startTime: now,
  }));

export const relapseTracker = (
  trackers: Tracker[],
  key: string,
  now = new Date()
): Tracker[] =>
  mapTracker(trackers, key, (tracker) => {
    if (!tracker.startTime) {
      return tracker;
    }
    const elapsedSeconds = Math.floor(
      (now.getTime() - tracker.startTime.getTime()) / MS_IN_SECOND
    );
    return {
      ...tracker,
      startTime: null,
      totalRelapses: tracker.totalRelapses + 1,
      totalElapsedSeconds: tracker.totalElapsedSeconds + elapsedSeconds,
    };
  });

export const resetTracker = (trackers: Tracker[], key: string): Tracker[] =>
  mapTracker(trackers, key, (tracker) => ({
    ...tracker,
    startTime: null,
    totalRelapses: 0,
    totalElapsedSeconds: 0,
  }));

export const deleteTracker = (trackers: Tracker[], key: string): Tracker[] =>
  trackers.filter((tracker) => tracker.key !== key);

export const computeElapsedParts = (
  startTime: Date | null,
  now = new Date()
): DurationParts => {
  if (!startTime) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  const diffMs = now.getTime() - startTime.getTime();
  const diffSeconds = Math.max(0, Math.floor(diffMs / MS_IN_SECOND));
  return toDurationParts(diffSeconds);
};

export const computeProgress = (
  startTime: Date | null,
  now = new Date()
): number => {
  if (!startTime) {
    return 0;
  }
  const diffMs = now.getTime() - startTime.getTime();
  const pct = (diffMs / GOAL_DURATION_MS) * 100;
  return Math.max(0, Math.min(100, Number(pct.toFixed(4))));
};

export const computeAverageRelapseDuration = (
  tracker: Tracker
): DurationParts => {
  if (!tracker.totalRelapses) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  const avgSeconds = Math.floor(
    tracker.totalElapsedSeconds / tracker.totalRelapses
  );
  return toDurationParts(avgSeconds);
};

export const buildTrackerSummary = (
  tracker: Tracker,
  now = new Date()
): TrackerSummary => {
  const progress = computeProgress(tracker.startTime, now);
  const elapsed = computeElapsedParts(tracker.startTime, now);
  const averageBeforeRelapse = computeAverageRelapseDuration(tracker);

  const metrics: TrackerMetrics = {
    elapsed,
    averageBeforeRelapse,
    progress,
    remainingPercent: Math.max(0, 100 - progress),
  };

  return { tracker, metrics };
};

export const deriveHeaderSummary = (
  summaries: TrackerSummary[],
  selectedKey: string
): HeaderSummary | null => {
  if (!summaries.length) {
    return null;
  }

  const selected = summaries.find(
    (summary) =>
      summary.tracker.key === selectedKey && summary.tracker.startTime
  );

  const best = summaries.reduce<TrackerSummary | null>(
    (currentBest, summary) => {
      if (!currentBest) {
        return summary;
      }
      return summary.metrics.progress > currentBest.metrics.progress
        ? summary
        : currentBest;
    },
    null
  );

  const target = selected ?? best;
  if (!target) {
    return null;
  }

  return {
    label: target.tracker.label,
    progress: target.metrics.progress,
    usesSelectedTracker: Boolean(selected),
  };
};
