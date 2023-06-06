require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const controller = require('./controller');
const bodyParser = require('body-parser');

const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const CLUSTER = process.env.CLUSTER;

//const connectionString = `mongodb+srv:/${USER}:${PASSWORD}@cluster.${CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;
const connectionString = "mongodb+srv://carolinevannebo:GacCfJNNIlhU8GYG@cluster.dfjytlp.mongodb.net/?retryWrites=true&w=majority";

mongoose.set('strictQuery', true);
mongoose.connect(connectionString)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB. Error: ', err));

//const corsOptions = {origin: 'http://localhost:3000'};

//app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('', controller);

app.listen(3000, () => console.log('Listening on port 3000...'));