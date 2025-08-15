// SCHEMA DESIGN (Embedded vs Referenced) //
// Mongo Shell 3.1 Embedded Document Örneği
//Avantaj: Tek sorguda tüm veri gelir.
//Dezavantaj: Veri tekrarları olabilir.
db.order.insertOne({
  customerId: 1,
  items: [
    { productId: 101, quantity: 2, price: 50 },
    { productId: 102, quantity: 1, price: 30 },
  ],
  shipping: { adress: "Street 1", city: "Istanbul" },
});

// Mongo Shell 3.2 Referenced Document Örneği
//Avantaj: Tekrarlanan veri saklanmaz.
//Dezavantaj: Join (lookup) gerektiği için ek maliyet var.
db.order.insert0ne({
  customerId: ObjectId("64d8f5e2c8f9b6d0e7b5b1f3"),
  itemsId: [
    ObjectId("64d8f5e2c8f9b6d0e7b5b1f4"),
    ObjectId("64d8f5e2c8f9b6d0e7b5b1f5"),
  ],
});
// Sonra lookup ile birleştirme
db.orders.aggregate([
  {
    $lookup: {
      from: "items",
      localFields: "itemsId",
      foreingField: "_id",
      as: "itemDetails",
    },
  },
]);

//3.3 One-to-One Embedded
db.users.insert0ne({
  name: "Ali",
  profile: { age: 25, bio: "Developer" },
});

//3.4 One-to-Many Embedded
db.blogs.insert0ne({
  title: "Mongo Guide Advenced dayi",
  comments: [
    { user: "Veli", text: "Great post!" },
    { user: "Ayse", text: "Thanks for sharing" },
  ],
});

//3.5 One-to-Many Referenced
db.blogs.insert0ne({
  title: "Mongo Guide",
  commentIds: [
    ObjectId("64d8f5e2c8f9b6d0e7b5b1f7"),
    ObjectId("64d8f5e2c8f9b6d0e7b5b1f8"),
  ],
});
