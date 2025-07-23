import express from "express";
import dotenv from "dotenv";
import { httpLogger } from "@/utils/logger";
import appRouter from "@/app.router";

dotenv.config();

const app = express();

app.use(httpLogger);

app.use(express.json());

app.use("/api", appRouter);

export default app;
