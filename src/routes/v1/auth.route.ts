import { Router } from "express";
import authController from "../../controllers/auth.controller";
import authMiddleware from "../../middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", authMiddleware.loginMiddleware, authController.login);

export default authRouter;