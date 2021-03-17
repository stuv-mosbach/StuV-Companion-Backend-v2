// const url = process.env.DB_HOST;
// const port = process.env.DB_PORT;
// const env = "Prod";
const mongoose = require('mongoose');

module.exports = class DatabaseAdapter {
    constructor(dbUrl, dbPort, dbEnv) {
        this.url = dbUrl + ":" + dbPort;
        this.env = dbEnv;

        // start db

    }

    async connect() {
        try {
            const connString = this.url.concat("/", this.env);
            if (!connString || !this.url || !this.env) throw new Error("Parsing of connection String failed!");
            mongoose.connect(connString, { useNewUrlParser: true, useUnifiedTopology: true });

        } catch (e) {
            console.error(e);
        }
    }

    /**
     * 
     * @returns {String} this.url - db connection url: host + ":" + port
     */
    async getDBUrl() {
        return this.url;
    }

    /**
     * 
     * @returns {String} this.env - db environment variable
     */
    async getEnv() {
        return this.env;
    }
}
