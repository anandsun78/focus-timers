import {
  API_ENDPOINTS,
  CONTENT_TYPE,
  ERROR_TEXT,
  HTTP_METHODS,
} from "../constants";
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
    const response = await fetch(API_ENDPOINTS.days);
    if (!response.ok) {
      throw new Error(ERROR_TEXT.loadTrackers);
    }
    const payload = await parseJson(response);
    const trackers = Array.isArray(payload.trackers) ? payload.trackers : [];
    return trackers.map(trackerFromDto);
  }

  async save(trackers: Tracker[]): Promise<void> {
    const response = await fetch(API_ENDPOINTS.days, {
      method: HTTP_METHODS.post,
      headers: { "Content-Type": CONTENT_TYPE.json },
      body: JSON.stringify({
        trackers: trackers.map(trackerToDto),
      }),
    });

    if (!response.ok) {
      throw new Error(ERROR_TEXT.saveTrackers);
    }
  }
}
