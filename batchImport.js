var fs = require("file-system");
const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const greetings = JSON.parse(fs.readFileSync("data/greetings.json"));

const batchImport = async () => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");
    const w = await db.collection("greetings").insertMany(greetings);
    assert.equal(1, w.insertedCount);
  } catch (err) {
    console.log(err.stack);
  }
  client.close();
};

batchImport();
