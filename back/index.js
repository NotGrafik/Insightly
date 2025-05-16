const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.MONGO_ACCESS_URL;
const client = new MongoClient(uri);

const app = express();
app.use(cors());
app.use(express.json());

let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("Insightly_DB");
    console.log("MongoDB connecté !");

    app.listen(3001, () => {
      console.log("Serveur API sur http://localhost:3001");
    });
  } catch (err) {
    console.error("Erreur de connexion MongoDB :", err);
    process.exit(1); 
  }
}

startServer();

const User = require("./schema/user");
app.post("/register", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.passwordHash, 10);
    const user = new User({ ...req.body, passwordHash: hashedPassword });
    db.collection("users").insertOne(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'enregistrement de l'utilisateur." });
  }
});

app.post("/login", async (req, res) => {
  try {
    const user = await db.collection("users").findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Utilisateur non trouvé." });
    }
    const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mot de passe incorrect." });
    }
    res.status(200).json({ message: "Connexion réussie." });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la connexion de l'utilisateur." });
  }
})

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
