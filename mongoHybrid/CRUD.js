import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017");
await client.connect();
const db = client.db("myDatabase");
const users = db.collection("users");

// Mongo Shell 1. CREATE (insertOne & insertMany)
db.users.insertOne({
  name: "Mahsun",
  Age: 27,
  email: "mahsun@example.com",
  creadtedAt: new Date(),
});
db.users.insertmany([
  { name: "veli", age: 31, email: "veli@example.com" },
  { name: "Ayse", age: 27, email: "ayse@example.com" },
]);

//Node.js
await users.insertOne({ name: "Mahsun", age: 27 });
await users.insertmany([
  { name: "veli", age: 31, email: "veli@example.com" },
  { name: "Ayse", age: 27, email: "ayse@exaple.com" },
]);

// Mongo Shell 2. READ (find, findOne, filter, projection, sort, limit, skip)
db.users.find(); //All users, tum kullanicilar
db.users.findOne({ name: "Mahsun" }); //tek kayit
db.users.find({ age: { $gt: 25 } }); //filtreleme
db.users.find({}, { name: 1, _id: 0 }); //projection(sadece name alani)
db.users.find().sort({ age: -1 }); //yasa gore azalan sirala
db.users.find().limit(5); //ilk 5 kayit
db.users.find().skip(5); // ilk 5 kaydi atla

//Node.js
await users.find({ age: { $gte: 18 } }).toArray();
await users.find({}, { projection: { name: 1, _id: 0 } }).toArray();
await users.find().sort({ age: -1 }).limit(10).toArray();

// Mongo Shell 3. UPDATE (updateOne, updateMany, replaceOne)
db.users.updateOne(
  { name: "Ali" },
  { $set: { age: 26 }, $currentDate: { updatedAt: true } }
);
db.users.updateMany({ age: { $lt: 18 } }, { $set: { isMinor: true } });
db.users.replaceOne(
  { name: "Ali" },
  { name: "Ali V2", age: 28 } //tum belgeyi degistirir
);
//Node.js
await users.updateOne({ name: "Ali" }, { $inc: { age: 1 } });
await users.updateMany({}, { $set: { status: "active" } });
await users.replaceOne({ name: "Ali" }, { name: "Ali UPDATED", age: 30 });

// Mongo Shell 4. DELETE (deleteOne, deleteMany)
db.users.deleteOne({ name: "Ali" });
db.users.deleteMany({ isMinor: true });
// Mongo Shell 5. EXTRA: ObjectId ile arama
const id = ObjectId("64d8f5e2c8f9b6d0e7b5b1f3");
db.users.findOne({ _id: id });
//Node.js
import { ObjectId } from "mongodb";
await users.findOne({ _id: new ObjectId("64d8f5e2c8f9b6d0e7b5b1f3") });

// Mongo Shell 6. EXTRA: Count & Distinct
db.users.countDocuments({ age: { $gte: 18 } });
db.users.distinct("country");
//Node.js
await users.countDocuments({ age: { $gte: 18 } });
await users.distinct("country");

// Mongo Shell 7. EXTRA: findOneAndUpdate / findOneAndDelete
db.users.findoneAndUpdate(
  { name: "Ali" },
  { $set: { age: 29 } },
  { returnDocument: "after" } //guncelleme yapildiktan sonraki doc doner
);
db.users.findOneAndDelete({ name: "Ali" });
//Node.js
await users.findOneAndDelete(
  { name: "Ali" },
  { $set: { age: 29 } },
  { returnDocument: "after" }
);
await users.findOneAndDelete({ name: "Ali" });
