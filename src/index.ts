import express, { json, Express } from "express";
import cors from "cors";
import { config } from "dotenv";

import UserRoutes from "./routes/userRoutes";
import CarRoutes from "./routes/carRoutes";

config();

const app: Express = express();
const port: number = Number(process.env.PORT) ?? 4000;

app.use(cors());
app.use(json());

app.use("/api/user", UserRoutes);
app.use("/api/car", CarRoutes);

app.listen(port, () => console.log(`Sever is running on ${port} port`));
