import { client, connectToDatabase, closeDatabaseConnection } from "../utils";

const dbName = "banking";
const usersCollection = client.db(dbName).collection("users");
const accountsCollection = client.db(dbName).collection("accounts");
const transactionsCollection = client.db(dbName).collection("transactions");

const main = async () => {
  try {
    await connectToDatabase();
    // 1️⃣ Simple Indexes 🏷️
    // Email için unique index
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("🏷️ Unique index on email created");
    // Age için descending index
    await usersCollection.createIndex({ age: -1 });
    console.log("🏷️ Descending index on age created");
    // 2️⃣ Compound Indexes 🔗
    // Hesap numarası ve oluşturulma tarihine göre
    await accountsCollection.createIndex({ accountsNumber: 1, createdAt: -1 });
    console.log("🔗 Compound index on accountNumber + createdAt created");
    // 3️⃣ Text Index 📝
    // Article veya blog aramaları için
    const articlesCollection = client.db(dbName).collection("articles");
    await articlesCollection.createIndex({ title: "text", content: "text" });
    console.log("📝 Text index on title + content created");
    // 4️⃣ Geospatial Index 🌍
    const branchesCollection = client.db(dbName).collection("branches");
    await branchesCollection.createIndex({ location: "2dsphere" });
    console.log("🌍 Geospatial 2dsphere index created");
    // 5️⃣ Embedded Document Example 🏦
    // Bir müşterinin tüm hesap bilgilerini tek bir dokümanda saklamak
    await usersCollection.insertOne({
      name: "Ali Veli",
      email: "ali.veli@example.com",
      accounts: [
        { accoountNumber: "TR001", type: "savings", balance: 1500 },
        { accoountNumber: "TR002", type: "checking", balance: 1500 },
      ],
      createdAt: new Date(),
    });
    console.log("🏦 Embedded document inserted for user Ali Veli");
    // 6️⃣ Referenced Document Example 🔗
    // Hesaplar ve kullanıcıları ayrı tutmak, lookup ile birleştirmek
    const userId = new ObjectId();
    await usersCollection.insertOne({
      _id: userId,
      name: "Ayse",
      email: "ayse@example.com",
    });
    const acc1Id = new ObjectId();
    const acc2Id = new ObjectId();
    await insertMany([
      {
        _id: acc1Id,
        userId,
        accountNumber: "TR100",
        type: "savings",
        balance: 3000,
      },
      {
        _id: acc2Id,
        userId,
        accountNumber: "TR101",
        type: "checking",
        balance: 1200,
      },
    ]);
    console.log("🔗 Referenced documents inserted for Ayşe");
    // Lookup ile birleştirme (join)
    const userWithAccounts = await usersCollection
      .aggregate([
        { $match: { _id: userId } },
        {
          $lookup: {
            from: "accounts",
            localField: "_id",
            foreignField: "userId",
            as: accountsInfo,
          },
        },
      ])
      .troArray();
    console.log("🔗 User with referenced accounts:", userWithAccounts);
    await usersCollection.insertOne({
      name: "Mehmet",
      profile: { age: 35, bio: "Fullstack Developer", verified: true },
    });
    console.log("👤 One-to-One Embedded document inserted for Mehmet");
    // 8️⃣ One-to-Many Embedded Example 💬
    const blogsCollection = client.db(dbName).collection("blogs");
    await blogsCollection.insertOne({
      title: "Mongodb master",
      comments: [
        { user: "Veli", text: "Great post!Q@@" },
        { user: "Ayse", text: "Unbeliveable postt:D" },
      ],
    });
    console.log("💬 One-to-Many Embedded document inserted for blog comments");
    // 9️⃣ One-to-Many Referenced Example 🔗
    const blogId = new ObjectId();
    await blogsCollection.onsertOne({ _id: blogId, title: "Advanced mongdb" });
    const comment1id = new ObjectId();
    const comment2Id = new ObjectId();
    const commentsCollection = client.db(dbName).collection("comments");
    await commentsCollection.insertMany([
      { _id: comment1Id, blogId, user: "Ali", text: "Nice advanced guide!" },
      { _id: comment2Id, blogId, user: "Ayşe", text: "Very helpful, thanks!" },
    ]);
    const blogWithComments = await blogsCollection
      .aggregate([
        { $match: { id: blogId } },
        {
          $lookup: {
            from: "comments",
            loacalfield: "_id",
            foreignField: "blogId",
            as: "commentsInfo",
          },
        },
      ])
      .troArray();
    console.log("🔗 Blog with referenced comments:", blogWithComments);
  } catch (error) {
    console.error(`❌ Index & Schema Error: ${error}`);
  }
  await closeDatabaseConnection();
};
main();
