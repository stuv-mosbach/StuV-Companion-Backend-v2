"use strict"

const assert = require('assert');
const lineSplitter = require('split-lines');
const crawler = require('crawler-request');

module.exports = class MochaMensaplanProvider {
    constructor(mensaplanProvider) {
        this.mensaplanProvider = mensaplanProvider;
    }

    async runTest() {
        const _this = this;
        describe("mensaplanProvider - test public methods", function () {            
            let pdfDoc = {};
            beforeEach(async ()=>{
                pdfDoc = await crawler(_this.mensaplanProvider.pdfUrl);
            })
            it("updateDatabase(element)", async () => {
                const res = await _this.mensaplanProvider.updateDatabase(await _this.mensaplanProvider.createJSON(lineSplitter(pdfDoc.text)));
                assert.strictEqual(res.status, 1);
            });
            it("createJSON(data)", async () => {
                const res = await _this.mensaplanProvider.createJSON(lineSplitter(pdfDoc.text));
                assert.strictEqual(res instanceof Object, true);
            });
            it("updateMensaplan()", async () => {
                const res = await _this.mensaplanProvider.updateMensaplan();
                assert.strictEqual(res.status, 1);
            });            
        });
    }

}
