import { Router } from "express";
import authRouter from "@/auth/auth.router";

const appRouter = Router();

appRouter.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

appRouter.use("/auth", authRouter);

export default appRouter;
