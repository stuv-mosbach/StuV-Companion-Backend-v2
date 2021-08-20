"use strict"
const axios = require("axios");
const papa = require("papaparse");
const path = require("path");
// const CoursesProvider = new (require("./coursesProvider"))();
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("../utils/Winston"))(config.log).logger;

module.exports = class RaplaProvider {


    constructor(url, CoursesProvider, LecturesProvider) {
        this.url = url;
        this.CoursesProvider = CoursesProvider;
        this.LecturesProvider = LecturesProvider;
    }

    async updateLectures(dataSet) {
        try {
            if (!dataSet.length) throw new Error("Fetch data first!");

            for (const row of dataSet) {
                const date = (new Date()).toISOString();
                await this.LecturesProvider.updateDatabase(
                    {
                        uid: '',
                        dtstamp: date,
                        dtstart: Date.parse(row.Beginn),
                        class: 'PUBLIC',
                        created: date,
                        description: row.Person,
                        'last-modified': date,
                        location: row.Raum,
                        summary: row.Name,
                        dtend: Date.parse(row.Ende),
                        course: row.Kurs,
                        lastTouched: date
                    }
                )
            }
            return { status: 1 };
        } catch (error) {
            Winston.error(error);
            return { status: -1 };
        }
    }

    /**
     * 
     * @returns 
     */
    async updateCourses(dataSet) {
        try {
            if (!dataSet.length) throw new Error("Fetch data first!");

            for (const row of dataSet) {
                if (!row.Kurs) continue;
                const courseString = row.Kurs.split(',');
                for (const element of courseString) {
                    await this.CoursesProvider.updateDatabase({ course: element });
                }
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