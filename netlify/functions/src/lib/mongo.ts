import mongoose from "mongoose";
import { ENV_KEYS } from "../constants";
import { requireEnv } from "./env";

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (!connectionPromise) {
    const uri = requireEnv(ENV_KEYS.mongoUri);
    connectionPromise = mongoose
      .connect(uri, { maxPoolSize: 5, serverSelectionTimeoutMS: 4000 })
      .then(() => mongoose)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }
  return connectionPromise;
};
