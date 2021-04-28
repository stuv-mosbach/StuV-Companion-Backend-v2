// const axios = require('axios');

const mongoose = require('mongoose');
const provider = new (require('../../utils/modelProvider'));
const courses = mongoose.model('courses', provider.getCourseSchema());

// const courseUrl = "http://ics.mosbach.dhbw.de/ics/calendars.list";

module.exports = class CoursesProvider {

    /**
     * 
     * @param {String} url - http url to courses
     */
    constructor(url) {
        this.courseUrl = url;

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
            console.error(e);
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

            await courses.findOneAndUpdate(query, data, options);
            return { status: 1 };
        } catch (e) {
            console.error(e);
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
            http.get(url, async (data) => {
                try {
                    const coursesArray = this.formatAndCleanUp(data.data);
                    for (const element of coursesArray) {
                        await this.updateDatabase(element);
                    }
                    return { status: 1 };
                } catch (e) {
                    console.error(e);
                    return { status: -1 }
                }
            })
        } catch (e) {
            console.error(e);
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
            console.error(e);
            return { status: -1 }
        }
    }
}