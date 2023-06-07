import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import client from './client.js';

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
        res.status(500).send("Internal server error");
    }
});

router.get("/:id", async (req, res) => {
    try {
        const collection = "ArtWork";
        const id = parseInt(req.params.id);

        await client.connect();

        const result = await client
            .db("GrafittiWallDB")
            .collection(collection)
            .findOne({ _id: id });

        await client.close();

        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send("Object not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error: " + e.message);
    }
});

router.post("/", async (req, res) => {
    try {
        const collection = "ArtWork";
        const object = req.body;

        await client.connect();

        const result = await client
            .db("GrafittiWallDB")
            .collection(collection)
            .insertOne(object);

        await client.close();

        res.status(200).send(result);
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error: " + e.message);
    }
});



export default router;