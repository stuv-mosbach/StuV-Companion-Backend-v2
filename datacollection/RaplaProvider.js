"use strict"
const axios = require("axios");
const papa = require("papaparse");
const path = require("path");
const CoursesProvider = require("./coursesProvider");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;

module.exports = class RaplaProvider {


    constructor(url) {
        this.url = url;
    }

    /**
     * 
     * @returns 
     */
    async fetchFromRapla() {
        try {
            const res = await axios.get(this.url, { responseType: 'text', responseEncoding: 'latin1' });
            return papa.parse(res.data, { delimiter: ';', header: true });
        } catch (error) {
            Winston.error(error);
        }
    }

}