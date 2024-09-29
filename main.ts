import { MongoClient } from "npm:mongodb";
import { ordersData } from "./orders.ts";

type Users = {
  _id: string;
  name: string;
  age: number;
};

type Item = {
  sku: string;
  qty: number;
  price: number;
};

type Order = {
  _id: number;
  cust_id: string;
  ord_date: Date;
  price: number;
  items: Array<Item>;
  status: string;
};

const URI = "mongodb://127.0.0.1:27017";
const DB = "dat250ass5";

const client = new MongoClient(URI);

const db = client.db(DB);

// Experiment 1

const users = db.collection<Users>("users");

// Select
const existingUsers = await users.find().toArray();

if (existingUsers.length > 0) {
  console.log("Dropping existing users collection");
  await users.drop();
}

const usersData: Array<Users> = [
  { _id: "1", name: "John", age: 25 },
  { _id: "2", name: "Jane", age: 30 },
  { _id: "3", name: "Alice", age: 35 },
];

// Insert
await users.insertMany(usersData);
const usersArr = await users.find().toArray();
console.log(usersArr);

// Update
await users.updateOne({ _id: "1" }, { $set: { age: 26 } });
const usersArr2 = await users.find().toArray();
console.log(usersArr2);

// Delete
await users.deleteOne({ _id: "2" });
const usersArr3 = await users.find().toArray();
console.log(usersArr3);

// Experiment 2

const orders = db.collection<Order>("orders");

const existingOrders = await orders.find().toArray();

if (existingOrders.length > 0) {
  console.log("Dropping existing orders collection");
  await orders.drop();
}

await orders.insertMany(ordersData);

const ordersArr = await orders.find().toArray();
console.log(ordersArr);

const agg1 = orders.aggregate([
  {
    $group: {
      _id: "$cust_id",
      total: { $sum: "$price" },
    },
  },
]);

const agg1Arr = await agg1.toArray();

console.log(agg1Arr);

console.log("Done");

Deno.exit(0);
