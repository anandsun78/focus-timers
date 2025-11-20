import { Tracker, trackerFromDto, trackerToDto } from "./trackerModel";

export interface TrackerRepository {
  load(): Promise<Tracker[]>;
  save(trackers: Tracker[]): Promise<void>;
}

const parseJson = async (response: Response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};

export class NetlifyTrackerRepository implements TrackerRepository {
  async load(): Promise<Tracker[]> {
    const response = await fetch("/.netlify/functions/days");
    if (!response.ok) {
      throw new Error("Unable to load trackers");
    }
    const payload = await parseJson(response);
    const trackers = Array.isArray(payload.trackers) ? payload.trackers : [];
    return trackers.map(trackerFromDto);
  }

  async save(trackers: Tracker[]): Promise<void> {
    const response = await fetch("/.netlify/functions/days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        trackers: trackers.map(trackerToDto),
      }),
    });

    if (!response.ok) {
      throw new Error("Unable to persist trackers");
    }
  }
}
