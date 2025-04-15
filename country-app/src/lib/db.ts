import mongoose, { Mongoose } from 'mongoose';

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Missing MONGODB_URI');
}

const globalWithMongoose = globalThis as typeof globalThis & {
  mongoose: MongooseCache;
};

let cached = globalWithMongoose.mongoose || { conn: null, promise: null };

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;
  
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false
    }).then(m => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;