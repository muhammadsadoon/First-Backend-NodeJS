import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import morgan from 'morgan';
import route from './routes/routes.routes.js';
import fs from "node:fs";

config();

if(!fs.existsSync("./upload")){
    fs.mkdirSync("./upload");
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"))

app.use('/api', route);

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});