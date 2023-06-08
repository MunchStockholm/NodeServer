import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import client from './client.js';
import csrf from 'csrf';


const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(morgan('tiny'));

router.get("/", async (req, res) => {
    const csrfToken = req.cookies["XSRF-TOKEN"];
    if (!csrfToken || req.body._csrf !== csrfToken) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
  
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
  
      res.status(200).send(objects);
    } catch (e) {
      console.error(e);
      if (e instanceof MongoClientError) {
        res.status(500).send({ message: "Database Connection Error", error: e.message });
      } else if (e instanceof MongoParseError) {
        res.status(400).send({ message: "Bad Request", error: e.message });
      } else {
        res.status(500).send({ message: "Internal Server Error", error: e.message });
      }
    }
  });
  

router.get("/:id", async (req, res) => {
    const csrfToken = req.cookies["XSRF-TOKEN"];
    if (!csrfToken || req.query._csrf !== csrfToken) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
  
    try {
      const collection = "ArtWork";
      const id = parseInt(req.params.id);
  
      await client.connect();
  
      const result = await client
        .db("GrafittiWallDB")
        .collection(collection)
        .findOne({ _id: id });
  
      await client.close();
      res.status(200).send(result);
    } catch (e) {
      console.error(e);
      if (e instanceof MongoClientError) {
        res.status(500).send({ message: "Database Connection Error", error: e.message });
      } else if (e instanceof MongoParseError) {
        res.status(400).send({ message: "Bad Request", error: e.message });
      } else {
        res.status(500).send({ message: "Internal Server Error", error: e.message });
      }
    }
  });
  

router.post("/", async (req, res) => {
    const csrfToken = req.cookies["XSRF-TOKEN"];
    if (!csrfToken || req.body._csrf !== csrfToken) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
  
    try {
      const collection = "ArtWork";
      const object = req.body;
  
      await client.connect();
  
      const result = await client
        .db("GrafittiWallDB")
        .collection(collection)
        .insertOne(object);
  
      await client.close();
  
      res.status(200).json(sanitizeResult(result));
    } catch (e) {
      console.error(e);
      if (e instanceof MongoClientError) {
        res.status(500).send({ message: "Database Connection Error", error: e.message });
      } else if (e instanceof MongoParseError) {
        res.status(400).send({ message: "Bad Request", error: e.message });
      } else {
        res.status(500).send({ message: "Internal Server Error", error: e.message });
      }
    }
  });
  

function sanitizeResult(result) {
    const sanitizedResult = {
        insertedId: sanitizeField(result.insertedId),
        acknowledged: sanitizeField(result.acknowledged),

    };

    return sanitizedResult;
}

function sanitizeField(value) {

    const DOMPurify = require('dompurify');
    return DOMPurify.sanitize(value);
}


router.put("/:id", async (req, res) => {
    const csrfToken = req.cookies["XSRF-TOKEN"];
    if (!csrfToken || req.body._csrf !== csrfToken) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
  
    try {
      const collection = "ArtWork";
      const id = parseInt(req.params.id);
      const object = req.body;
  
      await client.connect();
  
      const result = await client
        .db("GrafittiWallDB")
        .collection(collection)
        .findOneAndUpdate({ _id: id }, { $set: object });
  
      await client.close();
      res.status(200).json(result.value);
    } catch (e) {
      console.error(e);
      if (e instanceof MongoClientError) {
        res.status(500).send({ message: "Database Connection Error", error: e.message });
      } else if (e instanceof MongoParseError) {
        res.status(400).send({ message: "Bad Request", error: e.message });
      } else {
        res.status(500).send({ message: "Internal Server Error", error: e.message });
      }
    }
  });
  
  router.delete("/:id", async (req, res) => {
    const csrfToken = req.cookies["XSRF-TOKEN"];
    if (!csrfToken || req.body._csrf !== csrfToken) {
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
  
    try {
      const collection = "ArtWork";
      const id = parseInt(req.params.id);
  
      await client.connect();
  
      const result = await client
        .db("GrafittiWallDB")
        .collection(collection)
        .findOneAndDelete({ _id: id });
  
      await client.close();
  
      res.status(200).json(result.value);
    } catch (e) {
      console.error(e);
      if (e instanceof MongoClientError) {
        res.status(500).send({ message: "Database Connection Error", error: e.message });
      } else if (e instanceof MongoParseError) {
        res.status(400).send({ message: "Bad Request", error: e.message });
      } else {
        res.status(500).send({ message: "Internal Server Error", error: e.message });
      }
    }
  });
  
export default router;