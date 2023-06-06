import express from "express";
import {MongoClient, ServerApiVersion} from "mongodb";
import path from "path";
import * as bodyParser from "express";

const app = express();
const server = app.listen(3001, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";
const collection = "ArtWork";

app.use(bodyParser.json());
//const { MongoClient } = require("mongodb");

async function listObjectsInCollection(client, databaseName, collectionName) {
    const collection = client.db(databaseName).collection(collectionName);
    const objects = await collection.find().toArray();

    console.log(`Objects in ${databaseName}.${collectionName}:`);
    objects.forEach(obj => console.log(obj));
}

async function test() {
    const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(connectionString);

    try {
        await client.connect();
        await listObjectsInCollection(client, "GrafittiWallDB", "ArtWork");
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

test();


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