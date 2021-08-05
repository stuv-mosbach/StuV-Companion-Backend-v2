"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;

const axios = require("axios");

module.exports = class CoursesProvider {

    /**
     * Instantiate CoursesProvider
     * 
     * @param {String} url 
     * @param {MongoDb Model} courses 
     */
    constructor(url, courses) {
        this.courseUrl = url;

        this.courses = courses;
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
     *
     * @param {String} url - http url for courses
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateCourses() {
        try {
            const res = await axios.get(this.courseUrl);
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

    // /**
    //  * 
    //  * @returns {Promise} {status: Number} 
    //  */
    // async run() {
    //     try {
    //         await this.updateCourses(this.courseUrl);
    //         return { status: 1 }
    //     } catch (e) {
    //         Winston.error(e);
    //         return { status: -1 }
    //     }
    // }
}