// TRANSACTIONS (Çok adımlı işlemler) //
// Node.js 2.1 Transaction Örneği

const session = client.startSession();
try {
  session.startTransaction();
  await orders.oncerOne({ orderId: 1, amount: 200 }, { session });
  await inventory.updateOne(
    { productId: 1 },
    { inc: { stock: -1 } },
    { session }
  );
  await session.commitTransaction();
} catch (error) {
  await session.abortTransaction();
} finally {
  session.endSession();
}
