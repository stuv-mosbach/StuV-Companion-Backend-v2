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
                const res = await _this.raplaTest.updateCourses(await _this.raplaTest.fetchFromRapla());
                assert.strictEqual(res.status, 1);
            });
            it("fetchFromRapla()", async () => {
                const res = await _this.raplaTest.fetchFromRapla();
                assert.strictEqual(res instanceof Array, true);
            });
        });
    }

}
