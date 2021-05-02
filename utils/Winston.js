const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");

module.exports = class Winston {
    constructor(options) {
        this.options = options;
        this.logger = winston.createLogger({
            level: options.logLevel,
            format: winston.format.json(),
            transports: [
                new winston.transports.DailyRotateFile({
                    filename:'./logs/%DATE%.log',// path.join(process.cwd(), `./log/${process.title}_%DATE%.log`),
                    datePattern: 'YYYY_MM_DD',
                    maxSize: options.logFileMaxSize,
                    maxFiles: options.logFileStorageTime,
                    prettyPrint: true,
                    timestamp: new Date().toLocaleString()
                }),
                new winston.transports.Console({
                    handleExceptions: true,
                    prettyPrint: true,
                    colorize: true,
                    timestamp: new Date().toLocaleString()
                })
            ]
        })
    }

}