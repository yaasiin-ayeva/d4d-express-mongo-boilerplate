import EnvConfig from "./env.config";
import mongoose from "mongoose";
import logger from "./logger.config";

const initializeDB = async (runSeeders?: any) => {
    const mongoURI: string = EnvConfig.DB_URI;
    const serverSelectionTimeoutMS: number = 5000;
    const maxRetries = 3;

    for (let i = 1; i <= maxRetries; i++) {
        try {
            await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS,
            });

            if (runSeeders) {
                runSeeders();
            }

            logger.info("Connected to MongoDB");
            break;
        } catch (error) {
            logger.error(`Failed to connect to MongoDB. Retrying: ${i} of ${maxRetries}`);
            if (i === maxRetries) {
                logger.error("Failed to connect to MongoDB", error);
                throw error;
            }
        }
    }
};

export default initializeDB;
