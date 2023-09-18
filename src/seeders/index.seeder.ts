import logger from "../config/logger.config";

export async function runSeeders() {

    const seeders = [

    ];

    for (const seeder of seeders) {
        try {
            await seeder();
            logger.info(`${seeder.name} seeding completed`);
        } catch (error) {
            logger.error(`Error when running ${seeder.name}: ${error}`);
        }
    }
}