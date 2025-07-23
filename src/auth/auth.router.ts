import { Router } from "express";

const authRouter = Router();

authRouter.post("/login", (req, res) => {
  res.status(200).json({ status: "OK" });
});

authRouter.post("/register", (req, res) => {
  res.status(200).json({ status: "OK" });
});

authRouter.post("/logout", (req, res) => {
  res.status(200).json({ status: "OK" });
});

authRouter.post("/refresh", (req, res) => {
  res.status(200).json({ status: "OK" });
});

authRouter.post("/forgot-password", (req, res) => {
  res.status(200).json({ status: "OK" });
});

authRouter.post("/reset-password", (req, res) => {
  res.status(200).json({ status: "OK" });
});

authRouter.post("/verify-email", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default authRouter;
