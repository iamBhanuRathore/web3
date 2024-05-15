// const express = require("express");
import expres from "express";
import userRouter from "./routes/user";
import workerRouter from "./routes/worker";
const app = expres();

const port = process.env.PORT || 4000;
app.use(expres.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/worker", workerRouter);
app.use("*", (req, res) => {
  return res.status(402).json({
    success: false,
    message: "Not Correct route or wrong Method.",
  });
});
app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});