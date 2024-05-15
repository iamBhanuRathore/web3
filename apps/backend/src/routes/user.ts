import { Router } from "express";
import userController from "../controller/user";
import { authMiddleware } from "../middleware/auth";

const userRouter = Router();

// sign
userRouter.post("/signIn", userController.signIn);
userRouter.post("/task", authMiddleware, userController.createTask);
userRouter.get("/task", authMiddleware, userController.getTask);
userRouter.get("/presignedurl", authMiddleware, userController.presignedUrl);
export default userRouter;
