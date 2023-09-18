const morgan = require('morgan');
import logger from './logger.config';

const format = `:remote-addr - :method :url :status :res[content-length] - :response-time ms`;

const successHandler = morgan(format, {
    skip: (req: any, res: any) => res.statusCode >= 400,
    stream: { write: (message: string) => logger.info(message.trim()) },
});

const errorHandler = morgan(format, {
    skip: (req: any, res: any) => res.statusCode < 400,
    stream: { write: (message: string) => logger.error(message.trim()) },
});

export default {
    successHandler,
    errorHandler
};
