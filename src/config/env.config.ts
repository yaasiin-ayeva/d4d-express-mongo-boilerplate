require('dotenv').config();

const EnvConfig = {
    env: String(process.env.NODE_ENV),
    APP_PORT: Number(process.env.APP_PORT),
    JWT_KEY: String(process.env.APP_KEY),
    SESSION_KEY: String(process.env.SESSION_KEY),
    JWT_DEV_EXPIRE: String(process.env.JWT_DEV_EXPIRE),
    JWT_PROD_EXPIRE: String(process.env.JWT_PROD_EXPIRE),
    DB_URI: String(process.env.DB_URI),
    SMTP_HOST: String(process.env.SMTP_HOST),
    SMTP_PORT: String(process.env.SMTP_PORT),
    SMTP_EMAIL: String(process.env.SMTP_EMAIL),
    SMTP_PASSWORD: String(process.env.SMTP_PASSWORD),
    FROM_NAME: String(process.env.FROM_NAME),
    FROM_EMAIL: String(process.env.FROM_EMAIL),
    DEFAULT_USER_EMAIL: String(process.env.DEFAULT_USER_EMAIL),
    DEFAULT_USER_PASSWORD: String(process.env.DEFAULT_USER_PASSWORD),
    DEFAULT_USER_FIRST_NAME: String(process.env.DEFAULT_USER_FIRST_NAME),
    DEFAULT_USER_LAST_NAME: String(process.env.DEFAULT_USER_LAST_NAME),
    UPLOAD_DIR: String(process.env.UPLOAD_DIR),
}

export default EnvConfig;