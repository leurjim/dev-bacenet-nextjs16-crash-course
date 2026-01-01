import mongoose, { Connection, Mongoose } from 'mongoose';

/**
 * Shape of the cached mongoose connection stored on the global object.
 */
interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global type definition to include our mongoose cache.
 *
 * Using `var` here adds the property to the global scope at runtime,
 * and the `declare global` block augments the TypeScript type system
 * so that `global.mongoose` is recognized and properly typed.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Cached connection across hot reloads in development.
 * This prevents creating multiple connections as Next.js reloads files.
 */
let cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * NOTE: Do not validate `MONGODB_URI` at import time. That would cause
 * builds to fail when environment variables are not available during
 * static analysis. Validation is performed at runtime inside
 * `connectToDatabase()` so callers receive a clear runtime error.
 */

/**
 * Connect to MongoDB using Mongoose, reusing the existing connection if available.
 *
 * This function is safe to call from API routes, server components, and
 * other backend-only code in a Next.js application.
 */
export async function connectToDatabase(): Promise<Connection> {
  // If a connection is already established, return it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection promise does not exist yet, create one and store it.
  if (!cached.promise) {
    const MONGODB_URI: string = process.env.MONGODB_URI ?? '';

    if (!MONGODB_URI) {
      throw new Error('Please define the MONGODB_URI environment variable in your environment.');
    }

    const mongooseOptions = {
      bufferCommands: false,
    } satisfies Parameters<typeof mongoose.connect>[1];

    cached.promise = mongoose.connect(MONGODB_URI, mongooseOptions);
  }

  // Wait for the initial connection to resolve and cache the underlying connection.
  const mongooseInstance = await cached.promise;
  cached.conn = mongooseInstance.connection;

  return cached.conn;
}
