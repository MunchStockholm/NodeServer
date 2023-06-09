import express, * as bodyParser from "express";
import router from "./router.js";
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('', router);

const PORT = process.env.PORT || 3001; // Use the PORT environment variable if available

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
});