"use strict";

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("./Winston"))(config.log).logger;

const mongoose = require('mongoose');

module.exports = class DatabaseAdapter {
    constructor(dbUrl, dbPort, dbEnv) {
        this.url = dbUrl + ":" + dbPort;
        this.env = dbEnv;

        // start db

    }

    /**
     * @returns {Object} 
     */
    async connect() {
        try {
            const connString = this.url.concat("/", this.env);
            if (!connString || !this.url || !this.env) throw new Error("Parsing of connection String failed!");

            // mongoose.set('useNewUrlParser', true);
            // mongoose.set('useUnifiedTopology', true);
            // mongoose.set('useCreateIndex', true);
            // mongoose.set('useFindAndModify', false);

            const dbConnection = await mongoose.createConnection(connString, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true
            });
            return { status: 1, dbConnection };
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }

    /**
     * 
     * @returns {String} this.url - db connection url: host + ":" + port
     */
    async getDBUrl() {
        try {
            return this.url;
        } catch (e) {
            Winston.error(e);
        }
    }

    // /**
    //  * 
    //  * @returns {String} this.env - db environment variable
    //  */
    // async getEnv() {
    //     try {
    //         return this.env;
    //     } catch (e) {
    //         Winston.error(e);
    //     }
    // }
}