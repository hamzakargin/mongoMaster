import {
  connectToDatabase,
  closeDatabaseConnection,
  client,
} from "./connect.js";

const dbName = "bank";
const accountsCollection = client.db(dbName).collection("accounts");

const seedAccounts = [
  { name: "Ali", balance: 1000, createdAt: new Date() },
  { name: "Veli", balance: 1500, createdAt: new Date() },
  { name: "Ayse", balance: 2000, createdAt: new Date() },
];

const main = async () => {
  try {
    await connectToDatabase();
    const result = await accountsCollection.insertMany(seedAccounts);
    console.log(`✅ Inserted ${result.insertedCount} accounts`);
  } catch (error) {
    console.error(`❌ Error seeding data: ${err}`);
  } finally {
    await closeDatabaseConnection();
  }
};
