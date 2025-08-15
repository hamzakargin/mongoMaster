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

//MongoDB Atlas Full-Text Search: $search stage
//Not: Bu özellik MongoDB Atlas bulut servisinde, özel bir search index oluşturduktan sonra kullanılabilir.
//Atlas Search Index oluşturma
//Atlas UI → Collections → Search Indexes → Create Search Index
const indexDefinition = {
  mappings: {
    dynamic: false,
    fields: { type: "string" },
    content: { type: "string" }, //bu title ve content alanlarini arama icin isaretler
  },
};
//basit $search kullanimi (aggregationpipeline)
db.articles.aggregate([
  {
    $search: {
      index: "default", //olusturdugun index adi
      text: {
        query: "mongo performance",
        path: ["title", "content"],
      },
    },
  },
]);
//Nodejs
import { mongoClient } from "mongodb";
async function runAtlassSearch() {
  const client = new mongoClient("your_atlas_connection_string");
  await client.connect();
  const db = client.db("testdb");
  const articles = db.collection("articles");
  const cursor = articles.aggregate([
    {
      $search: {
        index: "default",
        text: {
          query: "mongodb performance",
          path: ["title", "content"],
        },
      },
    },
  ]);
  const results = await cursor.toArray();
  console.log(results);
  await client.close;
}
runAtlassSearch();

// Fuzzy Search (Harf hatalarına tolerans)
db.articles.aggregate([
  {
    $search: {
      index: "default",
      text: {
        query: "mongdb", // yanlis yazilmis kelime
        path: ["title", "content"],
        fuzzy: {
          maxedits: 2, //maksimum 2 karakter hatasi kabul eder
          prefixLength: 1, //kac karakter kesin eslesmeli
        },
      },
    },
  },
]);

//Phrase Search (Birebir cümle araması)
db.articles.aggregate([
  {
    $search: {
      index: "default",
      phrase: {
        query: "mongodb performance",
        path: ["title", "content"],
      },
    },
  },
]);

//Autocomplete Search (Öneri sistemi için)
db.articles.aggregate([
  {
    $search: {
      index: "default",
      autocomplete: {
        query: "mong",
        path: "title",
        fuzzy: {
          maxedits: 1,
        },
      },
    },
  },
]);

// Mongo Shell 1.5 Geospatial Index
db.places.createIndex({ location: "2dsphere" });
db.places.find({
  location: {
    $near: {
      $geometry: { type: "Point", coordinates: [40, 29] },
      $maxdistance: 5000,
    },
  },
});
//nodejs
await places.createIndex({ location: { location: "2ds[here" } });
await places
  .find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [40, 29] },
        $maxDistance: 5000,
      },
    },
  })
  .toArray();

// Mongo Shell 1.6 dropIndex
db.users.dropIndex("email_1");
//nodejs
await users.dropIndex("email_1");
