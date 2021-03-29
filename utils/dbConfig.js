"use strict";

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
            await mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true });
            return { status: 1 };
        } catch (e) {
            console.error(e);
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
            console.error(e);
        }
    }

    /**
     * 
     * @returns {String} this.env - db environment variable
     */
    async getEnv() {
        try {
            return this.env;
        } catch (e) {
            console.error(e);
        }
    }
}
