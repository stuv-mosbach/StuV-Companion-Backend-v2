"use strict"

const assert = require('assert');

module.exports = class MochaRaplaTest {
    constructor(raplaTest) {
        this.raplaTest = raplaTest;
    }

    async runTest() {
        const _this = this;        
        describe("RaplaTest - test public methods", function () {
            it("fetchFromRapla", async () => {
                const res = await _this.raplaTest.fetchFromRapla();
                assert.strictEqual(res.data instanceof Array, true);
            });
        });
    }

}
