const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("colors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Database Connected
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("AirCnc").collection("users");
    console.log("Database Connected".yellow);
  } finally {
    await client.close();
  }
}
run().catch((err) => console.log(err.name, err.message));

app.get("/", (req, res) => {
  res.send("AirCnc server is running");
});

app.listen(port, () => {
  console.log(`server is running on the port ${port}`.cyan);
});
