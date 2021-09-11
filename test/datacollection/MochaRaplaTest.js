"use strict"

const assert = require('assert');

module.exports = class MochaRaplaTest {
    constructor(raplaTest) {
        this.raplaTest = raplaTest;
    }

    async runTest() {
        const _this = this;        
        describe("RaplaTest - test public methods", function () {
            it("updateCourses()", async () => {
                const res = await _this.raplaTest.updateCourses(await _this.raplaTest.fetchCSVFromRapla());
                assert.strictEqual(res.status, 1);
            });
            it("updateLectures()", async () => {
                const res = await _this.raplaTest.updateLectures(await _this.raplaTest.fetchCSVFromRapla());
                assert.strictEqual(res.status, 1);
            });
            it("fetchCSVFromRapla()", async () => {
                const res = await _this.raplaTest.fetchCSVFromRapla();
                assert.strictEqual(res instanceof Array, true);
            });
            it("fetchHTMLFromRapla()", async () => {
                const res = await _this.raplaTest.fetchHTMLFromRapla();
                assert.strictEqual(res instanceof Array, true);
            });
        });
    }
}
