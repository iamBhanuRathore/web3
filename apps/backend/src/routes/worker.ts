import { Router } from "express";
import workerController from "../controller/worker";
import { workerAuthMiddleware } from "../middleware/auth";
const workerRouter = Router();

workerRouter.post("/signIn", workerController.signIn);
workerRouter.get("/nextTask", workerAuthMiddleware, workerController.nextTask);
workerRouter.get(
  "/postSubmission",
  workerAuthMiddleware,
  workerController.postSubmission
);
export default workerRouter;
