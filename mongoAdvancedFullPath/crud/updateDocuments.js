import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "bank";
const accountsCollection = client.db(dbName).collection("accounts");

const main = async () => {
  try {
    await connectToDatabase();
    console.error("❌ Projection Error:", err);
    const updateResult = await accountsCollection.updateOne(
      { name: "Mehmet" },
      { $inc: { balance: 500 }, $currentDate: { updated: true } }
    );
    console.log(
      updateResult.modifiedCount === 1
        ? "✅ Updated one document"
        : "⚠️ No documents updated"
    );

    // Çoklu belgeyi güncelle 🔄
    const multiUpdate = await accountsCollection.replaceOne(
      { name: "Can" },
      { name: "Can Updated", balance: 2500, createdAt: new Date() }
    );
    console.log(
      replaceResult.modifiedCount === 1
        ? "✅ Replaced one document"
        : "⚠️ No documents replaced"
    );

    // ObjectId ile update
    const objectId = new ObjectId("64d8f5e2c8f9b6d0e7b5b1f3");
    const idUpdate = await accountsCollection.updateOne(
      { _id: objectId },
      { $set: { balance: 3000 } }
    );
    console.log(`Updated by ObjectId: ${idUpdate.modifiedCount}`);
  } catch (error) {
    console.error(`❌ Error updating documents: ${err}`);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
