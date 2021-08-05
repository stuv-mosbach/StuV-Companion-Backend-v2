"use strict"

const assert = require('assert');
const iCalParser = new (require('../../utils/iCalParser'))();

module.exports = class MochaEventsProvider {
    constructor(eventsProvider) {
        this.eventsProvider = eventsProvider;
    }

    async runTest() {
        const _this = this;
        describe("eventsProvider - test public methods", function () {
            it("updateDatabase(element)", async () => {
                const result = await iCalParser.main(_this.eventsProvider.calendarUrl);
                if (result.status <= 0) throw new Error(`Can't parse events`);
                for (const element of result.events) {
                    const res = await _this.eventsProvider.updateDatabase(element);
                    assert.strictEqual(res.status, 1);
                }
            });
            it("updateEvents()", async () => {
                const res = await _this.eventsProvider.updateEvents();
                assert.strictEqual(res.status, 1);
            });
        });
    }

}
