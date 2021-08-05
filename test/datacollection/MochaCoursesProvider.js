"use strict"

const assert = require('assert');
const axios = require("axios");

module.exports = class MochaRaplaTest {
    constructor(coursesProvider) {
        this.coursesProvider = coursesProvider;
    }

    async runTest() {
        const _this = this;
        describe("coursesProvider - test public methods", function () {
            it("updateDatabase(element)", async () => {                
                const plain = await axios.get(_this.coursesProvider.courseUrl);
                const result = await _this.coursesProvider.formatAndCleanUp(plain.data);
                for (const element of result) {
                    const res = await _this.coursesProvider.updateDatabase(element);
                    assert.strictEqual(res.status, 1);
                }
            });
            it("formatAndCleanUp()", async () => {
                const plain = await axios.get(_this.coursesProvider.courseUrl);
                const res = await _this.coursesProvider.formatAndCleanUp(plain.data);
                assert.strictEqual(res instanceof Array, true);
            });
            it("updateCourses()", async () => {
                const res = await _this.coursesProvider.updateCourses();
                assert.strictEqual(res.status, 1);
            });
        });
    }

}
