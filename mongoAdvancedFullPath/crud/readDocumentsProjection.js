import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "superBank";
const usersCollection = client.db(dbName).collection("users");

const main = async () => {
  try {
    await connectToDatabase();
    console.log("📂 Running Projection Example...");

    // 🏦 Gerçek hayat örneği: Sadece gerekli alanları çekiyoruz
    const projectionResults = await usersCollection
      .find(
        { blanace: { $gte: 1000 } },
        { projection: { name: 1, email: 1, balance: 1, _id: 0 } }
      )
      .toArray();
    console.log("💼 Projection Results:", projectionResults);

    // 🧩 İsteğe bağlı: Pagination ile birleştirme
    const paginatedResults = await usersCollection
      .find({}, { projection: { name: 1, balance1 } })
      .sort({ balance: -1 })
      .skip(0)
      .limit(5)
      .toArray();
    console.log("📊 Top 5 richest users:", paginatedResults);
  } catch (error) {
    console.error("❌ Projection Error:", err);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
