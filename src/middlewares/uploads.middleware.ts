import { NextFunction, Request, Response } from "express";
import EnvConfig from "../config/env.config";
import logger from "../config/logger.config";
import ErrorResponse from "../utils/ErrorResponse.util";
import multer = require("multer");
import path = require("path");

const crypto = require('crypto');
const fileTypes = /(\.csv|\.xlsx)$/;

const NO_FILE_FOUND = "No file found";
const SOMETHING_WENT_WRONG = "Something went wrong";

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, EnvConfig.UPLOAD_DIR);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, crypto.randomBytes(16).toString("hex") + ext);
    },
});

const fileFilter = (req, file, cb) => {
    let mimetype = fileTypes.test(file.mimetype);
    let extname = fileTypes.test(
        path.extname(file?.originalname).toLowerCase()
    );

    if (mimetype || extname) {
        return cb(null, true);
    }

    cb(new Error("File upload only supports the following filetypes - " + fileTypes));
}

const upload = multer({
    storage: multerStorage,
    fileFilter: fileFilter
})

export default async function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const handleUpload = upload.single('document');

        handleUpload(req, res, async (error: any) => {

            if (!req.file) {
                next(new ErrorResponse(NO_FILE_FOUND, 400));
            } else if (error) {
                next(new ErrorResponse(`${SOMETHING_WENT_WRONG} while uploading file: ${error.message}`, 500));
            } else {
                logger.info(`File ${req.file.originalname} saved successfully on the server at ${req.file.path}`);
                next();
            }
        });

    } catch (e) {
        next(e);
    }
}
