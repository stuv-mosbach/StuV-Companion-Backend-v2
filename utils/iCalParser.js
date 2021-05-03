"use strict";

const path = require("path");
const config = require(path.resolve(process.cwd() + '/config.json'));
const Winston = new (require("./Winston"))(config.log).logger;
const http = require('http');
const https = require('https');
const ical = require('ical.js');

module.exports = class ICalParser {
	constructor() {

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
	 * @returns {Object}
	 */
	async parse(url) {
		try {
			try {

				http.get(url, data => {
					try {
						let parsed = ical.parse(data);
						let events = parsed[2];

						let result = [];
						events.forEach(e => result.push(this.flattenEvent(e)));
						resolve({ events: result });
					} catch (e) {
						Winston.error(e);
					}
				})
			} catch (e) {
				Winston.error(e);
				return { status: -1 }
			}
		} catch (e) {
			Winston.error(e);
			return { status: -1 }
		}

	}

	async main(url) {
		try {
			const protocol = (url.substring(0, 5) === "https") ? https : http;

			protocol.get(url, data => {
				try {
					let parsed = ical.parse(data);
					let events = parsed[2];

					let result = [];
					events.forEach(e => result.push(flattenEvent(e)));
					return { status: 1, events: result };
				} catch (e) {
					Winston.error(e);
					return { status: -1 }
				}
			})
		} catch (e) {
			Winston.error(e);
			return { status: -1 }
		}
	}
}