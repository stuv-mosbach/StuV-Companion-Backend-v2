"use strict"
const axios = require("axios");
const papa = require("papaparse");
const path = require("path");
// const CoursesProvider = new (require("./coursesProvider"))();
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;

module.exports = class RaplaProvider {


    constructor(url, CoursesProvider) {
        this.url = url;
        this.CoursesProvider = CoursesProvider;
    }

    /**
     * 
     * @returns 
     */
    async updateCourses(dataSet) {
        try {
            if (!dataSet.length) throw new Error("Fetch data first!");
            const courses = new Set();
            for (const row of dataSet) {
                courses.add({course: row.Kurs});
            }

            for (const element of courses) {
                this.CoursesProvider.updateDatabase(element);
            }
            return { status: 1 };
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }

    /**
     * 
     * @returns 
     */
    async fetchFromRapla() {
        try {
            const res = await axios.get(this.url, { responseType: 'text', responseEncoding: 'latin1' });
            return (papa.parse(res.data, { delimiter: ';', header: true })).data;
        } catch (error) {
            Winston.error(error);
            return { status: -1 }
        }
    }

}