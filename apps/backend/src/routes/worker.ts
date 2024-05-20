import { Router } from "express";
import workerController from "../controller/worker";
import { workerAuthMiddleware } from "../middleware/auth";
const workerRouter = Router();

workerRouter.post("/signIn", workerController.signIn);
workerRouter.get("/nextTask", workerAuthMiddleware, workerController.nextTask);
workerRouter.post(
  "/postSubmission",
  workerAuthMiddleware,
  workerController.postSubmission
);
workerRouter.get("/payout", workerAuthMiddleware, workerController.payout);
export default workerRouter;
