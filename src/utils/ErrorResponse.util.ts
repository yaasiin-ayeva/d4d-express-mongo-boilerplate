import EnvConfig from "../config/env.config";

export default class ErrorResponse extends Error {

    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        if (EnvConfig.env === "test") {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}