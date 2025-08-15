// ===== CONNECT (Node.js Native Driver) =====
import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");
