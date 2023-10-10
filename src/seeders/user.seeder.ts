import User from '../models/user.model';
import EnvConfig from '../config/env.config';
import logger from '../config/logger.config';

const seedDefaultUser = async () => {
  try {
    const existingUser = await User.findOne({ email: EnvConfig.DEFAULT_USER_EMAIL });

    if (!existingUser) {
      const defaultUser = new User({
        firstname: EnvConfig.DEFAULT_USER_FIRST_NAME,
        lastname: EnvConfig.DEFAULT_USER_LAST_NAME,
        email: EnvConfig.DEFAULT_USER_EMAIL,
        password: EnvConfig.DEFAULT_USER_PASSWORD,
        picture: '',
        enabled: true,
        isEmailVerified: true,
      });

      await defaultUser.save();
      logger.info('Default user seeded.');
    } else {
      logger.info('Default user already exists in the database.');
    }
  } catch (error) {
    logger.error('Error seeding default user:', error);
  }
};

export default seedDefaultUser;
