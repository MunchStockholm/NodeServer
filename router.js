import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import client from './client.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
router.use(morgan('tiny'));

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

        res.status(200).send(objects);
    } catch (e) {
        console.error(e);
        if (e instanceof MongoClientError) {
            res.status(500).send({ message: 'Database Connection Error', error: e.message });
        } else if (e instanceof MongoParseError) {
            res.status(400).send({ message: 'Bad Request', error: e.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error', error: e.message });
        }
    }
});

router.get("/:id", async (req, res) => {
    try {
        const collection = "ArtWork";
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid id format.' });
        }

        const o_id = new ObjectId(id);

        await client.connect();

        const result = await client
            .db("GrafittiWallDB")
            .collection(collection)
            .findOne({ _id: o_id });

        await client.close();
        if(result) {
          res.status(200).json(result);
        } else {
            res.status(404).send({ message: 'No document found with the given id.' });
        }
        
    } catch (e) {
        console.error(e);
        if (e instanceof MongoClientError) {
            res.status(500).send({ message: 'Database Connection Error', error: e.message });
        } else if (e instanceof MongoParseError) {
            res.status(400).send({ message: 'Bad Request', error: e.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error', error: e.message });
        }
    }
});

router.post("/", async (req, res) => {
    try {
        const collection = "ArtWork";
        const object = req.body;

        object.CreatedDate = new Date();

        await client.connect();

        const result = await client
            .db("GrafittiWallDB")
            .collection(collection)
            .insertOne(object);

        await client.close();

        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        if (e instanceof MongoClientError) {
            res.status(500).send({ message: 'Database Connection Error', error: e.message });
        } else if (e instanceof MongoParseError) {
            res.status(400).send({ message: 'Bad Request', error: e.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error', error: e.message });
        }
    }
});

router.put("/:id", async (req, res) => {
    try {
        const collection = "ArtWork";
        const object = req.body;
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid id format.' });
        }

        const o_id = new ObjectId(id);

        await client.connect();

        const result = await client
            .db("GrafittiWallDB")
            .collection(collection)
            .findOneAndUpdate({ _id: o_id }, { $set: object });

        await client.close();
        if(result) {
          res.status(200).json(result);
        } else {
            res.status(404).send({ message: 'No document found with the given id.' });
        }
        
    } catch (e) {
        console.error(e);
        if (e instanceof MongoClientError) {
            res.status(500).send({ message: 'Database Connection Error', error: e.message });
        } else if (e instanceof MongoParseError) {
            res.status(400).send({ message: 'Bad Request', error: e.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error', error: e.message });
        }
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const collection = "ArtWork";
        const id = req.params.id;

        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: 'Invalid id format.' });
        }

        const o_id = new ObjectId(id);

        await client.connect();

        const result = await client
            .db("GrafittiWallDB")
            .collection(collection)
            .findOneAndDelete({ _id: o_id });

        await client.close();

        if(result) {
          res.status(200).json(result);
        } else {
            res.status(404).send({ message: 'No document found with the given id.' });
        }
        
    } catch (e) {
        console.error(e);
        if (e instanceof MongoClientError) {
            res.status(500).send({ message: 'Database Connection Error', error: e.message });
        } else if (e instanceof MongoParseError) {
            res.status(400).send({ message: 'Bad Request', error: e.message });
        } else {
            res.status(500).send({ message: 'Internal Server Error', error: e.message });
        }
    }
});

export default router;