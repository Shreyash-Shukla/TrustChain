import mongoose from "mongoose";

let connectionPromise;

export default async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!process.env.MONGO_URL) {
    throw new Error("MONGO_URL is not configured");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGO_URL).catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }
  return connectionPromise;
}
