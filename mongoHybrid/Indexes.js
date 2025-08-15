// INDEX (İndeksler) //
// Mongo Shell 1.1 createIndex
db.users.createIndex({ email: 1 }); //1:ascending
db.users.createIndex({ age: -1 }); //-1:descending
//nodejs
await users.createIndex({ email: 1 });
await users.createIndex({ age: -1 });

// Mongo Shell 1.2 Compound Index
db.orders.createIndex({ customerId: 1, creadtedAt: -1 });
//node.js
await orders.createIndex({ customerId: 1, creadtedAt: -1 });

// Mongo Shell 1.3 Unique Index
db.users.createIndex({ email: 1 }, { unique: true });
//nodejs
await users.createIndex({ email: 1 }, { unique: true });

// Mongo Shell 1.4 Text Index
db.articles.createIndex({ title: "text", content: "text" });
db.articles.find({ $text: { $search: "mongodbperformance" } });
//nodejs
await articles.createIndex({ title: "text", content: "text" });
await articles.find({ $text: { $search: "mongodbperformance" } });
