const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbFunction = async (dbName) => {
  // creates a new client
  console.log(MONGO_URI);
  const client = await MongoClient(MONGO_URI, options);
  // connect to the client
  await client.connect();
  // connect to the database (db name is provided as an argument to the function)
  const db = client.db(dbName); // <-- changed this as well
  console.log("connected!");
  // close the connection to the database server

  await db.collection("users").insertOne({ name: "Buck Rogers" });

  client.close();
  console.log("disconnected!");
};
