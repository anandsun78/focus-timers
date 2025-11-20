import { Schema, model, models, Document } from "mongoose";

export interface TrackerRecord {
  key: string;
  label: string;
  startTime: Date | null;
  totalRelapses: number;
  totalElapsedSeconds: number;
}

export interface DaysDocRecord extends Document {
  id: string;
  trackers: TrackerRecord[];
}

const TrackerSchema = new Schema<TrackerRecord>(
  {
    key: { type: String, required: true },
    label: { type: String, required: true },
    startTime: { type: Date, default: null },
    totalRelapses: { type: Number, default: 0 },
    totalElapsedSeconds: { type: Number, default: 0 },
  },
  { _id: false }
);

const DaysDocSchema = new Schema<DaysDocRecord>({
  id: { type: String, unique: true, default: "singleton" },
  trackers: { type: [TrackerSchema], default: [] },
});

export const DaysDocModel =
  models.DaysDoc || model<DaysDocRecord>("DaysDoc", DaysDocSchema);
