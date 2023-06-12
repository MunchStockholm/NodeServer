import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import client from './client.js';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { ObjectId } from 'mongodb';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(morgan('tiny'));

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

let db; // test

router.get("/", async (req, res) => {
  try {

    async function listObjects(client, dbName, collectionName) {
      await client.connect();
      const database = client.db(dbName);
      const collection = database.collection(collectionName);
      const objects = await collection.find({}).toArray();
      return objects;
    }

    const objects = await listObjects(client, "GrafittiWallDB", "ArtWork");

    await client.close();

    res.status(200).json(sanitizeResult(objects));
  } catch (e) {
    console.error(e);
    if (e instanceof MongoClientError) {
      res.status(500).json({ message: "Database Connection Error", error: e.message });
    } else if (e instanceof MongoParseError) {
      res.status(400).json({ message: "Bad Request", error: e.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
  }
});

router.get("/:id", async (req, res) => {
  try {
    const collection = "ArtWork";
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid id format."});
    }
    const o_id = new ObjectId(id);

    await client.connect();

    const result = await client
      .db("GrafittiWallDB")
      .collection(collection)
      .findOne({ _id: o_id });

    await client.close();
    if(result){
        res.status(200).json(sanitizeResult(result));
    }else{
        res.status(404).json({ message: "No document found with the given id."});
    }
  } catch (e) {
    console.error(e);
    if (e instanceof MongoClientError) {
      res.status(500).json({ message: "Database Connection Error", error: e.message });
    } else if (e instanceof MongoParseError) {
      res.status(400).json({ message: "Bad Request", error: e.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
  }
});

router.post("/", async (req, res) => {
  try {
    if (!db) {  // test
      await client.connect();
      db = client.db("GrafittiWallDB");
    }

    //const collection = "ArtWork";
    const collection = db.collection("ArtWork");
    const object = req.body;

    object.CreatedDate = new Date();

    //await client.connect();

    /*const result = await client
      .db("GrafittiWallDB")
      .collection(collection)
      .insertOne(object);

    await client.close();*/

    const result = await collection.insertOne(object);

    res.status(200).json(sanitizeResult(result));
  } catch (e) {
    console.error(e);
    if (e instanceof MongoClientError) {
      res.status(500).json({ message: "Database Connection Error", error: e.message });
    } else if (e instanceof MongoParseError) {
      res.status(400).json({ message: "Bad Request", error: e.message });
    } else if (e.code === 11000) { // Duplicate key error
      res.status(409).json({ message: "Conflict", error: e.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
  }
});

router.put("/:id", async (req, res) => {
  try {
    const collection = "ArtWork";
    const id = req.params.id;
    const object = req.body;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid id format."});
    }
    const o_id = new ObjectId(id);

    await client.connect();

    const result = await client
      .db("GrafittiWallDB")
      .collection(collection)
      .findOneAndUpdate({ _id: o_id }, { $set: object });

    await client.close();

    if(result){
        res.status(200).json(sanitizeResult(result.value));
    }else{
        res.status(404).json({ message: "No document found with the given id."});
    }
  } catch (e) {
    console.error(e);
    if (e instanceof MongoClientError) {
      res.status(500).json({ message: "Database Connection Error", error: e.message });
    } else if (e instanceof MongoParseError) {
      res.status(400).json({ message: "Bad Request", error: e.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const collection = "ArtWork";
    const id = req.params.id;
    await client.connect();

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({message: "Invalid id format."});
    }
    const o_id = new ObjectId(id);

    const result = await client
      .db("GrafittiWallDB")
      .collection(collection)
      .findOneAndDelete({ _id: o_id });

    await client.close();

    if(result){
        res.status(200).json(sanitizeResult(result.value));
    }else{
        res.status(404).json({ message: "No document found with the given id."});
    }
  } catch (e) {
    console.error(e);
    if (e instanceof MongoClientError) {
      res.status(500).json({ message: "Database Connection Error", error: e.message });
    } else if (e instanceof MongoParseError) {
      res.status(400).json({ message: "Bad Request", error: e.message });
    } else {
      res.status(500).json({ message: "Internal Server Error", error: e.message });
    }
  }
});

function sanitizeResult(result) {
  if (Array.isArray(result)) {
    return result.map(obj => {
      return {
        ...obj,
        insertedId: sanitizeField(obj.insertedId),
        acknowledged: sanitizeField(obj.acknowledged),
      };
    });
  } else {
    return {
      ...result,
      insertedId: sanitizeField(result.insertedId),
      acknowledged: sanitizeField(result.acknowledged),
    };
  }
}

function sanitizeField(value) {
  return DOMPurify.sanitize(value);
}

export default router;
