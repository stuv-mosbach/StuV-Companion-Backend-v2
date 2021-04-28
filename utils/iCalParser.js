"use strict";

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
						console.error(e);
					}
				})
			} catch (e) {
				console.error(e);
				return { status: -1 }
			}
		} catch (e) {
			console.error(e);
			return { status: -1 }
		}

	}

	async main(url) {
		try {
			const protocol = (url.substring(0,5) === "https") ? https : http;			

			return protocol.get(url, data => {
				try {
					let parsed = ical.parse(data);
					let events = parsed[2];

					let result = [];
					events.forEach(e => result.push(flattenEvent(e)));
					return { status: 1, events: result };
				} catch (e) {
					console.error(e);
					return { status: -1 }
				}
			})
		} catch (e) {
			console.error(e);
			return { status: -1 }
		}
	}

	// 	return new Promise((resolve, reject) => {
	// 		rp(args).then((txt) => {
	// 			try {
	// 				let parsed = ical.parse(txt);
	// 				let events = parsed[2];

	// 				let result = [];
	// 				events.forEach(e => result.push(flattenEvent(e)));
	// 				resolve({ events: result });
	// 			} catch (e) {
	// 				console.log(e);
	// 				reject(e.message);
	// 			}
	// 		})
	// 			.catch((e) => {
	// 				reject(e);
	// 			});
	// 	});
	// }
}