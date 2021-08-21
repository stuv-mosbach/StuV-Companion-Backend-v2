"use strict"

const assert = require('assert');
const iCalParser = new (require('../../utils/iCalParser'))();

module.exports = class MochaLecturesProvider {
    constructor(lecturesProvider) {
        this.lecturesProvider = lecturesProvider;
    }

    async runTest() {
        const _this = this;
        describe("lecturesProvider - test public methods", function () {
            it("updateDatabase(element)", async () => {
                const courses = await _this.lecturesProvider.course.find({}).exec();
                const date = new Date();
                for (const element of courses) {
                    if (!element.url) continue;
                    const resElem = await iCalParser.main(element.url);
                    _this.lecturesProvider.cleanUp(date);
                    for (const item of resElem.events) {
                        if(!item.dtstart || Date.parse(item.dtstart) < new Date()) continue;
                        item.course = element.course;
                        const res = await _this.lecturesProvider.updateDatabase(item, date);
                        assert.strictEqual(res.status, 1);
                    }
                }
            });
            it("updateLectures()", async () => {
                const res = await _this.lecturesProvider.updateLectures();
                assert.strictEqual(res.status, 1);
            });
        });
    }

}

