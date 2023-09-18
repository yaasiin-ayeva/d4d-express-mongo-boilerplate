import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import EnvConfig from "./config/env.config";
import apiRouter from "./routes/index.router";
import { runSeeders } from "./seeders/index.seeder";
import ExpressMongoSanitize = require("express-mongo-sanitize");
import express = require("express");
import morganConfig from "./config/morgan.config";
import passportConfig from "./config/passport.config";
import passport = require("passport");
import initializeDB from "./config/database.config";
import logger from "./config/logger.config";

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cors = require('cors');
const httpStatus = require('http-status');
const publicContent = require('../app.json');
const PORT = EnvConfig.APP_PORT || 9000;

const corsAllowedOrigins = [
    'http://localhost:3000',
]

const corsOptions = {
    origin: corsAllowedOrigins,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Credentials'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
}

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

const app = express();

if (EnvConfig.env !== 'test') {
    app.use(morganConfig.successHandler);
    app.use(morganConfig.errorHandler);
}

// Security on http headers
app.use(helmet());

// Parse json request
app.use(express.json());

// Parse urlencoded request
app.use(bodyParser.urlencoded({ extended: true }));

// Sanitize requests data
app.use(xss());
app.use(ExpressMongoSanitize());
app.use(hpp())

// gzip compression
app.use(compression());

// API limiter
if (EnvConfig.env === 'production') {
    app.use(apiLimiter);
}

// Enable CORS for all requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// JWT authentication
passportConfig(passport);

// cookie parser
app.use(cookieParser());

app.use('/api', apiRouter);

app.get('/', (_, res) => {
    res.send(publicContent);
});

// Initialize database
initializeDB(runSeeders);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
})