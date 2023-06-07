import express, * as bodyParser from "express";
import {MongoClient, ObjectId} from "mongodb";

const app = express();
const server = app.listen(3001, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";
const collection = "ArtWork";

app.use(bodyParser.json());
app.get("/", async (req, res) => {
    try {
        const client = new MongoClient(connectionString);

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

app.get("/:id", async (req, res) => {
    try {
        const client = new MongoClient(connectionString);
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
