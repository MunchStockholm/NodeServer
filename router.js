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

        res.send(objects);
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
            res.send(result);
        } else {
            res.status(404).send("Object not found");
        }
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server error: " + e.message);
    }
});

/*router.get('/', async (req, res) => {
    try {
        const artworks = await ArtworkModel.find({});
        if (artworks.length !== 0) {
            res.json(artworks);
        } else {
            res.status(404).send('No artworks found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const artwork = await ArtworkModel.findOne({ id: req.params.id });
        if (artwork) {
            res.json(artwork);
        } else {
            res.status(404).send('Artwork not found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.post('/', async (req, res) => {
    try {
        const newArtWork = new ArtWork(req.body);
        await newArtWork.save();
        res.status(201).json(newArtWork);
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedArtWork = await ArtworkModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (updatedArtWork) {
            res.status(204).json(updatedArtWork);
        } else {
            res.status(404).send('Artwork not found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const removedArtWork = await ArtworkModel.findOneAndRemove({ id: req.params.id });
        if (removedArtWork) {
            res.json(removedArtWork);
        } else {
            res.status(404).send('Artwork not found');
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});*/

export default router;