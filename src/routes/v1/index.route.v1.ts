import { Router } from "express";
import authRouter from "./auth.route";

const apiv1Router = Router();

apiv1Router.use("/auth", authRouter);

export default apiv1Router;