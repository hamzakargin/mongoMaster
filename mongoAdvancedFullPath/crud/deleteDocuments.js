import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "bank";
const accountsCollection = client.db(dbName).collection("accounts");

const main = async () => {
  try {
    await connectToDatabase();
    // Tek bir belgeyi sil 🗑️
    const deleteOneResult = await accountsCollection.deleteOne({
      name: "Fatma",
    });
    console.log(
      deleteOneResult.deletedCount === 1
        ? "✅ Deleted one document"
        : "⚠️ No documents deleted"
    );
    // Çoklu belgeyi sil 🔥
    const deleteManyResult = await accountsCollection.deleteMany({
      balance: { $lt: 1000 },
    });
    console.log(`✅ Deleted ${deleteManyResult.deletedCount} documents`);
  } catch (error) {
    console.error(`❌ Error deleting documents: ${error}`);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
