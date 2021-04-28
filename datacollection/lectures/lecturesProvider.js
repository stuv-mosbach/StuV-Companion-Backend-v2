const iCalParser = require('../../utils/iCalParser');

// const mongoose = require('mongoose');
const provider = new (require('../../utils/modelProvider'))();
const lecture = provider.getLectureSchema();
const course = provider.getCourseSchema();

module.exports = class LectureProvider {
    /**
     * 
     */
    constructor() {

        /**
         * 
         * @param {Date} date 
         * @returns 
         */
        this.cleanUp = (date) => {
            try {
                const query = { lastTouched: { $ne: date } };
                lecture.find(query).remove();
                return { status: -1 };
            } catch (e) {
                console.error(e);
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
                lecture.findOneAndUpdate(query, data, options)
                    .then((doc) => {
                        return { status: 1 };
                    })
                    .catch((err) => {
                        throw new Error(err);
                    });
            } catch (e) {
                console.error(e);
                return { status: -1 };
            }

        }
    }

    async updateLectures() {
        try {
            let courses = [];
            await course.find({}, 'http://ics.mosbach.dhbw.de/ics/calendars.list', function (err, res) {
                if (err) {
                    throw new Error(err);
                } else {
                    courses = res;
                }
            })
            const date = (new Date()).toString();
            for (const element of courses) {
                const res = await iCalParser.main(element.url);
                for (const item of res.events) {
                    item.course = element.course;
                    this.updateDatabase(item, date);
                }
                this.cleanUp(date);
            }
        } catch (e) {
            console.error(e);
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