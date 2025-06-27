import express from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import userController from "../controller/user-controller";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

//User Api
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);

export { userRouter };
