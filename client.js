import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(connectionString);

export default client;