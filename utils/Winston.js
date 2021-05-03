const path = require("path");
const packagejson = require(path.join(process.cwd(), "./package.json"));
const winston = require("winston");
require("winston-daily-rotate-file");


module.exports = class Winston {
    constructor(options) {
        this.options = options;
        this.logger = winston.createLogger({
            level: options.logLevel,
            transports: [
                new winston.transports.DailyRotateFile({
                    filename: './log/%DATE%.log',// path.join(process.cwd(), `./log/${process.title}_%DATE%.log`),                    
                    datePattern: 'YYYY_MM_DD',
                    maxSize: options.logFileMaxSize,
                    maxFiles: options.logFileStorageTime,
                    format: winston.format.combine(
                        winston.format.json(),
                        winston.format.timestamp(),
                        winston.format.prettyPrint(),
                        winston.format.colorize(),
                        winston.format.printf(data => {
                            return `${new Date().toLocaleString()} - [${data.level}] - ${packagejson.name} : ${data.message}`
                        })
                    ),
                }),
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.json(),
                        winston.format.timestamp(),
                        winston.format.prettyPrint(),
                        winston.format.colorize(),
                        winston.format.printf(data => {
                            return `${data.timestamp} - ${data.level} - ${packagejson.name} : ${data.message}`
                        })
                    ),
                    handleExceptions: true,
                    // prettyPrint: true,
                    // colorize: true,
                    // timestamp: new Date().toLocaleString()
                })
            ]
        })
    }

}