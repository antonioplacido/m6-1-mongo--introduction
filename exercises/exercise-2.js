const { MongoClient } = require("mongodb");
const assert = require("assert");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getGreetings = async (req, res) => {
  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");

  const greetings = await db.collection("greetings").find().toArray();

  let start = 0;
  let limit = 25;

  if (req.query.start !== undefined) {
    start = Number(req.query.start);
  }
  if (req.query.limit !== undefined) {
    limit = Number(req.query.limit);
  }

  const firstGreetings = greetings.slice(0, 25);

  if (greetings) {
    res.status(200).json({
      status: 200,
      message: "Below for a list of languages",
      data: greetings.slice(start, start + limit),
    });
  } else {
    res.status(404).send("404");
  }

  client.close();
};

const getGreeting = async (req, res) => {
  let _id = req.params._id;

  const client = await MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("exercise_1");
  console.log({ _id });
  db.collection("greetings").findOne({ _id }, (err, result) => {
    result
      ? res.status(200).json({ status: 200, _id, data: result })
      : res.status(404).json({ status: 404, _id, data: "Not Found" });
    console.log(_id);
    client.close();
  });
};

const createGreeting = async (req, res) => {
  try {
    const client = await MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("exercise_1");

    const r = await db.collection("greetings").insertOne(req.body);
    assert.equal(1, r.insertedCount);

    res.status(201).json({ status: 201, data: req.body });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

const updateGreeting = async (req, res) => {
  const _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  try {
    await client.connect();

    const db = client.db("exercise_1");
    const query = { _id };
    const newValues = { $set: { ...req.body } };

    if (req.body.hello === undefined) {
      throw new Error("The kids aren't alright");
    }
    const r = await db.collection("greetings").updateOne(query, newValues);
    assert.equal(1, r.matchedCount);
    assert.equal(1, r.modifiedCount);

    res.status(200).json({ status: 200, data: { query, newValues } });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

const deleteGreeting = async (req, res) => {
  let _id = req.params._id;
  const client = await MongoClient(MONGO_URI, options);
  console.log(_id);
  try {
    await client.connect();
    const db = client.db("exercise_1");

    const r = await db.collection("greetings").deleteOne({ _id });
    assert.equal(1, r.deletedCount);

    res.status(204).json({ status: 204, data: _id });
  } catch (err) {
    res.status(500).json({ status: 500, data: req.body, message: err.message });
    console.log(err.stack);
  }
  client.close();
};

module.exports = {
  updateGreeting,
  createGreeting,
  getGreeting,
  getGreetings,
  deleteGreeting,
};
