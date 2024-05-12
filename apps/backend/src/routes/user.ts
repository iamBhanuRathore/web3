import { Router } from "express";
import userController from "../controller/user";
import { authMiddleware } from "../middleware/auth";

const userRouter = Router();

// sign
userRouter.post("/signIn", userController.signIn);
userRouter.get("/presignedurl", authMiddleware, userController.presignedUrl);
export default userRouter;
