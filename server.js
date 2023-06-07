import express, * as bodyParser from "express";
import {MongoClient, ObjectId} from "mongodb";
import router from "./router.js";

const app = express();
const server = app.listen(3001, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";
const collection = "ArtWork";

app.use(bodyParser.json());
app.use('', router);