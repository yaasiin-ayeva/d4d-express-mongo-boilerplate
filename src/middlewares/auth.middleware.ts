import { NextFunction, Response } from "express";
import { login } from "../validation/auth.validation";
import ErrorResponse from "../utils/ErrorResponse.util";

const loginMiddleware = async (req: any, _res: Response, next: NextFunction) => {
    const schema = login.body;
    const { error } = schema.validate(req.body);

    if (error) {
        return next(new ErrorResponse(error.message, 400));
    }

    next();
}


export default {
    loginMiddleware
}