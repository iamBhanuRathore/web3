import { Router } from "express";
import workerController from "../controller/worker";
const workerRouter = Router();

workerRouter.post("/signIn", workerController.signIn);
export default workerRouter;
