const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_ACCESS_URL;
const client = new MongoClient(uri);

async function connectDB() {
  await client.connect();
  console.log("MongoDB connecté !");
  return client.db("Insightly_DB").collection("sondages");
}

app.get("/sondages", async (req, res) => {
  const collection = await connectDB();
  const data = await collection.find({}).toArray();
  res.json(data);
});

app.post("/sondages", async (req, res) => {
  const collection = await connectDB();
  const result = await collection.insertOne(req.body);
  res.json(result);
});

app.listen(3001, () => {
  console.log("Serveur API sur http://localhost:3001");
});
