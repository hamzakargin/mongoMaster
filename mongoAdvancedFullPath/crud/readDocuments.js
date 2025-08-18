import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "bank";
const accountsCollection = client.db(dbName).collection("accounts");

const main = async () => {
  try {
    await connectToDatabase();
    // Tüm belgeleri çekmek 🏦
    const allAccounts = await accountsCollection.find().toArray();
    console.log("📄 All accounts:", allAccounts);
    // Filtreleme: Bakiye 1000'den büyük olanlar 💰
    const richAccounts = await accountsCollection
      .find({ balance: { $gt: 1000 } })
      .toArray();
    console.log("💸 Rich accounts:", richAccounts);
    // Projection: sadece isim ve bakiye göster
    const namesAndBalances = await accountsCollection
      .find({}, { projection: { name: 1, balance: 1, _id: 0 } })
      .toArray();
    console.log("👤 Names & Balances:", namesAndBalances);
    // Pagination: ilk 2 kaydı atla, sonraki 3 kaydı al 🗂️
    const paginated = await accountsCollection
      .find()
      .skip(2)
      .limit(3)
      .toArray();
    console.log("📑 Paginated result:", paginated);
  } catch (error) {
    console.error(`❌ Error reading documents: ${err}`);
  } finally {
    await closeDatabaseConnection;
  }
};

main();
