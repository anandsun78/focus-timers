import mongoose from "mongoose";
import { requireEnv } from "./env";

mongoose.set("strictQuery", true);
mongoose.set("bufferCommands", false);

let connectionPromise: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (!connectionPromise) {
    const uri = requireEnv("MONGODB_URI");
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
