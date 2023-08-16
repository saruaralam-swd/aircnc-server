const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
require("colors");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Database Connection
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const userCollection = client.db("AirCnc").collections("users");

    // create token
    app.post("/jwt", (req, res) => {
      const user = req.body;
      const email = user?.email;
      const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, {
        expiresIn: "30d",
      });
      res.send({ accessToken: token });
    });

    // database connection check
    client.connect();
    console.log("Database Connected".yellow);
  } catch (error) {
    console.log(error.message.bgYellow);
  }
}
run().catch((error) => console.log(error.name.bgRed, error.message));

app.get("/", (req, res) => {
  res.send("Aircnc Server is running...");
});

app.listen(port, () => {
  console.log(`Server is running...on ${port}`.cyan);
});
