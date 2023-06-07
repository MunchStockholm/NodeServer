import { MongoClient } from "mongodb";
import dotenv from 'dotenv';

dotenv.config();

const user = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;

const connectionString = `mongodb+srv://${user}:${password}@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(connectionString);

export default client;