"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../../utils/Winston"))(config.log).logger;
const axios = require("axios");

const iCalParser = new (require('../../utils/iCalParser'))();

// const mongoose = require('mongoose');
const provider = new (require('../../utils/modelProvider'))();
const lectureSchema = provider.getLectureSchema();
const courseSchema = provider.getCourseSchema();

module.exports = class LectureProvider {
    /**
     * 
     */
    constructor(dbConnection) {

        this.dbConnection = dbConnection;
        this.course = dbConnection.model('course', courseSchema);
        this.lecture = dbConnection.model('lecture', lectureSchema);

        /**
         * 
         * @param {Date} date 
         * @returns 
         */
        this.cleanUp = (date) => {
            try {
                const query = { lastTouched: { $ne: date } };
                this.lecture.find(query).remove();
                return { status: -1 };
            } catch (e) {
                Winston.error(e);
                return { status: -1 };
            }
        }


        /**
         * 
         * @param {Object} element 
         * @param {Date} date 
         * @returns 
         */
        this.updateDatabase = (element, date) => {
            try {
                const data = { uid: element["uid"], dtstamp: element["dtstamp"], dtstart: element["dtstart"], class: element["class"], created: element["created"], description: element["description"], 'last-modified': element["last-modified"], location: element["location"], summary: element["summary"], dtend: element["dtend"], course: element["course"], lastTouched: date };
                const options = { upsert: true, new: true, useFindAndModify: false };
                const query = { uid: element["uid"] };
                this.lecture.findOneAndUpdate(query, data, options)
                    .then((doc) => {
                        return { status: 1 };
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            } catch (e) {
                Winston.error(e);
                return { status: -1 };
            }

        }
    }

    /**
     * 
     * @returns {Promise }
     */
    async updateLectures() {
        try {
            // await this.course.find({}, 'courses url', function (err, courses) {
            //     if (err) throw new Error(err);



            // })
            const courses = await this.course.find({}).exec();

            const date = (new Date()).toString();
            for (const element of courses) {
                const resElem = await iCalParser.main(element.url);
                for (const item of resElem.events) {
                    item.course = element.course;
                    this.updateDatabase(item, date);
                }
                this.cleanUp(date);
            }
            return { status: 1 }
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }
    }

}

// exports.run = () => {
//     return new Promise((resolve, reject) => {
//         updateLectures(resolve, reject);
//     })
// }

// const updateLectures = async (resolve, reject) => {
//     let courses = [];
//     await course.find({}, 'course url', function (err, res) {
//         if (err) {
//             reject(err);
//         } else {
//             courses = res;
//         }
//     })
//     const date = (new Date()).toString();
//     courses.forEach(element => {
//         iCalParser.main(element.url)
//             .then((res) => {
//                 res.events.forEach(e => {
//                     e.course = element.course;
//                     updateDatabase(e, date, reject);
//                 });
//                 cleanUp(date, reject);
//                 resolve();
//             })
//             .catch((err) => {
//                 reject(err);
//             });
//     });
// }

// //Not used?
// const loadCourses = async (reject) => {
//     course.find({}, 'course url', function (err, res) {
//         if (err) {
//             reject(err);
//         } else {
//             return res;
//         }
//     })
// }