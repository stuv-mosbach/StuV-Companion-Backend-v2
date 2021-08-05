"use strict"

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;
// const axios = require("axios");

const iCalParser = new (require('../utils/iCalParser'))();

// const mongoose = require('mongoose');
// const provider = new (require('../../utils/modelProvider'))();
// const lectureSchema = provider.getLectureSchema();
// const courseSchema = provider.getCourseSchema();

module.exports = class LectureProvider {
    /**
     * Instantiate LectureProvider
     * 
     * @param {MongoDB Model} course 
     * @param {MongoDB Model} lecture 
     */
    constructor(course, lecture) {

        // this.dbConnection = dbConnection;
        this.course = course; //dbConnection.model('courses', courseSchema);
        this.lecture = lecture; //dbConnection.model('lecture', lectureSchema);

        /**
         * 
         * @param {Date} date 
         * @returns {Promise} {status: Number} 
         */
        this.cleanUp = (date) => {
            try {
                const query = { lastTouched: { $ne: date } };
                this.lecture.find(query).remove();
                return { status: 1 };
            } catch (e) {
                Winston.error(e);
                return { status: -1 };
            }
        }
    }

    /**
     * 
     * @param {*} element 
     * @param {*} date 
     * @returns {Object} {status: Number}  
     */
    async updateDatabase(element, date) {
        try {
            const data = { uid: element["uid"], dtstamp: element["dtstamp"], dtstart: element["dtstart"], class: element["class"], created: element["created"], description: element["description"], 'last-modified': element["last-modified"], location: element["location"], summary: element["summary"], dtend: element["dtend"], course: element["course"], lastTouched: date };
            const options = { upsert: true, new: true, useFindAndModify: false };
            const query = { uid: element["uid"] };
            await this.lecture.findOneAndUpdate(query, data, options).exec();
            return { status: 1 };
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }
    }

    /**
     * 
     * @returns {Object} {status: Number} 
     */
    async updateLectures() {
        try {
            const courses = await this.course.find({}).exec();

            const date = (new Date()).toString();
            for (const element of courses) {
                if (!element.url) continue;
                const resElem = await iCalParser.main(element.url);
                this.cleanUp(date);
                for (const item of resElem.events) {
                    item.course = element.course;
                    await this.updateDatabase(item, date);
                }
            }
            return { status: 1 }
        } catch (e) {
            Winston.error(e);
            return { status: -1 };
        }
    }

}