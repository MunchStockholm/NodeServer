import express, * as bodyParser from "express";
import router from "./router.js";
import cors from "cors";

const app = express();

app.use(cors());

const server = app.listen(3001, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

app.use(bodyParser.json());
app.use('', router);