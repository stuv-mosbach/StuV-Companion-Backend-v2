"use strict"

const assert = require('assert');
const Reader = new (require('rss-parser'))();


module.exports = class MochaNewsProvider {
    constructor(newsProvider) {
        this.newsProvider = newsProvider;
    }

    async runTest() {
        const _this = this;
        describe("eventsProvider - test public methods", function () {
            it("updateDBEntrys(element)", async () => {
                const newsData = await Reader.parseURL(_this.newsProvider.newsUrl);
                for (const element of newsData.items) {
                    const res = await _this.newsProvider.updateDBEntrys(element);
                    assert.strictEqual(res.status, 1);
                }
            });
            it("loadFeed()", async () => {
                const res =await _this.newsProvider.loadFeed();
                assert.strictEqual(res.status, 1);
            });
        });
    }

}
