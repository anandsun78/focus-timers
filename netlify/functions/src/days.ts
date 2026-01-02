// @ts-nocheck
import type { Handler } from "@netlify/functions";
import { connectToDatabase } from "./lib/mongo";
import { json, badRequest, methodNotAllowed } from "./lib/http";
import { DaysDocModel, DaysDocRecord, TrackerRecord } from "./models/tracker";
import {
  ERROR_TEXT,
  HTTP_METHODS,
  SINGLETON_ID,
  TRACKER_KEY_PREFIX,
  TRACKER_LABEL_FALLBACK,
  ENV_KEYS,
  SESSION_DEFAULT_DAYS,
} from "./constants";
import { readNumericEnv } from "./lib/env";

const parseGoalDays = (): number => {
  const value = readNumericEnv(ENV_KEYS.appSessionDays, SESSION_DEFAULT_DAYS);
  return value > 0 ? value : SESSION_DEFAULT_DAYS;
};

const parseJsonBody = (body: string | null): Record<string, unknown> => {
  if (!body) {
    return {};
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new Error(ERROR_TEXT.invalidJsonPayload);
  }
};

const toDateOrNull = (value: unknown): Date | null => {
  if (typeof value !== "string") {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const toNumberOrZero = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }
  return value;
};

const toStringOrFallback = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim().length > 0
    ? value
    : fallback;
};

const sanitizeTracker = (raw: unknown): TrackerRecord => {
  const data = (raw ?? {}) as Record<string, unknown>;
  return {
    key: toStringOrFallback(data.key, `${TRACKER_KEY_PREFIX}-${Date.now()}`),
    label: toStringOrFallback(data.label, TRACKER_LABEL_FALLBACK),
    startTime: toDateOrNull(data.startTime),
    totalRelapses: toNumberOrZero(data.totalRelapses),
    totalElapsedSeconds: toNumberOrZero(data.totalElapsedSeconds),
  };
};

const sanitizeTrackers = (value: unknown): TrackerRecord[] => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(sanitizeTracker);
};

const serializeTracker = (tracker: TrackerRecord) => ({
  ...tracker,
  startTime: tracker.startTime ? tracker.startTime.toISOString() : null,
});

export const handler: Handler = async (event) => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Failed to connect to Mongo", error);
    return json(500, { ok: false, error: ERROR_TEXT.databaseConnection });
  }

  if (event.httpMethod === HTTP_METHODS.get) {
    const goalDays = parseGoalDays();
    const doc = await DaysDocModel.findOne({ id: SINGLETON_ID })
      .lean<DaysDocRecord>()
      .exec();
    const trackers = doc?.trackers ?? [];
    return json(200, {
      goalDays,
      trackers: trackers.map(serializeTracker),
    });
  }

  if (event.httpMethod === HTTP_METHODS.post) {
    try {
      const payload = parseJsonBody(event.body ?? null);
      const trackers = sanitizeTrackers(payload.trackers);
      const updated = await DaysDocModel.findOneAndUpdate(
        { id: SINGLETON_ID },
        { $set: { trackers }, $setOnInsert: { id: SINGLETON_ID } },
        { upsert: true, new: true }
      )
        .lean<DaysDocRecord>()
        .exec();
      return json(200, {
        ok: true,
        goalDays: parseGoalDays(),
        trackers: (updated?.trackers ?? []).map(serializeTracker),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : ERROR_TEXT.invalidPayload;
      return badRequest(message);
    }
  }

  return methodNotAllowed();
};
