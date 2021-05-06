"use strict";

const axios = require("axios");
const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("./Winston"))(config.log).logger;
// const http = require('http');
// const https = require('https');
const ical = require('ical.js');

module.exports = class ICalParser {

	/**
	 * Instantiate ICalParser
	 */
	constructor() {

		/**
		 * 
		 * @param {Array} e 
		 * @returns event
		 */
		this.flattenEvent = function (e) {
			let event = {};
			for (let i = 0; i < e[1].length; i++) {
				let prop = e[1][i];
				event[prop[0]] = prop[3];
			}
			return event;
		}

	}

	/**
	 * 
	 * @param {String} url 
	 * @returns {Promise} {status: Number}
	 */
	async main(url) {
		try {
			const result = [];
			const get = await axios.get(url);
			if (!get.data) throw new Error("No data to parse!");
			const res = ical.parse(get.data);
			for (const element of res[2]) {
				result.push(await this.flattenEvent(element));
			}
			return { status: 1, events: result };
		} catch (e) {
			Winston.error(e);
			return { status: -1 }
		}
	}
}