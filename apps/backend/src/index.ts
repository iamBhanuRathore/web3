// const express = require("express");
import expres from "express";
import userRouter from "./routes/user";
import workerRouter from "./routes/worker";
const app = expres();

const port = process.env.PORT || 4000;
app.use("/api/v1/user", userRouter);
app.use("/api/v1/worker", workerRouter);

app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});
