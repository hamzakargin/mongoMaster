// Aggregation Pipeline //

// Mongo Shell 1. $match – Filtreleme
db.orders.aggregate([
  { $match: { status: "copmleted", totalAmount: { $gte: 100 } } },
]);
//node.js
await orders
  .aggregate([{ $match: { status: "completed", totalAmount: { $gte: 100 } } }])
  .toArray();

// Mongo Shell 2. $project – Alan seçme & yeni alan ekleme
db.orders.aggregate([
  {
    $project: {
      _id: 0,
      customerName: 1,
      totalAmount: 1,
      tax: { $multiply: ["$totalAmount", 0.18] }, //yeni Alan
    },
  },
]);
Node.js;
await orders
  .aggregate([
    {
      $project: {
        _id: 0,
        customerName: 1,
        totalAmount: 1,
        tax: { $multiply: ["$totalAmount", 0.18] },
      },
    },
  ])
  .toArray();

// Mongo Shell 3. $group – Gruplama ve toplama
db.orders.aggregate([
  {
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$totalAmount" },
      avgSpent: { $avg: "$totalAmount" },
    },
  },
]);
//Node.js
await orders
  .aggregate([
    {
      $group: {
        _id: "$customerId",
        totalSpent: { $sum: "$totalAmount" },
        avgSpent: { $avg: "$totalAmount" },
      },
    },
  ])
  .toArray();

// Mongo Shell 4. $sort – Sıralama
db.orders.aggregate([{ $sort: { totalAmount: -1, creadtedAt: 1 } }]);
//node.js
db.orders.aggregate([{ $sort: { creadtedAt: 1, totalAmount: -1 } }]);

// Mongo Shell 5. $limit & $skip – Pagination
db.orders.aggregate([
  { $sort: { creadtedAt: -1 } },
  { $skip: 10 },
  { $limit: 5 },
]);
//node.js
await orders
  .aggregate([{ $sort: { creadtedAt: -1 } }, { $skip: 10 }, { $limit: 5 }])
  .toArray();

// Mongo Shell 6. $lookup – Join işlemi
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customerId",
      foreignField: _id,
      as: "customerInfo",
    },
  },
]);
//node.js
await orders
  .aggregate([
    {
      $lookup: {
        from: "customers",
        locakField: "customerId",
        foreignField: "_id",
        as: "customerInfo",
      },
    },
  ])
  .toArray();

// Mongo Shell  7. $unwind – Array içini açma
db.orders.aggregate([{ $unwind: "$items" }]);
//node.js
await orders.aggregate([{ $unwind: "items" }]).toArray();

// Mongo Shell 8. $addFields – Yeni alan ekleme
db.orders.aggregate([{ $addFields: { orderYear: { $year: "$createdAt" } } }]);
//Node.js
await orders
  .aggregate([{ $addFields: { orderYear: { $year: "$createdAt" } } }])
  .toArray();

// Mongo Shell 9. $set ve $unset
db.orders.aggregate([
  { $set: { status: "processed" } },
  { $unset: "internalNote" },
]);
//node.js
await orders
  .aggregate([{ $set: { status: "processed" } }, { $unset: "internalNote" }])
  .toArray();

// Mongo Shell 10. $bucket – Verileri aralıklara bölme
db.orders.aggregate([
  {
    $bucket: {
      $groupBy: "$totalAmount",
      boundaries: [0, 50, 100, 500, 1000],
      default: "other",
      output: {
        count: { $sum: 1 },
        avgAmount: { $avg: "$totalAmount" },
      },
    },
  },
]);
//node.js
await orders
  .aggregate([
    {
      $bucket: {
        $groupBy: "$totalAmount",
        boundaries: [0, 50, 100, 500, 1000],
        default: "Other",
        output: { count: { $dum: 1 }, avgAmount: { $avg: "$totalAmount" } },
      },
    },
  ])
  .toArray();

// Mongo Shell 11. $facet – Aynı anda birden fazla pipeline çalıştırma
db.orders.aggregate([
  {
    $facet: {
      totalOrders: [{ $count: "count" }],
      highValueOrders: [{ $match: { totalAmount: { $gte: 500 } } }],
    },
  },
]);
//node.js
await orders
  .aggregate([
    {
      $facet: {
        // 1. Facet: Toplam sipariş sayısı
        totalOrders: [{ $count: "count" }],

        // 2. Facet: Yüksek tutarlı siparişler (500 ve üzeri)
        highValueOrders: [{ $match: { totalAmount: { $gte: 500 } } }],
      },
    },
  ])
  .toArray();

// Mongo Shell 12. $merge – Sonucu başka koleksiyona yazma
db.orders.aggregate([
  { $match: { status: "completed" } },
  {
    $merge: {
      into: "completedOrders",
      whenMatched: "merge",
      whenNotMatched: "insert",
    },
  },
]);
//node.js
await orders
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

// Mongo Shell 13. $out – Sonucu başka koleksiyona yazma (overwrite)
db.orders.aggregate([
  { $match: { status: "pending" } },
  { $out: "pendingOrders" },
]);
//node.js
await orders.aggregate([
  { $match: { status: "pending" } },
  { $out: "pendingOrders" },
]),
  toArray();

// Mongo Shell 14. $count
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $count: "completedOrdesCount" },
]);
//node.js
await orders.aggregate([
  { $match: { status: "copmleted" } },
  { $count: "completedOrdesCount" },
]).toArray;

// Mongo Shell 15. $sample – Rastgele veri seçme
db.orders.aggregate([{ $sample: { size: 3 } }]);
//node.js
db.orders.aggregate([{ $sample: { size: 3 } }]).toArray();
