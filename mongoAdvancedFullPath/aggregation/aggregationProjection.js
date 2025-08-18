import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "superBank";
const ordersCollection = client.db(dbName).collection("orders");

const main = async () => {
  try {
    await connectToDatabase();
    console.log("📦 Running Aggregation Projection Example...");
    // 🛒 Gerçek hayat örneği: Kullanıcıya sadece gerekli alanları göster
    const pipeline = [
      {
        $match: { status: "completed" },
      },
      {
        $project: {
          _id: 0,
          orderId: 1,
          customerName: 1,
          totalAmount: 1,
          tax: { $multiply: ["totalAmount", 0.18] },
          shippingCity: "$shipping.city",
        },
      },
      {
        $sort: { totalAmount: -1 },
      },
      {
        $limit: 5,
      },
    ];
    const results = await ordersCollection.aggregate(pipeline).toArray();
    console.log("📊 Top 5 Orders with Projection:", results);
  } catch (error) {
    console.error("❌ Aggregation Projection Error:", error);
  } finally {
    {
      await closeDatabaseConnection();
    }
  }
};
main();
