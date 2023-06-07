import { MongoClient } from "mongodb";
import { expect } from "chai";
import express from"express";
import supertest from"supertest";

const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";
const app = express();
const client = new MongoClient(connectionString);

app.get("/", async (req, res) => {
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

describe("GET /", () => {
    let request;

    before(() => {
        request = supertest(app);
    });

    after(() => {
        // Clean up after the test
        client.close();
    });

    it("should return an array of objects with a 200 status code", (done) => {
        request.get("/")
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an("array");
                done();
            });
    });

    it("should handle errors and return a 500 status code", (done) => {
        // Simulate a database error by closing the client before making the request
        client.close();

        request.get("/")
            .expect(500)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal("Internal server error");
                done();
            });
    });
});