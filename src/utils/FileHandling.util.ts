import multer = require("multer");
import path = require("path");
import EnvConfig from "../config/env.config";
import logger from "../config/logger.config";

const fs = require("fs");
const crypto = require('crypto');
const XLSX = require("xlsx");


const file_upload = (filetypes: RegExp, destination: string = EnvConfig.UPLOAD_DIR) => {
    let upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, destination);
            },

            filename: function (req, file, cb) {
                const ext = path.extname(file.originalname);
                cb(null, crypto.randomBytes(16).toString("hex") + ext);
            },
        }),
        fileFilter: function (req, file, cb) {
            if (!req.file) {
                cb(new Error("File is required"));
                return;
            }

            let mimetype = filetypes.test(file.mimetype);

            let extname = filetypes.test(
                path.extname(file?.originalname).toLowerCase()
            );

            if (mimetype || extname) {
                return cb(null, true);
            }

            cb(new Error("File upload only supports the following filetypes - " + filetypes));
        },
    });

    return upload;
};


const file_upload_multi = (fields) => {
    let upload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, fields.find((f) => f.name == file.fieldname).dest);
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                cb(null, crypto.randomBytes(16).toString("hex") + ext);
            },
        }),
        fileFilter: (req, file, cb) => {
            let filetypes = fields.find((f) => f.name == file.fieldname).ftypes;

            let mimetype = filetypes.test(file.mimetype);
            let extname = filetypes.test(
                path.extname(file.originalname).toLowerCase()
            );

            if (mimetype && extname) {
                return cb(null, true);
            }

            cb(new Error("File upload only supports the following filetypes - " + filetypes));
        },
    });

    return upload.fields(
        fields.map((f: any) => ({ name: f.name, maxCount: f.maxCount }))
    );
};

const clean_dir = (dir: string) => {
    try {
        fs.readdirSync(dir).forEach((file: any) => {
            if (!file.endsWith(".gitkeep")) {
                fs.unlinkSync(path.join(dir, file));
                logger.info(`${file} deleted`);
            }
        });
    } catch (err) {
        logger.error(err);
    }
}

/**
 * Converts an XLSX file to a CSV file.
 *
 * @param {string} xlsxPath - The path to the XLSX file.
 * @return {Promise<string>} A Promise that resolves to the path of the generated CSV file.
 */
const convert_xlsx_to_csv = async (xlsxPath: string): Promise<string> => {
    return new Promise((resolve, reject) => {

        const wb = XLSX.readFile(xlsxPath, { rawDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const csvPath = xlsxPath + '.csv';
        const ostream = fs.createWriteStream(csvPath);

        ostream.on('finish', () => {
            resolve(csvPath);
        });

        ostream.on('error', (error: any) => {
            reject(error);
        });

        XLSX.stream.to_csv(ws).pipe(ostream);
    });
};

export {
    file_upload,
    file_upload_multi,
    clean_dir,
    convert_xlsx_to_csv,
}