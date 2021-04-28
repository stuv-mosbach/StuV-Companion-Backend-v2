const axios = require('axios');

// const mongoose = require('mongoose');
// const provider = new (require('../../utils/modelProvider'));
// const courses = mongoose.model('courses', provider.getCourseSchema());

// const courseUrl = "http://ics.mosbach.dhbw.de/ics/calendars.list";

module.exports = class CoursesProvider {

    /**
     * 
     * @param {String} url - http url to courses
     */
    constructor(url) {
        this.courseUrl = url;

    }

    async formatAndCleanUp(data) {
        try {
            const result = [];
            const year = (new Date()).getFullYear().toString().substr(2);
            const lines = data.split('\n');
            lines.forEach(element => {
                const entry = element.split(';');
                if ((entry[0].match(/\d+/g)) != null && (entry[0].match(/\d+/g))[0] > (year - 4)) {
                    result.push({ course: entry[0], url: entry[1] });
                }
            });
            return result;
        } catch (e) {
            console.error(e);
            return { status: -1 }
        }
    }


    /**
     * Private method
     * 
     * @param {Object} element 
     * @returns {Object} {status: {Number}} - e.g. { status: -1 }
     */
    async updateDatabase(element) {
        try {
            const data = { course: element["course"], url: element["url"] };
            const options = { upsert: true, new: true, useFindAndModify: false };
            const query = { course: element["course"] };

            // courses.findOneAndUpdate(query, data, options)
            //     .then((doc) => {

            //     })
            //     .catch((err) => {
            //         reject(err);
            //     });
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
            http.get(url, data => {
                const coursesArray = this.formatAndCleanUp(data.data);
                coursesArray.forEach(element => {
                    this.updateDatabase(element);
                });
                return { status: 1 };
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
            return await this.updateCourses(this.courseUrl);
        } catch (e) {
            console.error(e);
            return { status: -1 }
        }
    }
}

// exports.run = () => {
//     return new Promise((resolve, reject) => {
//         updateCourses(courseUrl, resolve, reject)
//     })
// }

// const updateCourses = (url, resolve, reject) => {
//     axios.get(url)
//         .then((res) => {
//             const coursesArray = formatAndCleanUp(res.data);
//             coursesArray.forEach(element => {
//                 updateDatabase(element, reject);
//             });
//             resolve();
//         })
//         .catch((err) => {
//             reject(err);
//         })
// }

// const formatAndCleanUp = (data) => {
//     const result = [];
//     const year = (new Date()).getFullYear().toString().substr(2);
//     const lines = data.split('\n');
//     lines.forEach(element => {
//         const entry = element.split(';');
//         if ((entry[0].match(/\d+/g)) != null && (entry[0].match(/\d+/g))[0] > (year - 4)) {
//             result.push({ course: entry[0], url: entry[1] });
//         }
//     });
//     return result;
// }

// const updateDatabase = (element, reject) => {
//     const data = { course: element["course"], url: element["url"] };
//     const options = { upsert: true, new: true, useFindAndModify: false };
//     const query = { course: element["course"] };

//     // courses.findOneAndUpdate(query, data, options)
//     //     .then((doc) => {

//     //     })
//     //     .catch((err) => {
//     //         reject(err);
//     //     });
// }
