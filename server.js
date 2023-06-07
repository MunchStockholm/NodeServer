import express, * as bodyParser from "express";
import router from "./router.js";

const app = express();
const server = app.listen(3001, () => {
    console.log(`Started on http://localhost:${server.address().port}`);
});

app.use(bodyParser.json());
app.use('', router);