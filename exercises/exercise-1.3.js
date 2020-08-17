const { MongoClient } = require("mongodb");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUsers = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("exercise_1");

  const users = await db.collection("users").find().toArray();

  if (users.length > 0) {
    res.status(200).json({ status: 200, message: "Hello friend", users });
  } else {
    res.status(404).send("404");
  }

  client.close();
};

module.exports = { getUsers };
