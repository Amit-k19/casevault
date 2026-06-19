import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import mongoose from "mongoose";


// think of this file as the "phone line" to your database.
// We open the line ONCE and keep reusing it, instead of dialing a fresh call
// every time someone visits a page (that would be slow and would eventually
 // crash MongoDB by opening too many connections).

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is missing. Add it to your .env.local file (see .env.local.example)."
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
