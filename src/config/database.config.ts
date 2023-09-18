import EnvConfig from "./env.config";
import mongoose from "mongoose";
import logger from "./logger.config";

const initializeDB = async (runSeeders?: any) => {
    const mongoURI: string = EnvConfig.DB_URI;
    const serverSelectionTimeoutMS: number = 5000;

    for (let i = 0; i <= 3; i++) {

        try {
            mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS,
            }).then(() => {
                if (runSeeders) {
                    runSeeders();
                }
                logger.info("Connected to MongoDB");
            }).catch((err) => {
                throw err;
            })
            break;
        } catch (error) {
            logger.error(`Failed to connect to MongoDB. Retrying : ${i} of 3`);
            if (i === 3) {
                logger.error("Failed to connect to MongoDB", error);
                throw error;
            }
        }
    }

};

export default initializeDB;