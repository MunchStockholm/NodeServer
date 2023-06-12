import express, * as bodyParser from "express";
import router from "./router.js";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('', router);

const PORT = process.env.PORT || 3001; // Use the PORT environment variable if available

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});