import { client, connectToDatabase, closeDatabaseConnection } from "01_utils";

const dbName = "shop";
const ordersCollection = client.db(dbName).collection("orders");
const customersCollection = client.db(dbName).collection("customers");
const main = async () => {
  try {
    await connectToDatabase();
    // 1️⃣ $match – Completed siparişler ve totalAmount >= 100 💰
    const matchedOrders = await ordersCollection
      .aggregate([
        { $match: { status: "completed", totalAmount: { $gte: 100 } } },
      ])
      .toArray();
    console.log("✅ Matched Orders:", matchedOrders);
    // 2️⃣ $project – CustomerName, totalAmount, tax hesaplama 🧾
    const projectedOrders = await ordersCollection
      .aggregate([
        {
          $project: {
            _id: 0,
            customerName: 1,
            totalAmount: 1,
            tax: { $multiply: ["$totalAmount", 0.18] }, // 18% tax
          },
        },
      ])
      .toArray();
    console.log("📄 Projected Orders:", projectedOrders);
    // 3️⃣ $group – Müşteri bazlı toplam ve ortalama harcama 👥
    const groupedOrders = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: "customerId",
            totalSpent: { $sum: "totalAmount" },
            avgSpent: { $avg: "totalAmount" },
            count: { $sum: 1 }, //kac siparis
          },
        },
      ])
      .toArray();
    console.log("📊 Grouped Orders by Customer:", groupedOrders);
    // 4️⃣ $sort – En çok harcama yapan müşteriler 🏆
    const sortedOrders = await ordersCollection
      .aggregate([
        {
          $group: { _id: "$customerId", totalSpent: { $sum: "$totalAmount" } },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 }, // Top 5
      ])
      .toArray();
    console.log("🥇 Top 5 Customers by Spending:", sortedOrders);
    // 5️⃣ $lookup – Orders ile Customers join işlemi 🔗
    const ordersWithCustomerInfo = await ordersCollection
      .aggregate([
        {
          $lookup: {
            from: "customers",
            localfield: "customerId",
            foreignField: "_id",
            as: "customerInfo",
          },
        },
        { $unwind: "$customerInfo" }, //array ac
      ])
      .toArray();
    // 6️⃣ $facet – Aynı anda birden fazla pipeline 📂
    const facetExample = await ordersCollection
      .aggregate([
        {
          $facet: {
            totalOrders: [{ $count: "count" }],
            highValueOrdes: [{ $match: { totalAmount: { $gte: 500 } } }],
          },
        },
      ])
      .toArray();
    console.log("📁 Facet Example:", facetExample);
    // 7️⃣ $bucket – Harcama aralıklarına göre gruplama 📊
    const bucketExample = await ordersCollection
      .aggregate([
        {
          $bucket: {
            $groupBy: "$totalAmount",
            boundaries: [0, 100, 500, 1000, 5000],
            default: "other",
            output: {
              count: { $sum: 1 },
              avgAmount: { $avg: "$totalAmount" },
            },
          },
        },
      ])
      .toArray();
    console.log("📊 Bucket Example:", bucketExample);
  } catch (error) {
    console.error(`❌ Error in aggregation: ${err}`);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
