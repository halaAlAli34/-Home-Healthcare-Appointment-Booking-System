import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = (global as typeof globalThis & {
  mongoose?: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}).mongoose;

if (!cached) {
  cached = (global as typeof globalThis & {
    mongoose?: {
      conn: typeof mongoose | null;
      promise: Promise<typeof mongoose> | null;
    };
  }).mongoose = {
    conn: null,
    promise: null,
  };
}

export default async function connectDB() {
  if (cached!.conn) return cached!.conn;

  if (!cached!.promise) {
    // TypeScript now knows MONGODB_URI is a string
    cached!.promise = mongoose.connect(MONGODB_URI as string);
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}