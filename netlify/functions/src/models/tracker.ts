// @ts-nocheck
import { Schema, model } from "mongoose";

export interface TrackerRecord {
  key: string;
  label: string;
  startTime: Date | null;
  totalRelapses: number;
  totalElapsedSeconds: number;
}

export interface DaysDocRecord {
  id: string;
  trackers: TrackerRecord[];
}

const TrackerSchema = new Schema(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    startTime: { type: Date, default: null },
    totalRelapses: { type: Number, default: 0 },
    totalElapsedSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

const DaysDocSchema = new Schema({
  id: { type: String, unique: true, default: "singleton" },
  trackers: { type: [TrackerSchema], default: [] },
});

let DaysDocModel;

try {
  DaysDocModel = model("DaysDoc", DaysDocSchema);
} catch {
  DaysDocModel = model("DaysDoc");
}

export { DaysDocModel };
