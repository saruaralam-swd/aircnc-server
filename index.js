require("colors");
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
    const usersCollection = client.db("AirCnc").collection("users");
    const bookingsCollection = client.db("AirCnc").collection("bookings");

    // user create & generate jwt
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "20d",
      });
      res.send({ result, token });
    });

    // save guest booking
    app.post("/bookings", async (req, res) => {
      const bookingData = req.body;
      const result = await bookingsCollection.insertOne(bookingData);
      res.send(result);
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
