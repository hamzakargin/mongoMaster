import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "shop";
const ordersCollection = client.db(dbName).collection("orders");
const productsCollection = client.db(dbName).collection("products");
const main = async () => {
  try {
    await connectToDatabase();
    // 1️⃣ $match – Filtreleme 🎯
    const highValueOrders = await ordersCollection
      .aggregate([{ $match: { totalAmount: { $gte: 500 } } }])
      .toArray();
    console.log("🎯 High Value Orders:", highValueOrders);
    // 2️⃣ $project – Alan seçme & yeni alan ekleme ✨
    const ordersWithTax = await ordersCollection
      .aggregate([
        {
          $project: {
            _id: 0,
            customerId: 1,
            tax: { $multiply: ["$totalAmount", 0.18] }, // 18% tax
          },
        },
      ])
      .toArray();
    console.log("✨ Orders with Tax:", ordersWithTax);
    // 3️⃣ $group – Gruplama ve toplam/ortalama 📊
    const customerSpending = await ordersCollection
      .aggregate([
        {
          $group: {
            _id: "customerId",
            totalSpent: { $sum: "$totalAmount" },
            avgSpent: { $avg: "totalAmount" },
            orderCount: { $count: {} },
          },
        },
      ])
      .toArray();
    console.log("📊 Customer Spending Stats:", customerSpending);
    // 4️⃣ $sort, $skip, $limit – Pagination ve sıralama 🔄
    const topOrders = await ordersCollection
      .aggregate([
        { $sort: { totalAmount: -1, createdAt: 1 } },
        { $skip: 10 },
        { $limit: 5 },
      ])
      .toArray();
    console.log("🔝 Top Orders Pagination:", topOrders);
    // 5️⃣ $lookup – Join işlemi 🔗
    const ordersWithProducts = await ordersCollection
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "itemIds",
            foreingField: "_id",
            as: "productDetails",
          },
        },
      ])
      .toArray();
    console.log("🔗 Orders with Product Details:", ordersWithProducts);
    // 6️⃣ $unwind – Array açma 🌀
    const ordersExploded = await ordersCollection
      .aggregate([{ $unwind: "$itemsIds" }])
      .toArray();
    console.log("🌀 Orders Unwind itemIds:", ordersExploded);
    // 7️⃣ $bucket – Aralıklarla grupla 📦
    const orderBuckets = await ordersCollection
      .aggregate([
        {
          $bucket: {
            groupBy: "totalAmount",
            boundaries: [0, 50, 100, 500, 1000],
            default: "Other",
            output: {
              count: { $sum: 1 },
              avgAmount: { $avg: "$totalAmount" },
            },
          },
        },
      ])
      .toArray();
    console.log("📦 Orders Bucketed by TotalAmount:", orderBuckets);
    // 8️⃣ $facet – Aynı anda birden fazla pipeline 🔀
    const facetExample = await ordersCollection
      .aggregate([
        {
          $facet: {
            totalOrders: [{ $count: "count" }],
            highValueOrders: [{ $match: { totalAmount: { $gte: 500 } } }],
            lowValueOrders: [{ $match: { totalAmount: { $lt: 100 } } }],
          },
        },
      ])
      .toArray();
    console.log("🔀 Facet Example:", facetExample);
    // 9️⃣ $merge – Sonucu başka koleksiyona yazma 📝
    await ordersCollection
      .aggregate([
        { $match: { status: "completed" } },
        {
          $merge: {
            into: "completedOrders",
            whenMatched: "merge",
            whenNotMatched: "insert",
          },
        },
      ])
      .toArray();
    console.log("📝 Completed Orders merged into collection");
  } catch (error) {
    console.error(`❌ Aggregation Error: ${error}`);
  } finally {
    await closeDatabaseConnection();
  }
};
main();
