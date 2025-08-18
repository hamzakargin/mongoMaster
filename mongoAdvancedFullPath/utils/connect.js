import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "mongodb://localhost:27017";
export const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");
    return client;
  } catch (error) {
    console.error(`❌ Connection error: ${err}`);
    throw error;
  }
};

export const closeDatabaseConnection = async () => {
  try {
    await client.close();
    console.log("🔒 MongoDB connection closed");
  } catch (error) {
    console.error(`❌ Error closing DB: ${err}`);
  }
};
