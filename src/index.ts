import express, { json } from "express";
import cors from "cors";
import { config } from "dotenv";

config();

const app = express();
const port: number = Number(process.env.PORT) ?? 4000;

app.use(cors());
app.use(json());

app.listen(port, () => console.log(`Sever is running on ${port} port`));
