import express from "express";
import userRouter from "./routes/user";
import workerRouter from "./routes/worker";
import cors from "cors";
const app = express();

const port = process.env.PORT || 4000;
// Define allowed origins
const allowedOrigins = [
  // "*",
  "http://localhost:5173",
  "http://localhost:5174",
];

// Configure CORS
// app.use(
//   cors({
//     origin: allowedOrigins,
//     credentials: true,
//   })
// );
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
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
