import {
  client,
  connectToDatabase,
  closeDatabaseConnection,
} from "../01_utils/connect.js";

const dbName = "bank";
const accountsCollection = client.db(dbName).collection("accounts");

const main = async () => {
  try {
    await connectToDatabase();

    // Tek bir belge ekleme 📝
    const singleResult = await accountsCollection.insertOne({
      name: "Mehmet",
      balance: 1200,
      email: "mehmet@example.com",
      createdAt: new Date(),
    });
    console.log(
      `✅ Inserted one document with _id: ${singleResult.insertedId}`
    );

    // Çoklu belge ekleme 📚
    const multipleResult = await accountsCollection.insertMany([
      {
        name: "Fatma",
        balance: 950,
        email: "fatma@example.com",
        createdAt: new Date(),
      },
      {
        name: "Can",
        balance: 2000,
        email: "can@example.com",
        createdAt: new Date(),
      },
    ]);
    console.log(`✅ Inserted ${multipleResult.insertedCount} documents`);
  } catch (err) {
    console.error(`❌ Error inserting documents: ${err}`);
  } finally {
    await closeDatabaseConnection();
  }
};

main();
