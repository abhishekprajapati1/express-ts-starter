import express from "express";
import dotenv from "dotenv";
import { httpLogger } from "@/utils/logger";
import appRouter from "@/app.router";
import "./database/db"; // Import database connection
import { logger } from "@/utils/logger";

dotenv.config();

const app = express();

// Middleware
app.use(httpLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", appRouter);

// Error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error(err.stack);
    res.status(500).json({
      message: "An unexpected error occurred",
      error: process.env.NODE_ENV === "production" ? undefined : err.message,
    });
  },
);

export default app;
