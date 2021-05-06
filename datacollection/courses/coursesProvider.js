"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../../utils/Winston"))(config.log).logger;

// const provider = new (require('../../utils/modelProvider'))();
// const coursesSchema = provider.getCourseSchema();
const axios = require("axios");
// const courseUrl = "http://ics.mosbach.dhbw.de/ics/calendars.list";

module.exports = class CoursesProvider {

    /**
     * 
     * @param {String} url - http url to courses
     */
    constructor(url, courses) {
        this.courseUrl = url;
        // this.dbConnection = dbConnection;

        this.courses = courses; //this.dbConnection.model("courses", coursesSchema);
    }

    /**
     * 
     * @param {Object} data 
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async formatAndCleanUp(data) {
        try {
            const result = [];
            const year = (new Date()).getFullYear().toString().substr(2);
            const lines = data.split('\n');
            for (const element of lines) {
                const entry = element.split(';');
                if ((entry[0].match(/\d+/g)) != null && (entry[0].match(/\d+/g))[0] > (year - 4)) {
                    result.push({ course: entry[0], url: entry[1] });
                }
            }
            return result;
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }


    /**    
     * 
     * @param {Object} element 
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateDatabase(element) {
        try {
            const data = { course: element["course"], url: element["url"] };
            const options = { upsert: true, new: true, useFindAndModify: false };
            const query = { course: element["course"] };

            await this.courses.findOneAndUpdate(query, data, options).exec();
            return { status: 1 };
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }

    /**
     * Private method
     *
     * @param {String} url - http url for courses
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateCourses(url) {
        try {
            const res = await axios.get(url);
            const coursesArray = await this.formatAndCleanUp(res.data);
            for (const element of coursesArray) {
                await this.updateDatabase(element);
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
    async run() {
        try {
            await this.updateCourses(this.courseUrl);
            return { status: 1 }
        } catch (e) {
            Winston.error(e);
            return { status: -1 }
        }
    }
}