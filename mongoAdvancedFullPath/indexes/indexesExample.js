import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "bank";
const accountsCollection = client.db(dbName).collection("accounts");
const transactionsCollection = client.db(dbName).collection("transactions");

const main = async () => {
  try {
    await connectToDatabase();
    // 1️⃣ Basit Index – email alanı 📨
    await accountsCollection.createIndex({ email: 1 });
    // 2️⃣ Compound Index – customerId ve createdAt 📆
    await transactionsCollection.createIndex({ customerId: 1, createdAt: -1 });
    console.log("✅ Created compound index on customerId + createdAt");
    // 3️⃣ Unique Index – hesap numarası 🔒
    await accountsCollection.createIndex({ accuntNumber: 1 }, { unique: true });
    console.log("🔒 Created unique index on accountNumber");
    // 4️⃣ Text Index – account description için 📝
    await accountsCollection.createIndex({ description: "text" });
    console.log("📝 Created text index on description field");
    // 5️⃣ Geospatial Index – branch konumu 🌍
    await accountsCollection.createIndex({ location: "2dsphere" });
    console.log("🌍 Created geospatial 2dsphere index on location");
    // 6️⃣ Drop Index – Örnek 🗑️
    await accountsCollection.dropIndex("email_1");
    console.log("🗑️ Dropped email_1 index");
    // 🔍 Index sayesinde hızlı sorgular
    const nearBrach = await accountsCollection
      .find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [40.7128, -74.006],
            },
            $maxDistance: 5000,
          },
        },
      })
      .toArray();
    console.log("🏦 Accounts near branch:", nearBranch);
  } catch (error) {
    console.error(`❌ Index error: ${err}`);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
